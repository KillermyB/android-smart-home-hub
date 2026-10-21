import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';

const context=vm.createContext({module:{exports:{}},AbortController,setTimeout,clearTimeout,URLSearchParams});
vm.runInContext(readFileSync(new URL('../dist/connectors.js',import.meta.url),'utf8'),context);
const {spotify}=context.module.exports;
const response=(body,status=200)=>({ok:status>=200&&status<300,status,text:async()=>JSON.stringify(body)});
function memory(){const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
function token(name,expires=0){return {access_token:name+'-access',refresh_token:name+'-refresh',client_id:name+'-client',expires};}
function setup(){
  const storage=memory(),persistentStorage=memory(),refreshes=[],players=[];
  const client=spotify({storage,persistentStorage,fetch:async(url,options)=>{
    if(url.includes('/api/token'))return await new Promise(resolve=>refreshes.push({resolve,body:new URLSearchParams(options.body)}));
    players.push(options.headers.Authorization);
    return response(null,204);
  }});
  client.importToken(token('first'),true);
  return {client,storage,persistentStorage,refreshes,players};
}

for(const status of [200,401])test('Spotify disconnect ignores an in-flight refresh response ('+status+')',async()=>{
  const {client,storage,persistentStorage,refreshes,players}=setup();
  const pending=client.player();
  const rejected=assert.rejects(pending);
  assert.equal(refreshes.length,1);
  client.disconnect();
  assert.equal(client.connected(),false);
  refreshes[0].resolve(response({access_token:'late-first-access',expires_in:3600},status));
  await rejected;
  assert.equal(client.connected(),false);
  for(const store of [storage,persistentStorage]){
    assert.equal(store.getItem('hub.spotify.token'),null);
    assert.equal(store.getItem('hub.spotify.remember'),null);
  }
  assert.deepEqual(players,[]);
});

for(const status of [200,400,401])test('Spotify account import protects the new session and its shared refresh ('+status+')',async()=>{
  const {client,persistentStorage,refreshes,players}=setup();
  const previous=client.player();
  const rejected=assert.rejects(previous);
  client.importToken(token('second'),true);
  const first=client.player(),second=client.player();
  assert.equal(refreshes.length,2,'one refresh for each account, with the second account sharing its request');
  assert.equal(refreshes[1].body.get('refresh_token'),'second-refresh');
  refreshes[0].resolve(response({access_token:'late-first-access',refresh_token:'late-first-refresh',expires_in:3600},status));
  await rejected;
  assert.equal(client.exportToken().refresh_token,'second-refresh');
  const third=client.player();
  assert.equal(refreshes.length,2,'an old completion must not clear the new shared refresh');
  refreshes[1].resolve(response({access_token:'second-current-access',expires_in:3600}));
  await Promise.all([first,second,third]);
  assert.deepEqual(players,Array(3).fill('Bearer second-current-access'));
  const saved=JSON.parse(persistentStorage.getItem('hub.spotify.token'));
  assert.equal(saved.access_token,'second-current-access');
  assert.equal(saved.refresh_token,'second-refresh');
  assert.equal(saved.client_id,'second-client');
  assert.equal(client.remembered(),true);
});

test('Spotify PKCE completion invalidates refreshes started while another account was being authorized',async()=>{
  const storage=memory(),persistentStorage=memory(),requests=[];
  storage.setItem('hub.spotify.token',JSON.stringify(token('first')));
  storage.setItem('hub.spotify.pending',JSON.stringify({state:'synthetic-state',time:Date.now(),client:'second-client',uri:'https://hub.example/',verifier:'synthetic-verifier'}));
  const client=spotify({storage,persistentStorage,location:{pathname:'/',search:'?state=synthetic-state&code=synthetic-code'},history:{replaceState(){}},fetch:async(url,options)=>{
    assert.match(url,/\/api\/token$/,'the stale refresh must not reach the player API');
    return await new Promise(resolve=>requests.push({resolve,body:new URLSearchParams(options.body)}));
  }});
  const previous=client.player(),rejected=assert.rejects(previous);
  const authorization=client.callback();
  assert.equal(requests[0].body.get('grant_type'),'refresh_token');
  assert.equal(requests[1].body.get('grant_type'),'authorization_code');
  requests[1].resolve(response({access_token:'second-access',refresh_token:'second-refresh',expires_in:3600}));
  assert.equal(await authorization,true);
  requests[0].resolve(response({access_token:'late-first-access',expires_in:3600}));
  await rejected;
  assert.equal(client.exportToken().access_token,'second-access');
  assert.equal(client.exportToken().refresh_token,'second-refresh');
});
