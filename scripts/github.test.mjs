import test from 'node:test';
import assert from 'node:assert/strict';
import '../dist/github.js';
const item=(sha,date='2026-10-20T01:00:00+02:00')=>({sha,repository:{full_name:'person/repo'},commit:{message:'feat: a change\nbody',author:{date}}});
test('GitHub preserves incomplete evidence and groups dates in UTC',()=>{
 const r=HubGithub.summarize({total_count:5,items:[item('a'),item('a'),item('b')]},'person','2026-09-23','2026-10-20');
 assert.equal(r.total,5);assert.equal(r.partial,true);assert.equal(r.days['2026-10-19'],2);assert.equal(r.items[0].title,'feat: a change');
});
test('GitHub follows pagination and surfaces rate limits instead of a false zero',async()=>{
 let calls=0;const r=await HubGithub.load('person',async()=>{calls++;return {ok:true,json:async()=>({total_count:101,items:Array.from({length:calls===1?100:1},(_,i)=>item('sha'+calls+i))})};});
 assert.equal(calls,2);assert.equal(r.total,101);assert.equal(r.partial,false);
 await assert.rejects(HubGithub.load('person',async()=>({ok:false,status:403})),/Limite GitHub/);
 await assert.rejects(HubGithub.load('bad/name',async()=>{throw Error('must not fetch');}),/invalide/);
});
