/* Discover and read installed plugins; no service-specific API or network access. */
var api, active, inspection, pending, inspectGeneration = 0, activeGeneration = 0;
var inspectionTimer, inspectionReply, sendTimer, nextPacket;
var STORE = 't9-peek-reading';
var SHAPES = ['shortText','longText','numericValue','boolean','timestamp'];
function ascii(value, limit) {
  return String(value == null ? '' : value).replace(/\u2212/g,'-').replace(/€/g,'EUR').replace(/£/g,'GBP').replace(/¥/g,'JPY').toUpperCase().replace(/[^A-Z0-9 .,:%+\-\/$'()]/g,'').replace(/\s+/g,' ').trim().slice(0,limit);
}
function text(p) { return p && ((p.shortText && p.shortText.text) || (p.longText && p.longText.text)) || ''; }
function valueOf(p) {
  if (!p) return '';
  var t=text(p); if(t) return String(t);
  var n=p.numericValue;
  if(n && typeof n.value==='number' && isFinite(n.value)) {
    if(n.unit==='USD' || n.unit==='$') return '$'+n.value.toFixed(2);
    return String(Math.round(n.value*100)/100)+(n.unit ? ' '+n.unit : '');
  }
  if(p.boolean && typeof p.boolean.value==='boolean') return p.boolean.value ? 'ON' : 'OFF';
  if(p.timestamp && typeof p.timestamp.value==='number' && isFinite(p.timestamp.value)) {
    var date=new Date(p.timestamp.value*1000);
    if(isFinite(date.getTime())) return date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  }
  return '';
}
function catalogue() {
  if(!api || typeof api.enumeratePlugins!=='function') return [];
  var entries=[];
  (api.enumeratePlugins() || []).forEach(function(plugin) {
    (plugin.sources || []).forEach(function(source) {
      var properties=Object.keys(source.properties || {}).filter(function(p) {
        return (source.properties[p] || []).some(function(shape){ return SHAPES.indexOf(shape)>=0; });
      });
      if(!properties.length) return;
      (source.items || []).forEach(function(item) {
        entries.push({id:JSON.stringify([plugin.uuid,source.category,item]),plugin:plugin.uuid,
          pluginName:plugin.name || plugin.uuid,category:source.category,item:item,properties:properties});
      });
    });
  });
  return entries;
}
function saved() {
  try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch(e) { return null; }
}
function sourceFor(choice) {
  return catalogue().filter(function(s) {return choice && s.plugin===choice.plugin && s.category===choice.category && s.item===choice.item;})[0];
}
function unavailable(reason) {
  return {PeekFirst:'NO',PeekSecond:'READING',PeekDetail:ascii(reason,30),PeekValidUntil:0,PeekStatus:0};
}
function packet(envelope, choice, now) {
  if(!envelope || !Array.isArray(envelope.instances)) return unavailable('NO DATA');
  if(envelope.pluginUuid && envelope.pluginUuid.toLowerCase()!==choice.plugin.toLowerCase()) return unavailable('PLUGIN CHANGED');
  var instance=choice.instanceId ? envelope.instances.filter(function(i){return i.instanceId===choice.instanceId;})[0] : envelope.instances[0];
  if(!instance) return unavailable('ITEM UNAVAILABLE');
  var p=instance.properties || {}, value=ascii(valueOf(p[choice.property]),30);
  if(!value) return unavailable('READING UNAVAILABLE');
  var expiry=envelope.validUntilMs == null ? now+1800000 : Number(envelope.validUntilMs);
  if(!isFinite(expiry) || expiry<=now) return unavailable('STALE READING');
  var name=ascii(text(p.name) || instance.instanceId || choice.label || choice.item,36) || 'READING';
  var split=name.length>18 ? name.lastIndexOf(' ',18) : name.indexOf(' ');
  if(split<1 && name.length>18) split=18;
  var first=split>0 ? name.slice(0,split) : name;
  var second=split>0 ? name.slice(split).trim().slice(0,19) : value.slice(0,19);
  var detail=split>0 ? ascii(choice.property.replace(/_/g,' ')+' '+value,30) : ascii(choice.property.replace(/_/g,' ')+' - '+(choice.pluginName || choice.item),30);
  return {PeekFirst:first.slice(0,19),PeekSecond:second,PeekDetail:detail,
    PeekValidUntil:Math.floor(Math.min(expiry,now+1800000)/1000),PeekStatus:1};
}
function send(packet) {
  nextPacket=packet;
  if(sendTimer) return;
  sendTimer=setTimeout(function(){
    sendTimer=null;
    var current=nextPacket,generation=activeGeneration;nextPacket=null;
    api.sendAppMessage(current,function(){},function(){
      if(generation!==activeGeneration)return;
      if(!nextPacket) nextPacket=current;
      if(!sendTimer) sendTimer=setTimeout(function(){sendTimer=null;var retry=nextPacket;nextPacket=null;if(retry)api.sendAppMessage(retry,function(){},function(){});},1000);
    });
  },200);
}
function configure(pebble, enabled) {
  api=pebble; activeGeneration++;
  var generation=activeGeneration;
  if(active) active.unsubscribe();active=null;
  if(sendTimer)clearTimeout(sendTimer);sendTimer=null;nextPacket=null;
  if(!enabled) return;
  var choice=saved(), source;
  try { source=sourceFor(choice); } catch(e) { send(unavailable('ENABLE PLUGINS'));return; }
  if(!choice) { send(unavailable('CHOOSE IN SETTINGS'));return; }
  if(!source || source.properties.indexOf(choice.property)<0) {send(unavailable('PLUGIN UNAVAILABLE'));return;}
  try {
    active=api.subscribeToSource({plugin:choice.plugin,category:choice.category,item:choice.item,
      properties:['name',choice.property],
      onData:function(e){if(generation===activeGeneration)send(packet(e,choice,Date.now()));},
      onError:function(e){if(generation===activeGeneration)send(unavailable(e.code==='PERMISSION_DENIED' ? 'ALLOW IN PHONE' : e.code || 'CHECK PHONE'));}
    });
  } catch(e){send(unavailable('ENABLE PLUGINS'));}
}
function stopInspection() {
  if(inspectionReply){var reply=inspectionReply;inspectionReply=null;reply({error:'SELECTION CHANGED'});}
  inspectGeneration++;
  if(inspection)inspection.unsubscribe();inspection=null;
  if(inspectionTimer)clearTimeout(inspectionTimer);inspectionTimer=null;
}
function handle(message, respond) {
  if(!message || typeof message.type!=='string' || message.type.indexOf('peek.')!==0) return false;
  try {
    if(message.type==='peek.catalogue') {respond({sources:catalogue(),selection:saved()});return true;}
    if(message.type==='peek.clear') {stopInspection();pending=null;respond({ok:true});return true;}
    if(message.type==='peek.stage') {
      var choice=message.selection;
      var source=sourceFor(choice);
      if(!source || source.properties.indexOf(choice.property)<0 || typeof choice.instanceId!=='string' || choice.instanceId.length>128) {respond({error:'INVALID READING'});return true;}
      pending={plugin:source.plugin,category:source.category,item:source.item,property:choice.property,
        instanceId:choice.instanceId,label:source.item,pluginName:source.pluginName};
      respond({ok:true});return true;
    }
    if(message.type==='peek.inspect') {
      stopInspection();pending=undefined;var token=inspectGeneration, done=false;
      var selected=catalogue().filter(function(s){return s.id===message.id;})[0];
      if(!selected){respond({error:'PLUGIN UNAVAILABLE'});return true;}
      inspectionReply=function(result){if(done)return;done=true;respond(result);};
      function finish(result){if(token!==inspectGeneration || done)return;if(inspectionTimer)clearTimeout(inspectionTimer);inspectionTimer=null;var reply=inspectionReply;inspectionReply=null;if(reply)reply(result);}
      inspectionTimer=setTimeout(function(){finish({error:'WAITING - CHECK PERMISSIONS'});},5000);
      inspection=api.subscribeToSource({plugin:selected.plugin,category:selected.category,item:selected.item,
        onData:function(envelope){if(envelope.pluginUuid && envelope.pluginUuid.toLowerCase()!==selected.plugin.toLowerCase()){finish({error:'SELECTED PLUGIN UNAVAILABLE'});return;}finish({instances:(envelope.instances || []).map(function(i){
          var values={};selected.properties.forEach(function(p){values[p]=valueOf((i.properties || {})[p]);});
          return {id:i.instanceId,name:text((i.properties || {}).name) || i.instanceId,values:values};
        })});},
        onError:function(e){finish({error:e.code || 'CHECK PHONE'});}
      });return true;
    }
    respond({error:'UNKNOWN REQUEST'});return true;
  } catch(e){inspectionReply=null;stopInspection();respond({error:'ENABLE PLUGINS / CHECK PHONE'});return true;}
}
function commit(){if(pending!==undefined)localStorage.setItem(STORE,JSON.stringify(pending));pending=undefined;stopInspection();}
function cancel(){pending=undefined;stopInspection();}
module.exports={configure:configure,handle:handle,commit:commit,cancel:cancel,packet:packet,catalogue:catalogue,valueOf:valueOf};
