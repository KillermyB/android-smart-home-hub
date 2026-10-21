import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const read=name=>readFileSync(new URL('../dist/'+name+'.js',import.meta.url),'utf8');
function context(){const c=vm.createContext({URL,TextEncoder,TextDecoder,btoa,atob});for(const name of ['preferences','connection-health','remote-targets','personal-backup','remote-core','hub-tools'])vm.runInContext(read(name),c);return c;}
const json=v=>JSON.parse(JSON.stringify(v));
const inContext=(c,v)=>vm.runInContext('JSON.parse('+JSON.stringify(JSON.stringify(v))+')',c);
function storage(initial={}){const data=new Map(Object.entries(initial));return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k),data};}

test('home preferences preserve a fixed clock and normalize duplicate or unknown tiles',()=>{
 const p=context().HubPreferences,defaults=p.normalize({});assert.equal(p.custom(defaults),false);
 let value=p.normalize({order:['music','unknown','clock','music'],hidden:['clock','weather','weather','bad'],standby:{date:false}});
 assert.deepEqual(Array.from(value.order).slice(0,3),['clock','music','weather']);assert.equal(value.order.length,8);assert.deepEqual(Array.from(value.hidden),['weather']);assert.equal(value.standby.date,false);assert.equal(value.standby.quote,true);
 assert.equal(p.move(value,'music',-1).order[0],'clock');assert.equal(p.move(value,'music',1).order[2],'music');assert.deepEqual(json(p.move(value,'clock',1)),json(value));assert.equal(p.custom(value),true);assert.equal(p.custom(p.normalize({})),false);
});
test('connection failures keep the last successful sync, including across reloads',()=>{
 let now=1000000;const api=context().HubConnectionHealth,h=api.create({spotify:now+60000,todoist:now-100},()=>now);
 assert.equal(h.saved().spotify,undefined);h.success('spotify',now);h.success('spotify',now-50);assert.equal(h.saved().spotify,now);
 let rows=h.rows({spotify:{configured:true,error:true},homeAssistant:{configured:false}});assert.equal(rows[0].issue,true);assert.equal(rows[0].lastSuccess,now);assert.equal(rows[2].status,'off');
 now+=360000;rows=h.rows({spotify:{configured:true},homeAssistant:{configured:true,connecting:true}});assert.equal(rows[0].status,'stale');assert.equal(rows[2].status,'connecting');h.success('homeAssistant',now-350000);assert.equal(h.rows({homeAssistant:{configured:true,live:true}})[2].status,'ok');
 h.success('spotify',now);const restored=api.create(h.saved(),()=>now);assert.equal(restored.rows({spotify:{configured:true}})[0].status,'ok');
});
test('ScreenK destinations only accept local links with no embedded credentials',()=>{
 const r=context().HubRemoteTargets;for(const value of ['http://salon.local:8080/remote.html','http://mirror/remote.html','https://10.0.0.9:8080/remote.html'])assert.equal(r.url(value),value);
 for(const value of ['https://example.com/','javascript:alert(1)','http://salon.local/?key=secret','http://salon.local/#key=secret','http://user:password@salon.local','http://172.40.1.1/','http://127.0.0.1/'])assert.throws(()=>r.url(value));assert.deepEqual(json(r.normalize({})),{salon:'',mirror:''});
});
test('personal backup roundtrips selected settings and notes without exporting account sessions',()=>{
 const c=context(),b=c.HubPersonalBackup,source=storage({'hub.weather':'{"city":"Ville","latitude":46,"longitude":6}','hub.theme':'"dark"','hub.preferences':'{"hidden":["weather"],"standby":{"quote":false}}','hub.boardNotes':'[{"id":"a","text":"Du pain, merci !","pinned":true,"created":1000}]','hub.todoist.token':'DO-NOT-EXPORT','hub.spotify.token':'DO-NOT-EXPORT','hub.ha.token':'DO-NOT-EXPORT','hub.timers':'[{"id":"1"}]'}),packet=b.capture(source,2000);
 assert.doesNotMatch(JSON.stringify(packet),/DO-NOT-EXPORT|hub.timers|access_token/);assert.equal(packet.settings.preferences.standby.quote,false);assert.deepEqual(json(packet.settings.weatherLocation),{name:'Ville',latitude:46,longitude:6});
 const destination=storage({'hub.theme':'"light"','hub.todoist.token':'KEEP','hub.boardNotes':'[{"id":"existing","text":"Déjà ici.","pinned":false,"created":500}]'});b.restore(destination,packet);assert.equal(destination.getItem('hub.theme'),'"dark"');assert.equal(destination.getItem('hub.todoist.token'),'KEEP');assert.equal(JSON.parse(destination.getItem('hub.boardNotes')).length,2);b.restore(destination,packet);assert.equal(JSON.parse(destination.getItem('hub.boardNotes')).length,2);
});
test('invalid backups cannot partially overwrite settings or inject credentials or prototypes',()=>{
 const c=context(),b=c.HubPersonalBackup,base={format:'hub-personal-backup',version:1,created:1000,settings:{theme:'dark'}};
 for(const settings of [{theme:'blue'},{idle:-1},{boardNotes:[{id:'bad'}]},{preferences:{token:'hidden'}},{'todoist.token':'secret'},{theme:'dark',recipes:[{id:'x'}]}])assert.throws(()=>b.validate(inContext(c,{...base,settings})));
 assert.throws(()=>b.validate(vm.runInContext('JSON.parse(\'{"format":"hub-personal-backup","version":1,"created":1,"settings":{"preferences":{"__proto__":{}}}}\')',c)));
 assert.throws(()=>b.validate(inContext(c,{...base,version:2})));assert.throws(()=>b.validate(inContext(c,{...base,settings:{githubUser:'a'.repeat(101)}})));
 const store=storage({'hub.theme':'"light"'});assert.throws(()=>b.restore(store,inContext(c,{...base,settings:{theme:'dark',idle:99}})));assert.equal(store.getItem('hub.theme'),'"light"');
});
test('backup restoration rolls back a storage quota failure and preserves unrelated keys',()=>{
 const c=context(),b=c.HubPersonalBackup,store=storage({'hub.theme':'"light"','hub.boardNotes':'[]','hub.todoist.token':'KEEP'}),original=new Map(store.data),set=store.setItem;let once=true;store.setItem=(k,v)=>{if(k==='hub.boardNotes'&&once){once=false;throw Error('quota');}set(k,v);};
 assert.throws(()=>b.restore(store,inContext(c,{format:'hub-personal-backup',version:1,created:1,settings:{theme:'dark',boardNotes:[]}})),/annulée/);assert.deepEqual(store.data,original);
});
test('adding time and repeating keep three timer slots independent and change repeat identity',()=>{
 const {timers:t,remaining}=context().HubTools;let list=t.start([],3900,'Lessive','Lavage',1000);list=t.start(list,6900,'Sèche-linge','Lavage',1000);list=t.start(list,60,'Thé','Pause',1000);const old=list[0].instance;
 list=t.change(list,'1','toggle',11000);list=t.change(list,'1','add',20000,30);assert.equal(remaining(list[0],30000),3920);assert.equal(list[0].paused,true);assert.equal(remaining(list[1],11000),6890);
 list=t.change(list,'1','add',30000,300);assert.equal(list[0].duration,4230);list=t.change(list,'1','restart',40000);assert.notEqual(list[0].instance,old);assert.equal(list[0].id,'1');assert.equal(list[0].paused,false);assert.equal(remaining(list[0],40000),4230);assert.equal(list.length,3);
 list=t.change(list,'2','restart',9000000);assert.equal(remaining(list[1],9000000),6900);assert.equal(list[1].notified,false);assert.throws(()=>t.change(list,'2','add',0,999));
 let max=t.start([],86400,'Long','',0);max=t.change(max,'1','add',0,300);assert.equal(max[0].duration,86400);assert.equal(remaining(max[0],0),86400);
});
test('remote adjustment and repeat require a current timer identity and bounded command shape',()=>{
 const c=context(),api=c.HubRemote,now=Date.now(),base={id:'a'.repeat(32),session:'b'.repeat(32),created:now,timer:'1',instance:'timer-current'};
 for(const seconds of [30,300])assert.doesNotThrow(()=>api.validate(inContext(c,{...base,type:'timer_adjust',seconds}),now));assert.doesNotThrow(()=>api.validate(inContext(c,{...base,type:'timer_restart'}),now));
 for(const extra of [{type:'timer_adjust',seconds:60},{type:'timer_adjust',seconds:'30'},{type:'timer_restart',seconds:30},{type:'timer_restart',instance:''},{type:'timer_restart',timer:'4'}])assert.throws(()=>api.validate(inContext(c,{...base,...extra}),now));
 assert.throws(()=>api.validate(inContext(c,{...base,type:'timer_restart',created:now-31000}),now));
});
