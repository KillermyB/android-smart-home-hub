import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../dist/home-assistant.js',import.meta.url),'utf8');
const turn=()=>new Promise(resolve=>setImmediate(resolve));
function setup(timeoutMs=1000){
  class Socket {
    static instances=[];
    constructor(url){this.url=url;this.readyState=1;this.sent=[];Socket.instances.push(this);}
    send(raw){this.sent.push(JSON.parse(raw));}
    message(value){this.onmessage?.({data:typeof value==='string'?value:JSON.stringify(value)});}
    reply(message,result=null,success=true){this.message({id:message.id,type:'result',success,result,error:success?undefined:{code:'not_allowed',message:'Do not expose server text'}});}
    close(){this.readyState=3;}
    remoteClose(){this.readyState=3;this.onclose?.({code:1006});}
  }
  const context=vm.createContext({module:{exports:{}},URL,WebSocket:Socket,setTimeout,clearTimeout});
  vm.runInContext(source,context);
  const api=context.module.exports,client=api.create({url:'http://home.test:8123/base/',token:'test-token',timeoutMs});
  return {api,client,Socket};
}
const light={entity_id:'light.salon',state:'off',attributes:{friendly_name:'Salon',brightness:90},last_updated:'2026-10-20T10:00:00Z'};
const vacuum={entity_id:'vacuum.robot',state:'docked',attributes:{supported_features:8192|4|16,battery_level:90}};
async function ready(h,initial=[light,vacuum],between){
  const promise=h.client.connect(),socket=h.Socket.instances.at(-1);
  socket.message({type:'auth_required'});
  assert.deepEqual(socket.sent[0],{type:'auth',access_token:'test-token'});
  socket.message({type:'auth_ok'});
  const subscription=socket.sent.at(-1);assert.equal(subscription.type,'subscribe_events');assert.equal(subscription.event_type,'state_changed');
  socket.reply(subscription);await turn();
  const request=socket.sent.at(-1);assert.equal(request.type,'get_states');
  if(between)between(socket,subscription.id);
  socket.reply(request,initial);await promise;
  return {socket,subscription:subscription.id};
}
function changed(socket,id,value,entityId=value?.entity_id){socket.message({type:'event',id,event:{event_type:'state_changed',data:{entity_id:entityId,new_state:value}}});}

test('HA URLs preserve proxy base and reject embedded secrets or non-HTTP protocols',()=>{
  const {api,client}=setup();
  assert.equal(api.endpoint('https://home.test/proxy/'),'wss://home.test/proxy/api/websocket');
  assert.equal(api.endpoint('http://home.test:8123/api/websocket'),'ws://home.test:8123/api/websocket');
  assert.equal(api.normalizeURL('https://home.test/proxy/api/websocket'),'https://home.test/proxy');
  assert.equal(client.url,'http://home.test:8123/base');
  for(const value of ['ftp://home.test','ws://home.test','https://user:secret@home.test','https://home.test/?token=secret','https://home.test/#secret','bad'])assert.throws(()=>api.endpoint(value),e=>e.code==='invalid_url');
});

test('HA authenticates, loads real snapshot, and applies events received during loading',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());const observations=[];
  h.client.subscribe((values,status)=>observations.push({values,status}));
  const {socket}=await ready(h,[light],(socket,id)=>changed(socket,id,{...light,state:'on'}));
  assert.equal(h.client.status().status,'connected');assert.equal(h.client.states()[0].state,'on');
  assert.ok(observations.some(x=>x.status.status==='connecting'));assert.equal(observations.at(-1).values[0].state,'on');
  assert.equal(socket.url,'ws://home.test:8123/base/api/websocket');assert.ok(!socket.url.includes('test-token'));
});

test('HA subscriptions add, update and remove entities without leaking mutable internal state',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());const {socket,subscription}=await ready(h);
  const values=h.client.states();values[0].attributes.friendly_name='Changed';values.splice(0,1);
  assert.equal(h.client.states()[0].attributes.friendly_name,'Salon');
  let updates=0;const stop=h.client.subscribe(()=>updates++);
  changed(socket,subscription,{...light,state:'on'});assert.equal(h.client.states()[0].state,'on');
  changed(socket,subscription,{entity_id:'switch.plug',state:'on',attributes:{}});assert.equal(h.client.states().length,3);
  changed(socket,subscription,null,'switch.plug');assert.equal(h.client.states().length,2);
  stop();const count=updates;changed(socket,subscription,{...light,state:'off'});assert.equal(updates,count);
  changed(socket,subscription,{...light,entity_id:'light.other'},'light.salon');assert.equal(h.client.states()[0].state,'off');
});

