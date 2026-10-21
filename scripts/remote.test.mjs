import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {webcrypto} from 'node:crypto';
const source=name=>readFileSync(new URL('../dist/'+name+'.js',import.meta.url),'utf8');
function core(extra={}){const c=vm.createContext({TextEncoder,TextDecoder,btoa,atob,crypto:webcrypto,AbortController,setTimeout,clearTimeout,...extra});vm.runInContext(source('remote-core'),c);return c;}
const key='a'.repeat(64),bridgeKey='b'.repeat(64),id='c'.repeat(32),session='d'.repeat(32),now=Date.now();
const command={id,created:now,session,type:'note',text:'Un mot 🌿 éè',pin:true};

test('remote home commands reject arbitrary services and bound absolute volume',()=>{
  const api=core().HubRemote,base={id,created:now,session,type:'home'};
  for(const value of [
    {entity:'script.shutdown',service:'turn_on'},
    {entity:'constructor.fake',service:'turn_on'},
    {entity:'lock.front_door',service:'unlock'},
    {entity:'light.salon',service:'toggle'},
    {entity:'vacuum.robot',service:'clean_segment'},
    {entity:'media_player.home',service:'volume_set',volume:-.01},
    {entity:'media_player.home',service:'volume_set',volume:1.01},
    {entity:'media_player.home',service:'volume_set',volume:'0.5'},
    {entity:'media_player.home',service:'turn_off',volume:.5},
    {entity:'scene.salon',service:'turn_on',data:{entity_id:'script.other'}}
  ])assert.throws(()=>api.validate(api.decode(api.encode({...base,...value})),now));
  for(const volume of [0,.5,1])assert.doesNotThrow(()=>api.validate(api.decode(api.encode({...base,entity:'media_player.home',service:'volume_set',volume})),now));
});

test('remote accepts only bounded actions, UTF-8 data and a fresh request',()=>{
  const c=core(),api=c.HubRemote;
  assert.deepEqual(JSON.parse(JSON.stringify(api.decode(api.encode(command)))),command);
  const valid=[{id,created:now,session,type:'home',entity:'scene.salon',service:'turn_on'},{id,created:now,session,type:'home',entity:'vacuum.robot',service:'return_to_base'},{id,created:now,session,type:'home',entity:'media_player.home',service:'volume_set',volume:.4},command,{id,created:now,session,type:'timer',seconds:60,label:'Pâtes',tag:'Étape 1'},{id,created:now,session,type:'light',entity:'switch.prise',on:false},{id,created:now,session,type:'task',task:'6Xxyz'}];
  for(const value of valid)assert.equal(api.validate(api.decode(api.encode(value)),now).type,value.type);
  for(const value of [{...command,type:'nav'},{id,created:now,session,type:'constructor'},{id,created:now,session,type:'__proto__'},{...command,text:''},{...command,text:'x'.repeat(401)},{...command,extra:'shell'},{...command,created:now-31000},{...command,created:now+11000},{...command,id:'../x'}, {...valid[1],seconds:0},{...valid[1],seconds:86401},{...valid[2],entity:'script.shutdown'},{...valid[2],on:'false'},{...valid[3],task:'../../account'}])assert.throws(()=>api.validate(api.decode(api.encode(value)),now));
  assert.throws(()=>api.decode('***'));assert.match(api.id(),/^[a-f0-9]{32}$/);
});

test('remote credentials stay in POST data and HTTP failures are not retried',async()=>{
  const api=core().HubRemote,calls=[];
  await api.request(async(url,o)=>{calls.push({url,o});return {ok:true,json:async()=>({accepted:true})};},key,'send',id,api.encode(command));
  assert.equal(calls[0].url,'/cgi-bin/remote.cgi');assert.equal(calls[0].o.credentials,'omit');assert.equal(calls[0].o.body.split('\n')[0],key);assert.ok(!calls[0].url.includes(key));
  let count=0;await assert.rejects(api.request(async()=>{count++;return {ok:false,json:async()=>({error:'Cadre indisponible'})};},key,'status'));assert.equal(count,1);
});

