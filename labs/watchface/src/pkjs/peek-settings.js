/* Runs inside Clay's native settings WebView. */
module.exports = function() {
  var clay=this;
  clay.on(clay.EVENTS.AFTER_BUILD,function(){
    var host=clay.getItemById('peekControls').$element[0];
    while(host.firstChild)host.removeChild(host.firstChild);
    var status=document.createElement('p');status.setAttribute('role','status');host.appendChild(status);
    function select(labelText,id){
      var label=document.createElement('label');label.textContent=labelText;label.htmlFor=id;
      var select=document.createElement('select');select.id=id;select.style.cssText='display:block;width:100%;max-width:100%;margin:8px 0 18px;padding:10px;font-size:16px';
      host.appendChild(label);host.appendChild(select);return select;
    }
    var source=select('Installed plugin / source','peek-source');
    var property=select('Reading','peek-property');
    var item=select('Item','peek-item');
    var preview=document.createElement('p');preview.id='peek-live-value';host.appendChild(preview);
    var refresh=document.createElement('button');refresh.type='button';refresh.textContent='Refresh reading';host.appendChild(refresh);
    var sources=[],instances=[],selection=null,revision=0;
    function options(select,entries,value){
      select.textContent='';entries.forEach(function(entry){var option=document.createElement('option');option.value=entry.value;option.textContent=entry.label;select.appendChild(option);});
      if(value!==undefined)select.value=value;
      select.disabled=!entries.length;
    }
    function request(message){
      if(typeof Pebble==='undefined' || typeof Pebble.sendMessage!=='function')return Promise.reject(new Error('Enable plugin preview to choose a reading.'));
      return Pebble.sendMessage('pkjs',message);
    }
    function selectedSource(){return sources.filter(function(s){return s.id===source.value;})[0];}
    function updatePreview(){
      var found=instances.filter(function(i){return i.id===item.value;})[0];
      preview.textContent=found ? (found.values[property.value] || 'Reading currently unavailable') : 'No item available';
    }
    function stage(){
      updatePreview();var s=selectedSource();if(!s || !property.value || !item.value)return;
      request({type:'peek.stage',selection:{plugin:s.plugin,category:s.category,item:s.item,property:property.value,instanceId:item.value}}).then(function(result){
        status.textContent=result.error || 'Reading selected. Save to watch to keep it.';
      }).catch(function(){status.textContent='Could not select reading. Refresh and retry.';});
    }
    function inspect(restore){
      var s=selectedSource(),token=++revision;
      instances=[];options(item,[]);preview.textContent='';
      if(!s){options(property,[]);request({type:'peek.clear'}).then(function(){status.textContent='No reading selected. Save to watch to clear it.';}).catch(function(){status.textContent='Could not clear reading.';});return;}
      options(property,s.properties.map(function(p){return {value:p,label:p.replace(/_/g,' ')};}),restore ? restore.property : s.properties[0]);
      status.textContent='Reading plugin… approve any permission request in the Pebble app.';
      request({type:'peek.inspect',id:s.id}).then(function(result){
        if(token!==revision)return;
        if(result.error){status.textContent=result.error+' — selection not changed.';return;}
        instances=result.instances || [];
        options(item,instances.map(function(i){return {value:i.id,label:i.name || i.id};}));
        if(restore && restore.instanceId){
          if(instances.some(function(i){return i.id===restore.instanceId;}))item.value=restore.instanceId;
          else {options(item,[{value:'',label:'Previously selected item unavailable'}].concat(instances.map(function(i){return {value:i.id,label:i.name || i.id};})));status.textContent='Selected item unavailable. Choose another item.';updatePreview();return;}
        }
        status.textContent=instances.length ? 'Choose a reading and item, then Save to watch.' : 'No items. Configure this plugin, then Refresh reading.';
        stage();
      }).catch(function(){if(token===revision)status.textContent='Could not read plugin. Check permissions, then Refresh reading.';});
    }
    source.onchange=function(){inspect(null);};property.onchange=stage;item.onchange=stage;
    refresh.onclick=function(){
      var s=selectedSource();
      inspect(s && property.value && item.value ? {plugin:s.plugin,category:s.category,item:s.item,property:property.value,instanceId:item.value} : null);
    };
    function load(){
      request({type:'peek.catalogue'}).then(function(result){
        sources=result.sources || [];selection=result.selection;
        var id=selection ? JSON.stringify([selection.plugin,selection.category,selection.item]) : '';
        options(source,[{value:'',label:'Choose an installed plugin'}].concat(sources.map(function(s){return {value:s.id,label:s.pluginName+' · '+s.category+' / '+s.item};})),id);
        if(id && !sources.some(function(s){return s.id===id;})){source.value='';status.textContent='Selected plugin unavailable. Install it again or choose another.';}
        else if(id)inspect(selection);
        else status.textContent=sources.length ? 'Choose a plugin. Selection is saved with Save to watch.' : 'No readable plugins found. Enable experimental plugins / permissions.';
      }).catch(function(){status.textContent='Enable experimental plugins / permissions, then reopen settings.';});
    }
    options(property,[]);options(item,[]);status.textContent='Waiting for Pebble…';
    if(typeof Pebble!=='undefined' && Pebble.addEventListener)Pebble.addEventListener('ready',function(event){if(event.target==='pkjs')load();});
    // Native bridge messages are also safe before ready; allow manual retry.
    refresh.addEventListener('click',function(){if(!sources.length)load();});
  });
};