test('HA calls target only known available entities, wait for acknowledgement and never forge state',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());const {socket,subscription}=await ready(h);
  const promise=h.client.call('light','turn_on',{entity_id:'light.salon'},{brightness:150}),message=socket.sent.at(-1);
  assert.deepEqual(message,{id:3,type:'call_service',domain:'light',service:'turn_on',target:{entity_id:'light.salon'},service_data:{brightness:150}});
  assert.equal(h.client.states()[0].state,'off');let done=false;promise.then(()=>done=true);await turn();assert.equal(done,false);
  socket.reply(message,{context:{id:'accepted'}});const result=await promise;assert.equal(result.context.id,'accepted');assert.equal(h.client.states()[0].state,'off');
  changed(socket,subscription,{...light,state:'on'});assert.equal(h.client.states()[0].state,'on');
  const before=socket.sent.length;
  for(const target of [{entity_id:'all'},{entity_id:'light.foreign'},{entity_id:'vacuum.robot'},{area_id:'living_room'},{entity_id:'light.salon',device_id:'foreign'},{entity_id:[]}])await assert.rejects(h.client.call('light','turn_off',target),e=>e.code==='invalid_target');
  await assert.rejects(h.client.call('light','turn_on',{entity_id:'light.salon'},{entity_id:'light.foreign'}),e=>e.code==='invalid_data');
  await assert.rejects(h.client.call('light','turn_on',{entity_id:'light.salon'},{toJSON(){return {area_id:'all'};}}),e=>e.code==='invalid_data');
  await assert.rejects(h.client.call('vacuum','stop',{entity_id:'vacuum.robot'}),e=>e.code==='unsupported_service');
  changed(socket,subscription,{...light,state:'unavailable'});await assert.rejects(h.client.call('light','turn_on',{entity_id:'light.salon'}),e=>e.code==='unavailable');
  assert.equal(socket.sent.length,before);
});

test('HA official vacuum feature bits gate controls, with no assumed hardware capability',()=>{
  const {api}=setup();assert.equal(api.supports(vacuum,'start'),true);assert.equal(api.supports(vacuum,'pause'),true);assert.equal(api.supports(vacuum,'return_to_base'),true);assert.equal(api.supports(vacuum,'stop'),false);
  assert.equal(api.supports({...vacuum,attributes:{}},'start'),false);assert.equal(api.supports({...vacuum,state:'unknown'},'pause'),false);
  assert.equal(api.supports(light,'turn_on'),true);assert.equal(api.supports(light,'unlock'),false);
  assert.equal(api.supports({entity_id:'scene.evening',state:'2026-10-20T10:00:00Z',attributes:{}},'turn_on'),true);
});

test('HA reports rejected authentication and malformed messages without echoing secrets',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());let promise=h.client.connect(),socket=h.Socket.instances.at(-1);
  socket.message({type:'auth_invalid',message:'test-token'});await assert.rejects(promise,e=>e.code==='auth_invalid'&&!e.message.includes('test-token'));assert.equal(h.client.status().status,'error');
  promise=h.client.connect();socket=h.Socket.instances.at(-1);socket.message('{broken');await assert.rejects(promise,e=>e.code==='protocol_error');
});

test('HA timeout bounds authentication and commands, without retrying actions',async t=>{
  const h=setup(15);t.after(()=>h.client.disconnect());await assert.rejects(h.client.connect(),e=>e.code==='auth_timeout');
  const {socket}=await ready(h);const before=socket.sent.length;
  await assert.rejects(h.client.call('light','turn_on',{entity_id:'light.salon'}),e=>e.code==='timeout');assert.equal(socket.sent.length,before+1);
});

test('HA service failures are distinct, retain server code, and do not expose raw server messages',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());const {socket}=await ready(h);
  const promise=h.client.call('light','turn_on',{entity_id:'light.salon'});socket.reply(socket.sent.at(-1),null,false);
  await assert.rejects(promise,e=>e.code==='service_error'&&e.serverCode==='not_allowed'&&!e.message.includes('Do not expose'));
});

test('HA disconnect rejects pending calls, clears states and credentials, and blocks stale sockets',async()=>{
  const h=setup(),{socket,subscription}=await ready(h);const oldMessage=socket.onmessage;
  const promise=h.client.call('light','turn_on',{entity_id:'light.salon'});h.client.disconnect();
  await assert.rejects(promise,e=>e.code==='disconnected');assert.equal(h.client.states().length,0);assert.equal(h.client.status().status,'disconnected');
  oldMessage({data:JSON.stringify({type:'event',id:subscription,event:{event_type:'state_changed',data:{entity_id:'light.salon',new_state:light}}})});assert.equal(h.client.states().length,0);
  await assert.rejects(h.client.call('light','turn_on',{entity_id:'light.salon'}),e=>e.code==='not_connected');
  await assert.rejects(h.client.connect(),e=>e.code==='invalid_token');assert.equal(h.Socket.instances.length,1);
});