test('CGI enforces origin, key, subnet, bounded payload, duplicate IDs and one-shot claiming',()=>{
  const dir=mkdtempSync(join(tmpdir(),'hub-remote-'));
  try{
    mkdirSync(join(dir,'remote-data'));writeFileSync(join(dir,'remote-enabled'),'');writeFileSync(join(dir,'screen-key'),bridgeKey);writeFileSync(join(dir,'remote-data/access-key'),key);
    // Portability shim only: production uses the actual pinned Android BusyBox.
    const shim=join(dir,'bb');writeFileSync(shim,'#!/bin/sh\ncase "$1" in timeout) shift 3;exec "$@";; ip) echo "    inet 192.168.1.11/24 brd 192.168.1.255";; stat) shift; [ "$1" = -c ] && shift 2; stat -f %m "$1";; *) x=$1;shift;exec "$x" "$@";; esac\n',{mode:0o700});
    let script=readFileSync(new URL('./device/remote.cgi',import.meta.url),'utf8').replace('BASE=/data/local/hub','BASE='+dir).replace('BB=/system/bin/busybox-smp','BB='+shim).replace('[ "$1" = locked ] || exec "$BB" flock -x "$STORE/queue.lock" /system/bin/sh "$0" locked','');
    const call=(op='status',payload='-',extra={},secret=key,commandId='-')=>{
      const body=[secret,op,commandId,payload].join('\n');
      const r=spawnSync('/bin/sh',['-c',script,'remote-test','locked'],{input:body,encoding:'utf8',env:{...process.env,REMOTE_ADDR:'192.168.1.40',HTTP_HOST:'192.168.1.11:4180',HTTP_ORIGIN:'http://192.168.1.11:4180',REQUEST_METHOD:'POST',CONTENT_TYPE:'text/plain',CONTENT_LENGTH:String(Buffer.byteLength(body)),QUERY_STRING:'',...extra}});
      assert.equal(r.status,0,r.stderr);return r.stdout;
    };
    const local={REMOTE_ADDR:'127.0.0.1',HTTP_HOST:'127.0.0.1:4173',HTTP_REFERER:'http://127.0.0.1:4173/'};
    for(const extra of [{HTTP_ORIGIN:'https://evil.test'},{HTTP_HOST:'evil.test:4180'},{REMOTE_ADDR:'192.168.2.4'},{CONTENT_TYPE:'application/x-www-form-urlencoded'},{REQUEST_METHOD:'DELETE'},{QUERY_STRING:'key='+key}])assert.doesNotMatch(call('status','-',extra),/200 OK/);
    assert.doesNotMatch(call('status','-',{},bridgeKey),/200 OK/);
    const api=core().HubRemote,encoded=api.encode(command);
    assert.match(call('send',encoded,{},key,id),/503 Service Unavailable/);
    assert.match(call('publish',api.encode({notes:[]}),local,bridgeKey),/200 OK/);
    assert.doesNotMatch(call('publish',encoded,{},key),/200 OK/);
    assert.match(call('send',encoded,{},key,id),/200 OK/);assert.match(call('send',encoded,{},key,id),/200 OK/);
    assert.ok(existsSync(join(dir,'remote-data',id+'.cmd')));
    assert.match(call('send',encoded,{},key,'a'.repeat(32)),/200 OK/);
    const first=call('status','-',{...local,REQUEST_METHOD:'GET'},bridgeKey);assert.match(first,new RegExp(id));assert.deepEqual(JSON.parse(first.split('\r\n\r\n')[1]).commands.map(x=>x.id),[id,'a'.repeat(32)]); assert.ok(existsSync(join(dir,'remote-data',id+'.run')));
    assert.doesNotMatch(call('status','-',{...local,REQUEST_METHOD:'GET'},bridgeKey),new RegExp(id));
    assert.match(call('ack',api.encode({ok:true,message:'Gardée'}),local,bridgeKey,id),/200 OK/);
    assert.ok(!existsSync(join(dir,'remote-data',id+'.run')));assert.match(call(),new RegExp(id));
    assert.doesNotMatch(call('send','a'.repeat(2049),{},key,'d'.repeat(32)),/200 OK/);
    assert.doesNotMatch(call('send',encoded,{},key,'../file'),/200 OK/);
    assert.doesNotMatch(call('send','$(touch hacked)',{},key,'d'.repeat(32)),/200 OK/);
  }finally{rmSync(dir,{recursive:true,force:true});}
});

