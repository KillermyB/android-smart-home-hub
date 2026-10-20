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
 const calls=[];const client=todoist('test-only-token',async(url,options)=>{calls.push({url,options});return response(calls.length===1?{results:[{id:'first'}],next_cursor:'page.next'}:{results:[{id:'last'}],next_cursor:null});});
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
