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
const key='a'.repeat(64),bridgeKey='b'.repeat(64),id='c'.repeat(32),now=Date.now();
const command={id,created:now,type:'note',text:'Un mot 🌿 éè',pin:true};

test('remote accepts only four bounded actions, UTF-8 data and a fresh request',()=>{
  const c=core(),api=c.HubRemote;
  assert.deepEqual(JSON.parse(JSON.stringify(api.decode(api.encode(command)))),command);
  const valid=[command,{id,created:now,type:'timer',seconds:60,label:'Pâtes',tag:'Étape 1'},{id,created:now,type:'light',entity:'switch.prise',on:false},{id,created:now,type:'task',task:'6Xxyz'}];
  for(const value of valid)assert.equal(api.validate(api.decode(api.encode(value)),now).type,value.type);
  for(const value of [{...command,type:'nav'},{...command,text:''},{...command,text:'x'.repeat(401)},{...command,extra:'shell'},{...command,created:now-31000},{...command,created:now+11000},{...command,id:'../x'}, {...valid[1],seconds:0},{...valid[1],seconds:86401},{...valid[2],entity:'script.shutdown'},{...valid[2],on:'false'},{...valid[3],task:'../../account'}])assert.throws(()=>api.validate(api.decode(api.encode(value)),now));
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
  let hidden=true,calls=[],execute=0,scheduled=[],events={};
  const c=core({location:{protocol:'http:',hostname:'127.0.0.1',port:'4173'},AbortSignal,document:{get hidden(){return hidden;},addEventListener:(n,f)=>events[n]=f,removeEventListener(){}},setTimeout:(f)=>{scheduled.push(f);return scheduled.length;},clearTimeout(){},fetch:async(url,options={})=>{
    calls.push({url,options});return {ok:true,json:async()=>url.includes('screen')?{key:bridgeKey}:options.method==='POST'?{accepted:true}:{url:'http://192.168.1.11:4180/',key,commands:execute?[]:[{id,payload:c.HubRemote.encode({...command,created:Date.now()})}]}};
  }});
  vm.runInContext(source('remote-bridge'),c);
  const bridge=c.HubRemoteBridge.start({snapshot:()=>({notes:[],lights:[],tasks:[]}),execute:async()=>{execute++;return {ok:true};}});
  assert.equal(calls.length,0);hidden=false;events.visibilitychange();await new Promise(r=>setImmediate(r));await new Promise(r=>setImmediate(r));
  assert.equal(execute,1);assert.equal(calls.filter(x=>x.options.body?.split('\n')[1]==='ack').length,1);assert.ok(bridge.pair());
  await bridge.refresh();assert.equal(execute,1);bridge.stop();
});

test('frame remote dispatcher keeps task/project separation and never routes to main handle',async()=>{
  const app=source('app'),section=app.slice(app.indexOf('  function remoteSnapshot(){'),app.indexOf("  if(typeof HubRemoteBridge"));
  let actions=[],saved=[],rendered=0;
  const c=vm.createContext({Date,Error,HubHA:{group:e=>e.entity_id.startsWith('light.')?'lighting':'',supports:()=>true},dayTools:{notes:[]},house:{status:'connected',client:{confirmedCall:async()=>({confirmed:true})},entities:[{entity_id:'light.lamp',state:'off',attributes:{friendly_name:'Lampe',access_token:'not-shared'}}],pending:'',generation:1},daily:{loaded:true,busy:false,items:[{id:'t1',content:'Faire',project_id:'tasks',due_date:''},{id:'shop1',content:'Lait',project_id:'courses'}]},shop:{client:{toggle:async(...x)=>actions.push(x)}},timerItems:[],state:{page:'kitchen',modal:null,sleep:true},document:{hidden:false},HubTools:{timers:{start:()=>[{id:'1'}]}},save:(...x)=>saved.push(x),saveTimers(){},renderTimer(){},scheduleTick(){},renderOverlay(){},repaintDaily(){},render(){rendered++;},houseUpdate(){},houseError:()=>'',excludedShoppingProjects:()=>['courses'],serviceRender(){},refreshDaily:async()=>{},localStorage:{setItem(){}},mainDirty:false});
  vm.runInContext(section,c);const snap=c.remoteSnapshot();assert.equal(snap.tasks.length,1);assert.ok(!JSON.stringify(snap).includes('not-shared'));
  await c.executeRemote({type:'note',id,text:'Bonjour',pin:true});await c.executeRemote({type:'timer',seconds:60,label:'Pâtes',tag:'Étape 1'});await c.executeRemote({type:'task',task:'t1'});
  assert.equal(rendered,0);assert.equal(c.state.page,'kitchen');assert.equal(c.state.sleep,true);assert.deepEqual(actions,[['t1',true]]);assert.equal(c.dayTools.notes[0].text,'Bonjour');await assert.rejects(c.executeRemote({type:'task',task:'shop1'}));await assert.rejects(c.executeRemote({type:'nav',page:'home'}));c.localStorage.setItem=()=>{throw Error('quota');};const before=c.dayTools.notes.length;await assert.rejects(c.executeRemote({type:'note',id:'d'.repeat(32),text:'Not saved',pin:true}),/Stockage/);assert.equal(c.dayTools.notes.length,before);
});

 test('remote snapshot is bounded even with long Unicode titles and never mutates the source',()=>{
  const api=core().HubRemote;const data={notes:Array.from({length:12},()=>({text:'🌿'.repeat(200)})),lights:Array.from({length:100},()=>({name:'🌿'.repeat(40)})),tasks:Array.from({length:200},()=>({content:'🌿'.repeat(250)}))};
  const bounded=api.snapshot(data);assert.ok(api.encode(bounded).length<=60000);assert.equal(data.tasks.length,200);assert.equal(bounded.tasksTotal,200);
 });