test('bridge pauses hidden, acknowledges once and never changes the frame route',async()=>{
  let hidden=true,calls=[],execute=0,scheduled=[],events={},publishedSession='';
  const c=core({location:{protocol:'http:',hostname:'127.0.0.1',port:'4173'},AbortSignal,document:{get hidden(){return hidden;},addEventListener:(n,f)=>events[n]=f,removeEventListener(){}},setTimeout:(f)=>{scheduled.push(f);return scheduled.length;},clearTimeout(){},fetch:async(url,options={})=>{
    calls.push({url,options});if(options.body?.split('\n')[1]==='publish')publishedSession=c.HubRemote.decode(options.body.split('\n')[3]).session;return {ok:true,json:async()=>url.includes('screen')?{key:bridgeKey}:options.method==='POST'?{accepted:true}:{url:'http://192.168.1.11:4180/',key,commands:execute?[]:[{id,payload:c.HubRemote.encode({...command,created:Date.now(),session:publishedSession})}]}};
  }});
  vm.runInContext(source('remote-bridge'),c);
  const bridge=c.HubRemoteBridge.start({snapshot:()=>({notes:[],lights:[],tasks:[]}),execute:async()=>{execute++;return {ok:true};}});
  assert.equal(calls.length,0);hidden=false;events.visibilitychange();await new Promise(r=>setImmediate(r));await new Promise(r=>setImmediate(r));
  assert.equal(execute,1);assert.equal(calls.filter(x=>x.options.body?.split('\n')[1]==='ack').length,1);assert.ok(bridge.pair());
  await bridge.refresh();assert.equal(execute,1);bridge.stop();
});

test('frame remote dispatcher keeps task/project separation and never routes to main handle',async()=>{
  const app=source('app'),section=app.slice(app.indexOf('  function remoteHomeDevices(){'),app.indexOf("  if(typeof HubRemoteBridge"));
  let actions=[],saved=[],rendered=0;
  const c=vm.createContext({Date,Error,HubRemote:core().HubRemote,HubHA:{group:e=>e.entity_id.startsWith('light.')?'lighting':'',supports:()=>true},dayTools:{notes:[]},house:{status:'connected',client:{confirmedCall:async()=>({confirmed:true})},entities:[{entity_id:'light.lamp',state:'off',attributes:{friendly_name:'Lampe',access_token:'not-shared'}}],pending:'',generation:1},daily:{loaded:true,busy:false,items:[{id:'t1',content:'Faire',project_id:'tasks',due_date:''},{id:'shop1',content:'Lait',project_id:'courses'}]},shop:{client:{toggle:async(...x)=>actions.push(x)}},timerItems:[],state:{page:'kitchen',modal:null,sleep:true},document:{hidden:false},HubTools:{timers:{start:()=>[{id:'1'}]}},save:(...x)=>saved.push(x),saveTimers(){},renderTimer(){},scheduleTick(){},renderOverlay(){},repaintDaily(){},render(){rendered++;},houseUpdate(){},houseError:()=>'',excludedShoppingProjects:()=>['courses'],serviceRender(){},refreshDaily:async()=>{},localStorage:{setItem(){}},mainDirty:false});
  vm.runInContext(section,c);const snap=c.remoteSnapshot();assert.equal(snap.tasks.length,1);assert.ok(!JSON.stringify(snap).includes('not-shared'));
  await c.executeRemote({type:'note',id,text:'Bonjour',pin:true});await c.executeRemote({type:'timer',seconds:60,label:'Pâtes',tag:'Étape 1'});await c.executeRemote({type:'task',task:'t1'});
  assert.equal(rendered,0);assert.equal(c.state.page,'kitchen');assert.equal(c.state.sleep,true);assert.deepEqual(actions,[['t1',true]]);assert.equal(c.dayTools.notes[0].text,'Bonjour');await assert.rejects(c.executeRemote({type:'task',task:'shop1'}));await assert.rejects(c.executeRemote({type:'nav',page:'home'}));c.localStorage.setItem=()=>{throw Error('quota');};const before=c.dayTools.notes.length;await assert.rejects(c.executeRemote({type:'note',id:'d'.repeat(32),text:'Not saved',pin:true}),/Stockage/);assert.equal(c.dayTools.notes.length,before);
});

 test('remote snapshot is bounded even with long Unicode titles and never mutates the source',()=>{
  const api=core().HubRemote;const data={notes:Array.from({length:12},()=>({text:'🌿'.repeat(200)})),lights:Array.from({length:100},()=>({name:'🌿'.repeat(40)})),tasks:Array.from({length:200},()=>({content:'🌿'.repeat(250)}))};
  const bounded=api.snapshot(data);assert.ok(api.encode(bounded).length<=60000);assert.equal(data.tasks.length,200);assert.equal(bounded.tasksTotal,200);
 });

