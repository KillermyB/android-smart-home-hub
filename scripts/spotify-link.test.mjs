import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { webcrypto } from 'node:crypto';
const context=vm.createContext({module:{exports:{}},TextEncoder,TextDecoder,crypto:webcrypto,btoa,atob,Uint8Array});
vm.runInContext(readFileSync(new URL('../dist/spotify-link.js',import.meta.url),'utf8'),context);
const link=context.module.exports;
const now=Date.now(),session={access_token:'test-access-not-real',refresh_token:'test-refresh-not-real',expires:now+3600000,client_id:'a'.repeat(32)};

test('device association exports authenticated ciphertext and restores exactly one Spotify session',async()=>{
 const sealed=await link.encrypt(session,now);
 assert.equal(sealed.code.length,43);
 const file=JSON.stringify(sealed.packet);
 assert.equal(file.includes(session.access_token),false);assert.equal(file.includes(session.refresh_token),false);assert.equal(file.includes(sealed.code),false);
 assert.deepEqual(JSON.parse(JSON.stringify(await link.decrypt(sealed.packet,sealed.code,now))),session);
});

test('association rejects a wrong key, tampering, expiry and incomplete credentials',async()=>{
 const sealed=await link.encrypt(session,now),other=await link.encrypt(session,now);
 await assert.rejects(link.decrypt(sealed.packet,other.code,now),/code ne correspond/);
 const damaged={...sealed.packet,data:(sealed.packet.data[0]==='a'?'b':'a')+sealed.packet.data.slice(1)};
 await assert.rejects(link.decrypt(damaged,sealed.code,now),/modifié/);
 await assert.rejects(link.decrypt(sealed.packet,sealed.code,now+11*60000),/expiré/);
 await assert.rejects(link.encrypt({...session,refresh_token:''},now),/incomplète/);
 await assert.rejects(link.decrypt({...sealed.packet,format:'other'},sealed.code,now),/invalide/);
});
