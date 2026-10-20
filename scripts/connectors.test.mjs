import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
const context=vm.createContext({module:{exports:{}},AbortController,setTimeout,clearTimeout,URLSearchParams,TextEncoder,crypto:webcrypto,btoa});
vm.runInContext(readFileSync(new URL('../dist/connectors.js',import.meta.url),'utf8'),context);
const {todoist,spotify,category}=context.module.exports;
const response=(body,status=200)=>({ok:status>=200&&status<300,status,text:async()=>JSON.stringify(body)});
function memory(){const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};}

test('Todoist paginates project tasks and never turns failed requests into an empty list',async()=>{
 const calls=[];const client=todoist('test-only-token',async(url,options)=>{calls.push({url,options});return response(calls.length===1?{results:[{id:'first',project_id:'project/one'}],next_cursor:'page.next'}:{results:[{id:'last',project_id:'project/one'}],next_cursor:null});});
 assert.deepEqual(Array.from(await client.tasks('project/one'),x=>x.id),['first','last']);assert.match(calls[0].url,/project_id=project%2Fone/);assert.match(calls[1].url,/cursor=page.next/);assert.equal(calls[0].options.credentials,'omit');
 const denied=todoist('test-only-token',async()=>response({secret:'do-not-display'},401));await assert.rejects(denied.tasks('p'),/connexion expirée/);
 const limited=todoist('test-only-token',async()=>response({},429));await assert.rejects(limited.tasks('p'),/limite atteinte/);
});

test('Todoist routes create, complete, reopen and move to the selected project and section',async()=>{
 const calls=[];const client=todoist('test-only-token',async(url,options)=>{calls.push({url,options});return response({id:'new-item'});});
 await client.add('groceries','2 tomates','vegetables','Depuis une recette');await client.toggle('new-item',true);await client.toggle('new-item',false);await client.move('new-item','groceries','fresh');
 assert.deepEqual(JSON.parse(calls[0].options.body),{project_id:'groceries',content:'2 tomates',description:'Depuis une recette',section_id:'vegetables'});
 assert.match(calls[1].url,/tasks\/new-item\/close$/);assert.match(calls[2].url,/tasks\/new-item\/reopen$/);assert.match(calls[3].url,/tasks\/new-item\/move$/);assert.deepEqual(JSON.parse(calls[3].options.body),{section_id:'fresh'});
 assert.equal(category('200 g de tomates'),'Fruits & légumes');assert.equal(category('2 œufs'),'Frais');assert.equal(category('300 g de riz'),'Épicerie');
});

test('Spotify PKCE uses S256 and validates callback state before exchanging a code',async()=>{
 const storage=memory(),nav={origin:'https://hub.example',pathname:'/',protocol:'https:',hostname:'hub.example',search:'',assign(url){this.redirected=url;}},history={replaceState(){}},calls=[];
 const client=spotify({storage,location:nav,history,fetch:async(url,o)=>{calls.push({url,o});return response({access_token:'test-access',refresh_token:'test-refresh',expires_in:3600});}});
 await client.authorize('a'.repeat(32));const url=new URL(nav.redirected);assert.equal(url.origin,'https://accounts.spotify.com');assert.equal(url.searchParams.get('code_challenge_method'),'S256');assert.equal(url.searchParams.get('redirect_uri'),'https://hub.example/');assert.ok(!url.searchParams.has('client_secret'));
 nav.search='?code=code&state=wrong';await assert.rejects(client.callback(),/invalide/);assert.equal(calls.length,0);
 await client.authorize('a'.repeat(32));const pending=JSON.parse(storage.getItem('hub.spotify.pending'));nav.search='?code=code&state='+pending.state;assert.equal(await client.callback(),true);assert.equal(calls.length,1);assert.equal(new URLSearchParams(calls[0].o.body).get('code_verifier'),pending.verifier);assert.equal(client.connected(),true);client.disconnect();assert.equal(client.connected(),false);
});

test('Spotify requires a secure redirect and handles no active player without inventing playback',async()=>{
 const storage=memory();storage.setItem('hub.spotify.token',JSON.stringify({access_token:'test-only',expires:Date.now()+3600000}));
 const client=spotify({storage,location:{origin:'http://localhost:4173',protocol:'http:',hostname:'localhost',pathname:'/'},fetch:async()=>response(null,204)});
 assert.throws(()=>client.redirect(),/127.0.0.1/);assert.equal(await client.player(),null);await assert.rejects(client.control('unknown'),/inconnue/);
});

test('Spotify playback commands accept successful plain acknowledgements and keep API failures distinct',async()=>{
 const storage=memory();storage.setItem('hub.spotify.token',JSON.stringify({access_token:'test-only',expires:Date.now()+3600000}));
 const calls=[];
 const client=spotify({storage,fetch:async(url,o)=>{calls.push({url,o});return {ok:true,status:200,text:async()=>{throw Error('A command must not parse an acknowledgement as JSON');}};}});
 assert.equal(await client.control('pause'),null);assert.equal(await client.control('play'),null);
 assert.match(calls[0].url,/\/pause$/);assert.equal(calls[0].o.method,'PUT');assert.match(calls[1].url,/\/play$/);
 const denied=spotify({storage,fetch:async()=>response({},403)});await assert.rejects(denied.control('play'),/accès refusé/);
});