test('whole-home remote uses current device capabilities and distinguishes accepted scenes from confirmed state',async()=>{
  const calls=[],c=core({Date,Error,house:{status:'connected',pending:'',generation:1,client:{confirmedCall:async(domain,service,target,data)=>{calls.push({domain,service,target,data});return {accepted:true,confirmed:domain!=='scene'&&service!=='volume_set'};}},entities:[
    {entity_id:'scene.salon',state:'unknown',attributes:{friendly_name:'Salon nuit'}},
    {entity_id:'light.lamp',state:'off',attributes:{friendly_name:'Lampe',private_token:'never shared'}},
    {entity_id:'vacuum.robot',state:'docked',attributes:{friendly_name:'Robot',supported_features:8192|4|8|16,battery_level:42}},
    {entity_id:'media_player.home',state:'playing',attributes:{friendly_name:'Sonos',supported_features:128|256|16384|1|4|16|32,volume_level:.4,media_title:'Titre'}},
    {entity_id:'script.other',state:'off',attributes:{friendly_name:'Script'}}
  ]},houseUpdate(){}});
  vm.runInContext(source('home-assistant'),c);
  const app=source('app');vm.runInContext(app.slice(app.indexOf('  function remoteHomeDevices(){'),app.indexOf("  if(typeof HubRemoteBridge")),c);
  const devices=c.remoteHomeDevices();assert.equal(devices.length,4);assert.ok(!JSON.stringify(devices).includes('never shared'));assert.equal(devices.find(e=>e.id==='vacuum.robot').battery,42);
  const scene=await c.executeRemote({type:'home',entity:'scene.salon',service:'turn_on'});assert.equal(scene.ok,true);assert.equal(scene.confirmed,false);assert.match(scene.message,/envoyée/);
  const tv=await c.executeRemote({type:'home',entity:'media_player.home',service:'turn_off'});assert.equal(tv.confirmed,true);
  await c.executeRemote({type:'home',entity:'media_player.home',service:'volume_set',volume:.45});assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1).data)),{volume_level:.45});
  await c.executeRemote({type:'home',entity:'vacuum.robot',service:'return_to_base'});assert.equal(calls.at(-1).service,'return_to_base');
  let n=calls.length;for(const value of [{entity:'script.other',service:'turn_on'},{entity:'light.lamp',service:'volume_set',volume:.4},{entity:'media_player.home',service:'volume_set',volume:2}])await assert.rejects(c.executeRemote({type:'home',...value}));assert.equal(calls.length,n);
  c.house.entities.find(e=>e.entity_id==='vacuum.robot').state='unavailable';await assert.rejects(c.executeRemote({type:'home',entity:'vacuum.robot',service:'start'}));assert.equal(calls.length,n);
  c.house.pending='light.lamp';await assert.rejects(c.executeRemote({type:'home',entity:'media_player.home',service:'media_next_track'}));assert.equal(calls.length,n);
});

