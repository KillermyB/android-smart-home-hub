import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../dist/home-assistant.js',import.meta.url),'utf8');
const turn=()=>new Promise(resolve=>setImmediate(resolve));
function setup(timeoutMs=1000,extra={}){
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
  const api=context.module.exports,client=api.create({url:'http://home.test:8123/base/',token:'test-token',timeoutMs,...extra});
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

test('HA groups scenes first and lighting outlets separately from Sonos settings',()=>{
 const {api}=setup();
 for(const item of [{entity_id:'light.floor',state:'off',attributes:{}},{entity_id:'switch.socket_1',state:'on',attributes:{friendly_name:'VARMBLIXT Prise 1'}},{entity_id:'switch.wall',state:'off',attributes:{friendly_name:'Éclairage cuisine'}},{entity_id:'switch.outlet',state:'off',attributes:{device_class:'outlet'}}])assert.equal(api.group(item),'lighting');
 assert.equal(api.group({entity_id:'switch.home_loudness',state:'on',attributes:{friendly_name:'Home Loudness'}}),'switch');
 assert.equal(api.group({entity_id:'scene.salon',state:'unknown',attributes:{}}),'scene');
 assert.equal(api.group({entity_id:'sensor.temperature',state:'20',attributes:{}}),'');
});

test('generic Tuya on/off shortcuts are hidden while named ambiances stay visible',()=>{
 const {api}=setup();
 for(const name of ['Turn On','Turn Off','  turn off  ','Turn On 2'])assert.equal(api.group({entity_id:'scene.shortcut',state:'unknown',attributes:{friendly_name:name}}),'');
 assert.equal(api.group({entity_id:'scene.turn_off_2',state:'unknown',attributes:{}}),'');
 for(const name of ['Salon - Nuit','Appartement - Nuit','Étage - Couleur','Turn on garden evening'])assert.equal(api.group({entity_id:'scene.ambiance',state:'unknown',attributes:{friendly_name:name}}),'scene');
});

test('media power commands follow announced HA feature bits and never infer wake support',async t=>{
 const h=setup();t.after(()=>h.client.disconnect());const tv={entity_id:'media_player.tv',state:'off',attributes:{supported_features:128|256}},speaker={entity_id:'media_player.home',state:'playing',attributes:{supported_features:1|4}};
 assert.equal(h.api.supports(tv,'turn_on'),true);assert.equal(h.api.supports(tv,'turn_off'),true);assert.equal(h.api.supports(speaker,'turn_on'),false);
 const {socket}=await ready(h,[tv,speaker]);const p=h.client.call('media_player','turn_on',{entity_id:tv.entity_id});const command=socket.sent.at(-1);assert.deepEqual(command.target,{entity_id:tv.entity_id});assert.equal(command.service,'turn_on');socket.reply(command);await p;assert.equal(h.client.states().find(x=>x.entity_id===tv.entity_id).state,'off');
 await assert.rejects(h.client.call('media_player','turn_on',{entity_id:speaker.entity_id}),e=>e.code==='unsupported_service');
});


test('confirmed commands wait for the requested state, including events arriving before the service acknowledgement',async()=>{
 const h=setup(1000,{confirmMs:100});const {socket,subscription}=await ready(h);let resolved=false;const command=h.client.confirmedCall('light','toggle',{entity_id:'light.salon'}).then(r=>{resolved=true;return r;});
 const request=socket.sent.at(-1);assert.equal(request.service,'turn_on');await turn();assert.equal(resolved,false);
 changed(socket,subscription,{...light,state:'on'});socket.reply(request);const result=await command;assert.equal(result.confirmed,true);assert.equal(socket.sent.filter(x=>x.type==='call_service').length,1);h.client.disconnect();
});
test('unconfirmed TV power commands read back states but are never repeated automatically',async()=>{
 const h=setup(1000,{confirmMs:60});const tv={entity_id:'media_player.tv',state:'playing',attributes:{supported_features:256}};const {socket}=await ready(h,[tv]);const command=h.client.confirmedCall('media_player','turn_off',{entity_id:tv.entity_id});socket.reply(socket.sent.at(-1));await new Promise(r=>setTimeout(r,40));const readback=socket.sent.at(-1);assert.equal(readback.type,'get_states');socket.reply(readback,[tv]);const result=await command;assert.equal(result.accepted,true);assert.equal(result.confirmed,false);assert.equal(socket.sent.filter(x=>x.type==='call_service').length,1);h.client.disconnect();
});
test('confirmation fails clearly if HA disconnects while a command is being checked',async()=>{
 const h=setup(1000,{confirmMs:100});const {socket}=await ready(h);const command=h.client.confirmedCall('light','turn_on',{entity_id:light.entity_id});socket.reply(socket.sent.at(-1));await turn();socket.remoteClose();await assert.rejects(command,e=>e.code==='not_connected');
});

test('room discovery uses only the active Dreame map and validates room IDs',()=>{
 const {api}=setup(),robot={...vacuum,attributes:{rooms:{'Étage':[{id:1,name:'Chambre'}],'Appartement':[{id:1,name:'Salon'},{id:2,name:'Cuisine'},{id:'2',name:'Duplicate'},{id:0,name:'Bad'},{id:3,name:''}]},selected_map:'Appartement'}};
 assert.deepEqual(JSON.parse(JSON.stringify(api.roomList(robot))),{map:'Appartement',rooms:[{id:1,name:'Salon'},{id:2,name:'Cuisine'}]});
 assert.equal(api.roomList({...robot,attributes:{...robot.attributes,selected_map:'Carte supprimée'}}).rooms.length,0);
 assert.equal(api.roomList({...robot,attributes:{rooms:robot.attributes.rooms}}).rooms.length,0);
 assert.equal(api.roomList({...robot,attributes:{rooms:{Only:[{id:4,name:'Office'}]}}}).rooms[0].id,4);
 assert.equal(api.roomList(light).rooms.length,0);
});

test('optional HA service discovery is bounded, shared, immutable and cleared on disconnect',async t=>{
 const h=setup();t.after(()=>h.client.disconnect());const {socket}=await ready(h);
 const first=h.client.loadServices(),second=h.client.loadServices(),request=socket.sent.at(-1);
 assert.equal(request.type,'get_services');assert.equal(socket.sent.filter(x=>x.type==='get_services').length,1);
 socket.reply(request,{dreame_vacuum:{vacuum_clean_segment:{fields:{segments:{required:true}}}}});await Promise.all([first,second]);
 const services=h.client.services();services.dreame_vacuum.vacuum_clean_segment.fields.segments.required=false;
 assert.equal(h.client.services().dreame_vacuum.vacuum_clean_segment.fields.segments.required,true);
 h.client.disconnect();assert.equal(Object.keys(h.client.services()).length,0);await assert.rejects(h.client.loadServices(),e=>e.code==='not_connected');
});

test('room cleaning sends exactly one advertised command for discovered current-map room IDs',async t=>{
 const h=setup();t.after(()=>h.client.disconnect());const robot={...vacuum,attributes:{...vacuum.attributes,selected_map:'Home',rooms:{Home:[{id:3,name:'Cuisine'},{id:4,name:'Salon'}]}}}, {socket,subscription}=await ready(h,[robot]);
 await assert.rejects(h.client.cleanRooms(robot.entity_id,[3]),e=>e.code==='unsupported_service');
 const loading=h.client.loadServices();socket.reply(socket.sent.at(-1),{dreame_vacuum:{vacuum_clean_segment:{fields:{segments:{}}}}});await loading;
 assert.equal(h.client.vacuumRooms(robot.entity_id).serviceAvailable,true);
 const before=socket.sent.length;
 for(const bad of [[],[99],['3'],[3,3],null])await assert.rejects(h.client.cleanRooms(robot.entity_id,bad),e=>e.code==='invalid_data');
 await assert.rejects(h.client.cleanRooms('vacuum.foreign',[3]),e=>e.code==='invalid_target');assert.equal(socket.sent.length,before);
 const command=h.client.cleanRooms(robot.entity_id,[3,4]),request=socket.sent.at(-1);
 assert.deepEqual(request,{id:4,type:'call_service',domain:'dreame_vacuum',service:'vacuum_clean_segment',target:{entity_id:'vacuum.robot'},service_data:{segments:[3,4]}});
 socket.reply(request);assert.deepEqual(JSON.parse(JSON.stringify(await command)),{accepted:true,confirmed:false});
 assert.equal(h.client.states()[0].state,'docked');
 changed(socket,subscription,{...robot,state:'cleaning'});await assert.rejects(h.client.cleanRooms(robot.entity_id,[3]),e=>e.code==='busy');
 changed(socket,subscription,{...robot,state:'unavailable'});await assert.rejects(h.client.cleanRooms(robot.entity_id,[3]),e=>e.code==='unavailable');
 changed(socket,subscription,{...robot,attributes:{...robot.attributes,selected_map:'Other'}});await assert.rejects(h.client.cleanRooms(robot.entity_id,[3]),e=>e.code==='invalid_data');
});

test('user-selected HA scripts can be started without granting arbitrary cross-domain service calls',async t=>{
 const h=setup();t.after(()=>h.client.disconnect());const script={entity_id:'script.clean_kitchen',state:'off',attributes:{friendly_name:'Nettoyer cuisine'}}, {socket}=await ready(h,[script]);
 assert.equal(h.api.supports(script,'turn_on'),true);assert.equal(h.api.supports(script,'turn_off'),false);
 const command=h.client.confirmedCall('script','turn_on',{entity_id:script.entity_id}),request=socket.sent.at(-1);socket.reply(request);
 assert.deepEqual(JSON.parse(JSON.stringify(await command)),{accepted:true,confirmed:false});
 await assert.rejects(h.client.call('script','turn_on',{entity_id:'vacuum.robot'}),e=>e.code==='invalid_target');
});

test('an early state read confirms fast lights but an older read keeps the later fallback and never resends the action',async t=>{
 const h=setup(2000,{confirmMs:2400});t.after(()=>h.client.disconnect());const {socket}=await ready(h);const p=h.client.confirmedCall('light','turn_on',{entity_id:light.entity_id});socket.reply(socket.sent.at(-1));
 const until=async count=>{for(let i=0;i<170&&socket.sent.filter(m=>m.type==='get_states').length<count;i++)await new Promise(r=>setTimeout(r,10));assert.ok(socket.sent.filter(m=>m.type==='get_states').length>=count);return socket.sent.at(-1);};
 const early=await until(2);socket.reply(early,[light]);const later=await until(3);socket.reply(later,[{...light,state:'on'}]);assert.equal((await p).confirmed,true);assert.equal(socket.sent.filter(m=>m.type==='call_service').length,1);
});