test('HA unexpected socket loss invalidates entities and allows explicit reconnection only',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());let {socket}=await ready(h);
  socket.remoteClose();assert.equal(h.client.states().length,0);assert.equal(h.client.status().error.code,'connection_closed');assert.equal(h.Socket.instances.length,1);
  ({socket}=await ready(h,[light]));assert.equal(h.client.states().length,1);assert.equal(h.Socket.instances.length,2);
});

test('HA does not report connected before subscription and initial snapshot have succeeded',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());const promise=h.client.connect();assert.equal(h.client.connect(),promise);
  const socket=h.Socket.instances.at(-1);socket.message({type:'auth_required'});socket.message({type:'auth_ok'});
  socket.reply(socket.sent.at(-1),null,false);await assert.rejects(promise,e=>e.code==='service_error');assert.equal(h.client.status().status,'error');assert.equal(h.client.states().length,0);
});

test('HA bounds missing initial-state response and rejects a malformed snapshot',async t=>{
  const h=setup(15);t.after(()=>h.client.disconnect());let promise=h.client.connect(),socket=h.Socket.instances.at(-1);
  socket.message({type:'auth_required'});socket.message({type:'auth_ok'});socket.reply(socket.sent.at(-1));await turn();
  await assert.rejects(promise,e=>e.code==='timeout');assert.equal(h.client.status().status,'error');
  promise=h.client.connect();socket=h.Socket.instances.at(-1);socket.message({type:'auth_required'});socket.message({type:'auth_ok'});socket.reply(socket.sent.at(-1));await turn();
  socket.reply(socket.sent.at(-1),[{entity_id:'light.fake',state:'off'}]);await assert.rejects(promise,e=>e.code==='protocol_error');assert.equal(h.client.states().length,0);
});

test('HA reports unreachable instance separately from bad credentials',async t=>{
  const h=setup();t.after(()=>h.client.disconnect());const promise=h.client.connect();h.Socket.instances.at(-1).onerror();
  await assert.rejects(promise,e=>e.code==='connection_failed');assert.equal(h.client.status().error.code,'connection_failed');
});

test('media players only expose advertised transport controls and bounded volume',async t=>{const h=setup();t.after(()=>h.client.disconnect());const speaker={entity_id:'media_player.sonos',state:'playing',attributes:{supported_features:1|4|16|32|16384,volume_level:.4}};const {socket}=await ready(h,[speaker]);assert.equal(h.api.supports(speaker,'media_pause'),true);assert.equal(h.api.supports(speaker,'media_stop'),false);for(const value of [-1,1.1,null,'0.4',NaN])await assert.rejects(h.client.call('media_player','volume_set',{entity_id:speaker.entity_id},{volume_level:value}),e=>e.code==='invalid_data');const request=h.client.call('media_player','volume_set',{entity_id:speaker.entity_id},{volume_level:.6});const sent=socket.sent.at(-1);assert.equal(sent.service_data.volume_level,.6);socket.reply(sent);await request;assert.equal(h.client.states()[0].attributes.volume_level,.4);});


test('HA remembering is explicit, survives reload, validates data and forgets only its credential',()=>{
 const storage=new Map([['hub.other','preserved']]);const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)};
 const load=()=>{const c=vm.createContext({URL,localStorage});vm.runInContext(source,c);return c.HubHA;};
 let api=load();assert.equal(api.saved(),null);api.remember({url:'http://home.test:8123/',token:'private-test-token'});api=load();assert.equal(api.saved().token,'private-test-token');assert.equal(api.saved().url,'http://home.test:8123');
 api.forget();assert.equal(api.saved(),null);assert.equal(storage.get('hub.other'),'preserved');
 assert.throws(()=>api.remember({url:'http://user:secret@home.test',token:'test'}),e=>e.code==='invalid_url');
 assert.throws(()=>api.remember({url:'http://home.test',token:'bad\nvalue'}),e=>e.code==='invalid_token');
 storage.set('hub.ha.connection','{broken');assert.equal(api.saved(),null);
});


test('a scene never activated has unknown timestamp but can be explicitly activated',async t=>{
 const h=setup();t.after(()=>h.client.disconnect());const scene={entity_id:'scene.evening',state:'unknown',attributes:{friendly_name:'Evening'}};const {socket}=await ready(h,[scene]);
 assert.equal(h.api.supports(scene,'turn_on'),true);assert.equal(h.api.supports({...scene,state:'unavailable'},'turn_on'),false);
 const promise=h.client.call('scene','turn_on',{entity_id:scene.entity_id});const command=socket.sent.at(-1);assert.equal(command.type,'call_service');socket.reply(command);await promise;
 assert.equal(h.client.states()[0].state,'unknown');
});
