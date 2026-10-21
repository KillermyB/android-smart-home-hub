import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function load(extra={}){const c=vm.createContext({module:{exports:{}},AbortController,setTimeout,clearTimeout,...extra});vm.runInContext(readFileSync(new URL('../dist/road-travel.js',import.meta.url),'utf8'),c);return c.module.exports;}
const ok=(duration=1605.9,distance=23383.1)=>({ok:true,json:async()=>({code:'Ok',routes:[{duration,distance}]})});

test('road presets target Lausanne and Geneva centres with an explicitly approximate Moudon origin',()=>{
 const api=load();assert.equal(api.destinations.length,2);assert.equal(api.destinations[0].label,'Lausanne · centre');assert.equal(api.destinations[1].label,'Genève · centre');assert.equal(api.destinations[1].detail,'Bel-Air');assert.match(api.defaultOrigin.label,/approximatif/);assert.equal(api.defaultOrigin.latitude,46.66758);assert.equal(api.defaultOrigin.longitude,6.79781);
 for(const p of [{latitude:null,longitude:6},{latitude:91,longitude:6},{latitude:46,longitude:-181},{latitude:NaN,longitude:6}])assert.throws(()=>api.point(p));
});

test('driving request is HTTPS lon-lat, minimal, no credentials and labelled without live traffic',async()=>{
 const api=load();let request;
 const client=api.create({now:()=>1000,fetch:async(url,options)=>{request={url,options};return ok();}}),r=await client.route(api.defaultOrigin,api.destinations[0]);
 assert.match(request.url,/^https:\/\/router\.project-osrm\.org\/route\/v1\/driving\/6\.79781,46\.66758;6\.63218,46\.51992\?overview=false&steps=false$/);assert.equal(request.options.credentials,'omit');assert.equal(request.options.referrerPolicy,'no-referrer');assert.equal(r.minutes,27);assert.equal(r.kilometers,23.4);assert.equal(r.traffic,false);assert.equal(r.updatedAt,1000);assert.equal(r.source,'OSRM · OpenStreetMap');assert.equal(r.originLabel,api.defaultOrigin.label);assert.equal(r.origin,undefined);
});

test('road estimates cache for ten minutes, deduplicate requests and preserve stale estimates on failure',async()=>{
 const api=load();let now=1000,calls=0,fail=false;
 const client=api.create({now:()=>now,fetch:async()=>{calls++;if(fail)throw Error('offline');return ok();}});
 const [a,b]=await Promise.all([client.route(api.defaultOrigin,api.destinations[0]),client.route(api.defaultOrigin,api.destinations[0])]);assert.equal(calls,1);a.destination.label='changed';assert.notEqual(b.destination.label,'changed');
 now+=599999;await client.route(api.defaultOrigin,api.destinations[0]);assert.equal(calls,1);
 now+=2;fail=true;const stale=await client.route(api.defaultOrigin,api.destinations[0]);assert.equal(calls,2);assert.equal(stale.stale,true);assert.equal(stale.updatedAt,1000);assert.equal(stale.minutes,27);assert.ok(stale.error);
 now+=600001;await assert.rejects(client.route({latitude:0,longitude:0},api.destinations[0]));
});

test('road demo queries are serialized at least one second apart',async()=>{
 let now=1000;const waits=[],starts=[];
 const api=load({setTimeout:(fn,delay)=>{if(delay===12000)return setTimeout(fn,delay);waits.push(delay);now+=delay;queueMicrotask(fn);return 0;},clearTimeout});
 const client=api.create({now:()=>now,fetch:async()=>{starts.push(now);return ok();}});
 await Promise.all(api.destinations.map(d=>client.route(api.defaultOrigin,d)));
 assert.equal(starts.length,2);assert.ok(starts[1]-starts[0]>=1000);assert.equal(waits.length,1);
});

test('road client rejects malformed route data and honors server rate limiting',async()=>{
 let now=1000,calls=0;const api=load(),client=api.create({now:()=>now,fetch:async()=>{calls++;return {ok:false,status:429,headers:{get:()=>120}};}});
 await assert.rejects(client.route(api.defaultOrigin,api.destinations[0]));await assert.rejects(client.route(api.defaultOrigin,api.destinations[1]));assert.equal(calls,1);now+=120001;await assert.rejects(client.route(api.defaultOrigin,api.destinations[1]));assert.equal(calls,2);
 for(const raw of [{code:'NoRoute'},{code:'Ok',routes:[{duration:-1,distance:100}]},{code:'Ok',routes:[{duration:100,distance:null}]}]){const invalid=api.create({fetch:async()=>({ok:true,json:async()=>raw})});await assert.rejects(invalid.route(api.defaultOrigin,api.destinations[0]),/trajet/);}
});

test('GPS is a single explicit fix and handles permission denial and invalid coordinates without storage',async()=>{
 const api=load();let calls=0,options;
 const p=await api.locate({getCurrentPosition(success,_error,value){calls++;options=value;success({coords:{latitude:46.667581234,longitude:6.797812345,accuracy:12}});}});
 assert.equal(calls,1);assert.equal(p.latitude,46.667581);assert.equal(p.accuracy,12);assert.equal(options.enableHighAccuracy,false);assert.equal(options.timeout,10000);assert.equal(p.label,'Position actuelle');
 await assert.rejects(api.locate({getCurrentPosition(_success,error){error({code:1});}}),/refusée/);
 await assert.rejects(api.locate({getCurrentPosition(success){success({coords:{latitude:500,longitude:6}});}}),/invalide/);
 await assert.rejects(api.locate({}),/indisponible/);
});