test('remote home view exposes grouped controls without arbitrary HTML or unsupported TV playback',()=>{
  const js=source('remote'),start=js.indexOf('  function homeState('),end=js.indexOf('  function update(){'),c=core({online:true,pending:new Map(),esc:s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x])),icon:n=>'<svg data-icon="'+n+'"></svg>'});
  vm.runInContext(js.slice(start,end),c);
  const devices=[
    {id:'scene.night',name:'Salon Nuit',group:'scene',state:'unknown',services:['turn_on']},
    {id:'switch.lamp',name:'Prise',group:'switch',state:'on',services:['turn_on','turn_off']},
    {id:'vacuum.robot',name:'Robot',group:'vacuum',state:'docked',battery:100,services:['start','return_to_base']},
    {id:'media_player.sonos',name:'Sonos',group:'media_player',state:'playing',title:'<img src=x onerror=alert(1)>',volume:.4,services:['media_pause','media_previous_track','media_next_track','volume_set']},
    {id:'media_player.tv',name:'Télévision',group:'media_player',state:'off',services:['turn_on','turn_off']}
  ];
  const html=c.homePanel({ha:true,devices,devicesTotal:5});
  for(const label of ['Scènes','Lampes et prises','Robots aspirateurs','Sonos et télévisions','Retour à la base','Volume'])assert.ok(html.includes(label));
  assert.ok(html.indexOf('Scènes')<html.indexOf('Lampes et prises'));assert.ok(html.includes('data-home-volume="0.45"'));assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));
  assert.match(html,/data-home-entity="media_player.tv" data-home-service="turn_on"/);assert.ok(!html.includes('data-home-entity="media_player.tv" data-home-service="media_play"'));
  c.online=false;assert.match(c.homePanel({ha:true,devices}),/data-home-entity="scene.night" data-home-service="turn_on" disabled/);
});

test('remote bridge refuses commands from before a hidden or reloaded frame session',async()=>{
  let hidden=false,sessionValue='',queued=[],executed=0,acks=[],events={};
  const c=core({location:{protocol:'http:',hostname:'127.0.0.1',port:'4173'},AbortSignal,document:{get hidden(){return hidden;},addEventListener:(n,f)=>events[n]=f,removeEventListener(){}},setTimeout:()=>1,clearTimeout(){},fetch:async(url,o={})=>{
    const op=o.body?.split('\n')[1];if(op==='publish')sessionValue=c.HubRemote.decode(o.body.split('\n')[3]).session;if(op==='ack')acks.push(c.HubRemote.decode(o.body.split('\n')[3]));
    return {ok:true,json:async()=>url.includes('screen')?{key:bridgeKey}:o.method==='POST'?{accepted:true}:{url:'http://192.168.1.11:4180/',key,commands:queued.splice(0)}};
  }});
  vm.runInContext(source('remote-bridge'),c);
  const options={snapshot:()=>({notes:[],lights:[],tasks:[]}),execute:async()=>{executed++;return {ok:true};}},turn=async()=>{await new Promise(r=>setImmediate(r));await new Promise(r=>setImmediate(r));};
  let bridge=c.HubRemoteBridge.start(options);await turn();const oldSession=sessionValue;
  queued.push({id,payload:c.HubRemote.encode({...command,created:Date.now(),session:oldSession})});hidden=true;events.visibilitychange();hidden=false;events.visibilitychange();await turn();
  assert.notEqual(sessionValue,oldSession);assert.equal(executed,0);assert.equal(acks[0].ok,false);assert.match(acks[0].message,/interrompue/);
  const beforeReload=sessionValue;bridge.stop();queued.push({id,payload:c.HubRemote.encode({...command,created:Date.now(),session:beforeReload})});bridge=c.HubRemoteBridge.start(options);await turn();assert.notEqual(sessionValue,beforeReload);assert.equal(executed,0);assert.equal(acks[1].ok,false);bridge.stop();
});