test('invalid JSON never echoes the raw provider response into the interface',async()=>{
 const client=todoist('test-only-token',async()=>({ok:true,status:200,text:async()=> 'private-provider-response'}));
 await assert.rejects(client.projects(),error=>error.message.includes('réponse inattendue')&&!error.message.includes('private-provider-response'));
});

test('remembered Spotify sessions survive a new tab, refresh once, and disconnect removes both stores',async()=>{
 const storage=memory(),persistentStorage=memory();
 storage.setItem('hub.spotify.token',JSON.stringify({access_token:'old-test-access',refresh_token:'test-refresh',expires:Date.now()-1000,client_id:'a'.repeat(32)}));
 const first=spotify({storage,persistentStorage,fetch:async()=>{throw Error("Unexpected request");}});first.remember(true);
 assert.equal(first.remembered(),true);assert.equal(storage.getItem('hub.spotify.token'),null);
 const calls=[];
 const next=spotify({storage:memory(),persistentStorage,fetch:async(url,o)=>{calls.push({url,o});return response(url.includes('/api/token')?{access_token:'new-test-access',expires_in:3600}:{item:{name:'Test track'}});}});
 assert.equal(next.connected(),true);await next.player();
 assert.equal(new URLSearchParams(calls[0].o.body).get('grant_type'),'refresh_token');
 assert.equal(JSON.parse(persistentStorage.getItem('hub.spotify.token')).refresh_token,'test-refresh');
 assert.equal(JSON.parse(persistentStorage.getItem('hub.spotify.token')).access_token,'new-test-access');
 next.disconnect();assert.equal(next.connected(),false);assert.equal(persistentStorage.getItem('hub.spotify.token'),null);assert.equal(persistentStorage.getItem('hub.spotify.remember'),null);
});

test('failure to remember never removes the working session',()=>{
 const storage=memory();storage.setItem('hub.spotify.token',JSON.stringify({access_token:'test-only',expires:Date.now()+3600000}));
 const persistentStorage={getItem:()=>null,setItem:()=>{throw Error('Storage full');},removeItem(){}};
 const client=spotify({storage,persistentStorage,fetch:async()=>{throw Error("Unexpected request");}});assert.throws(()=>client.remember(true),/Storage full/);assert.equal(client.connected(),true);
});

test('Spotify lists real devices, transfers to one explicit device and validates volume before writing',async()=>{
 const storage=memory();storage.setItem('hub.spotify.token',JSON.stringify({access_token:'test-only',expires:Date.now()+3600000}));
 const calls=[],device={id:'speaker/one',name:'Home',is_restricted:false,supports_volume:true};
 const client=spotify({storage,fetch:async(url,options)=>{calls.push({url,options});return url.endsWith('/devices')?response({devices:[device]}):response(null,204);}});
 assert.equal((await client.devices())[0].name,'Home');await client.transfer(device.id,false);await client.volume(25,device.id);
 assert.equal(calls[1].options.method,'PUT');assert.deepEqual(JSON.parse(calls[1].options.body),{device_ids:['speaker/one'],play:false});
 assert.match(calls[2].url,/volume_percent=25&device_id=speaker%2Fone$/);
 await assert.rejects(client.volume(101,device.id),/0 et 100/);await assert.rejects(client.volume(NaN,device.id),/0 et 100/);await assert.rejects(client.transfer('',true),/appareil/);assert.equal(calls.length,3);
});

test('Todoist excludes shopping projects from daily tasks and limits purchases to their project',async()=>{
 const client=todoist('test-only',async()=>response({results:[{id:'buy',project_id:'course',content:'Rice',due:{date:'2026-10-21'}},{id:'work',project_id:'job',content:'Call',due:{date:'2026-10-20'},priority:4},{id:'future',project_id:'job',due:{date:'2026-10-22'}},{id:'undated',project_id:'job'}]}));
 assert.deepEqual(Array.from(await client.daily(['course'],'2026-10-21'),t=>t.id),['work']);assert.deepEqual(Array.from(await client.tasks('course'),t=>t.id),['buy']);
});

test('shopping project exclusion also covers explicitly selected projects and descendants',async()=>{
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');const body=source.match(/  function excludedShoppingProjects\(\)\{([^\n]+)\}/)[0];const c=vm.createContext({shop:{project:'selected',projects:[{id:'selected',name:'Groceries'},{id:'course',name:'course'},{id:'child',parent_id:'course',name:'Vegetables'},{id:'grandchild',parent_id:'child',name:'Fresh'},{id:'job',name:'Work'}]},HubConnect:{normalize:s=>s.trim().toLowerCase()}});vm.runInContext(body,c);const ids=Array.from(c.excludedShoppingProjects());assert.ok(ids.includes('selected'));assert.ok(ids.includes('course'));assert.ok(ids.includes('child'));assert.ok(ids.includes('grandchild'));assert.ok(!ids.includes('job'));
});
