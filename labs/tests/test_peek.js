const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const script=fs.readFileSync(path.join(__dirname,'../watchface/src/pkjs/peek.js'),'utf8');
function load(initial) {
 let stored=initial ? JSON.stringify(initial):null,sent=[],timers=new Map(),id=0,handlers=[],unsubscribed=0;
 const plugins=[{uuid:'stocks',name:'Stocks',sources:[{category:'finance',items:['stock'],properties:{name:['shortText'],price:['numericValue'],image:['image'],history:['series.numericValue']}}]}];
 const api={enumeratePlugins:()=>plugins,subscribeToSource:o=>{handlers.push(o);return {unsubscribe:()=>unsubscribed++};},sendAppMessage:(p,ok)=>{sent.push(p);if(ok)ok();}};
 const context={module:{exports:{}},localStorage:{getItem:()=>stored,setItem:(k,v)=>stored=v},setTimeout:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},clearTimeout:i=>timers.delete(i),Date,console};
 vm.runInNewContext(script,context);const peek=context.module.exports;peek.configure(api,false);
 return {peek,api,plugins,sent,handlers,stored:()=>stored,unsubscribed:()=>unsubscribed,timerCount:()=>timers.size,flush:()=>{for(const [i,t] of [...timers]){if(t.ms<=1000){timers.delete(i);t.fn();}}}};
}
const choice={plugin:'stocks',category:'finance',item:'stock',property:'price',instanceId:'AAPL',pluginName:'Stocks'};
const envelope={pluginUuid:'stocks',validUntilMs:null,instances:[{instanceId:'AAPL',properties:{name:{shortText:{text:'APPLE'}},price:{numericValue:{value:245.3,unit:'USD'}}}},{instanceId:'MSFT',properties:{name:{shortText:{text:'MICROSOFT'}},price:{numericValue:{value:400,unit:'USD'}}}}]};
let x=load();let catalogue=x.peek.catalogue();assert.equal(catalogue.length,1);assert.deepEqual(Array.from(catalogue[0].properties),['name','price']);
let response;
x.peek.handle({type:'peek.inspect',id:catalogue[0].id},r=>response=r);
x.handlers.at(-1).onData(envelope);assert.equal(response.instances.length,2);assert.equal(response.instances[0].values.price,'$245.30');
x.peek.handle({type:'peek.stage',selection:choice},r=>response=r);assert(response.ok);assert.equal(x.stored(),null);
x.peek.cancel();assert.equal(x.stored(),null);
x.peek.handle({type:'peek.stage',selection:choice},r=>response=r);x.peek.commit();assert.equal(JSON.parse(x.stored()).instanceId,'AAPL');
x.peek.configure(x.api,true);x.handlers.at(-1).onData(envelope);x.flush();assert.equal(x.sent.at(-1).PeekFirst,'APPLE');assert.equal(x.sent.at(-1).PeekSecond,'$245.30');
let restart=load(JSON.parse(x.stored()));restart.peek.configure(restart.api,true);assert.equal(restart.handlers.at(-1).plugin,'stocks');
let p=x.peek.packet(envelope,choice,Date.now());assert.equal(p.PeekStatus,1);
assert.equal(x.peek.packet(envelope,{...choice,instanceId:'REMOVED'},Date.now()).PeekDetail,'ITEM UNAVAILABLE');
assert.equal(x.peek.packet({...envelope,pluginUuid:'different'},choice,Date.now()).PeekStatus,0);
assert.equal(x.peek.packet({...envelope,validUntilMs:1},choice,Date.now()).PeekDetail,'STALE READING');
x.handlers.at(-1).onError({code:'PERMISSION_DENIED'});x.flush();assert.equal(x.sent.at(-1).PeekDetail,'ALLOW IN PHONE');
const old=x.handlers.at(-1);x.peek.configure(x.api,false);const n=x.sent.length;old.onData(envelope);x.flush();assert.equal(x.sent.length,n);
x.plugins.length=0;x.peek.configure(x.api,true);x.flush();assert.equal(x.sent.at(-1).PeekDetail,'PLUGIN UNAVAILABLE');
assert.equal(x.peek.handle({},()=>{}),false);
assert.equal(x.peek.valueOf({boolean:{value:false}}),'OFF');assert.equal(x.peek.valueOf({numericValue:{value:0,unit:'%'}}),'0 %');
x.peek.handle({type:'peek.stage',selection:{...choice,property:'image'}},r=>response=r);assert(response.error);
console.log('Plugin Peek discovery, selection, lifecycle and packet tests passed');

let z=load(choice),reply;
z.peek.handle({type:'peek.inspect',id:z.peek.catalogue()[0].id},r=>reply=r);
z.handlers.at(-1).onData({...envelope,pluginUuid:'fallback'});assert.equal(reply.error,'SELECTED PLUGIN UNAVAILABLE');
z.peek.handle({type:'peek.clear'},r=>reply=r);z.peek.cancel();assert.equal(JSON.parse(z.stored()).plugin,'stocks');
z.peek.handle({type:'peek.clear'},r=>reply=r);z.peek.commit();assert.equal(z.stored(),'null');
const signed={...envelope,instances:[{instanceId:'AAPL',properties:{name:{shortText:{text:'CHANGE'}},price:{shortText:{text:'−3.5%'}}}}]};
assert.equal(z.peek.packet(signed,choice,Date.now()).PeekSecond,'-3.5%');
console.log('Peek clear/fallback and signed-value regressions passed');

const thrown=load();thrown.api.subscribeToSource=()=>{throw new Error('bridge unavailable');};let replies=0;
thrown.peek.handle({type:'peek.inspect',id:thrown.peek.catalogue()[0].id},r=>{replies++;assert(r.error);});
assert.equal(replies,1);assert.equal(thrown.timerCount(),0);
const accounting={...envelope,instances:[{instanceId:'AAPL',properties:{name:{shortText:{text:'LOSS'}},price:{shortText:{text:'($3.50)'}}}}]};
assert.equal(thrown.peek.packet(accounting,choice,Date.now()).PeekSecond,'($3.50)');
