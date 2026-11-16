const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'../watchface');
const keys={};JSON.parse(fs.readFileSync(root+'/package.json')).pebble.messageKeys.forEach((key,index)=>keys[key]=10000+index);
const events={},storage={},sent=[],subscriptions=[],timers=new Map();let timerId=0;
const api={platform:'ios',getAccountToken:()=>'',getWatchToken:()=>'',getActiveWatchInfo:()=>({platform:'emery',firmware:{major:4,minor:33,patch:1}}),
 addEventListener:(name,fn)=>(events[name]||(events[name]=[])).push(fn),
 enumeratePlugins:()=>[{uuid:'stocks',name:'Stocks',sources:[{category:'finance',items:['stock'],properties:{name:['shortText'],price:['numericValue']}}]}],
 subscribeToSource:o=>{subscriptions.push(o);return {unsubscribe:()=>{}};},sendAppMessage:(p,ok)=>{sent.push(p);if(ok)ok();}};
const context=vm.createContext({Pebble:api,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},console,Date,
 setTimeout:(fn,ms)=>{timers.set(++timerId,fn);return timerId;},clearTimeout:i=>timers.delete(i)});
const modules={};
function run(name,file){const mod={exports:{}};context.testModule=mod;context.testRequire=n=>n==='message_keys'?keys:modules[n];vm.runInContext('(function(module,exports,require){'+fs.readFileSync(file,'utf8')+'\n})(testModule,testModule.exports,testRequire)',context);modules[name]=mod.exports;return mod.exports;}
run('@rebble/clay',root+'/node_modules/@rebble/clay/src/js/index.js');
run('./weather',root+'/src/pkjs/weather.js');run('./peek',root+'/src/pkjs/peek.js');run('./peek-settings',root+'/src/pkjs/peek-settings.js');
run('main',root+'/src/pkjs/index.js');
function emit(name,event){(events[name]||[]).forEach(fn=>fn(event));}
emit('ready');assert.equal(subscriptions.length,0);
const choice={plugin:'stocks',category:'finance',item:'stock',property:'price',instanceId:'AAPL'};
let response;emit('configmessage',{data:{type:'peek.stage',selection:choice},respond:r=>response=r});assert(response.ok);
emit('webviewclosed',{response:''});assert.equal(storage['t9-peek-reading'],undefined);
emit('configmessage',{data:{type:'peek.stage',selection:choice},respond:r=>response=r});
// Real Clay dropdowns serialize strings. The native Save packet must normalize them.
emit('webviewclosed',{response:JSON.stringify({PaneMode:'2',PeekEnabled:true,KnockSensitivity:'1',AnimationSpeed:'0'})});
assert.equal(JSON.parse(storage['t9-peek-reading']).instanceId,'AAPL');
const save=sent.find(p=>p.Preview===1);assert(save);
assert.strictEqual(save.PaneMode,2);assert.strictEqual(save.PeekEnabled,1);assert.strictEqual(save.KnockSensitivity,1);
assert(subscriptions.some(s=>s.plugin==='stocks' && s.category==='finance'));
emit('ready');assert.strictEqual(sent.at(-1).PeekEnabled,1);
emit('webviewclosed',{response:JSON.stringify({PaneMode:'0',PeekEnabled:true})});
console.log('Real Clay Save/cancel and plugin-selection integration passed');
