import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const c=vm.createContext({module:{exports:{}},URLSearchParams,AbortController,setTimeout,clearTimeout});
vm.runInContext(readFileSync(new URL('../dist/daily-life.js',import.meta.url),'utf8'),c);
const api=c.module.exports;
const plain=x=>JSON.parse(JSON.stringify(x));

test('Zurich wall times respect DST gaps, repeated hours and calendar boundaries',()=>{
 assert.equal(api.localTimestamp('2026-10-21','10:30'),Date.parse('2026-10-21T08:30:00Z'));
 assert.equal(api.localTimestamp('2026-12-21','10:30'),Date.parse('2026-12-21T09:30:00Z'));
 assert.equal(api.localTimestamp('2026-03-29','02:30'),null);
 assert.equal(api.localTimestamp('2026-10-25','02:30'),Date.parse('2026-10-25T00:30:00Z'));
 for(const date of ['2026-02-30','2026-13-01','bad'])assert.equal(api.localTimestamp(date,'10:00'),null);
 assert.equal(api.localTimestamp('2026-10-21','24:00'),null);
 assert.deepEqual(plain(api.week('2026-01-01')),['2025-12-29','2025-12-30','2025-12-31','2026-01-01','2026-01-02','2026-01-03','2026-01-04']);
 assert.equal(api.addDays('2026-03-28',2),'2026-03-30');
 assert.equal(api.localParts(Date.parse('2026-10-20T22:30:00Z')).date,'2026-10-21');
});

test('portions scale precise quantities while preserving free text and original recipe',()=>{
 const recipe={servings:2,ingredients:[{qty:180,name:'riz',unit:'g'},{qty:.5,name:'citron'},{qty:'au goût',name:'sel'}]};
 const scaled=api.scaleIngredients(recipe,3);assert.equal(scaled[0].qty,270);assert.equal(scaled[1].qty,.75);assert.equal(scaled[2].qty,'au goût');assert.equal(scaled[2].scaled,false);assert.equal(recipe.ingredients[0].qty,180);
 for(const count of [0,21,1.5,NaN,'oops'])assert.throws(()=>api.scaleIngredients(recipe,count));
});

test('meal plan retains valid known recipes and portions within a bounded date window',()=>{
 const raw={'2026-10-21':{recipeId:'rice',portions:4,secret:'discard'},'2026-10-22':{recipeId:'unknown',portions:2},'2026-10-23':{recipeId:'rice',portions:0},'2026-02-30':{recipeId:'rice',portions:2},'2027-02-01':{recipeId:'rice',portions:2}};
 assert.deepEqual(plain(api.normalizePlan(raw,[{id:'rice'}],'2026-10-21')),{'2026-10-21':{recipeId:'rice',portions:4}});
 assert.deepEqual(plain(api.normalizePlan(raw,[],null)),{});
});

test('departure subtracts configured travel and buffer, ignores past/all-day appointments',()=>{
 const event={date:'2026-10-21',start:'10:30'},now=Date.parse('2026-10-21T08:00:00Z');
 const result=api.departure(event,{minutes:20,buffer:5,mode:'walk'},now);assert.equal(result.leaveAt,Date.parse('2026-10-21T08:05:00Z'));assert.equal(result.minutesUntil,5);assert.equal(result.mode,'walk');
 assert.equal(api.departure(event,{minutes:20,buffer:5},now+3600000),null);
 assert.equal(api.departure({...event,start:'Journée'},{minutes:20},now),null);
 assert.equal(api.departure(event,{minutes:-2},now),null);
});

test('rain reminder uses departure-hour forecast and never labels old or absent data dry',()=>{
 const now=Date.parse('2026-10-21T08:00:00Z'),weather={updatedAt:now,hours:[{date:'2026-10-21',time:'10 h',rain:65,code:3},{date:'2026-10-21',time:'11 h',rain:20,code:3}]};
 assert.equal(api.rainReminder(now+600000,weather,now).rain,65);
 assert.equal(api.rainReminder(now+3600000,weather,now),null);
 assert.equal(api.rainReminder(now,weather,now+7200001),null);
 assert.equal(api.rainReminder(now,null,now),null);
 assert.equal(api.rainReminder(now,{updatedAt:now,hours:[{date:'2026-10-21',time:'10 h',rain:null,code:61}]},now).code,61);
});

function board(at='2026-10-21T10:10:00+02:00') {return {station:{id:'8504030',name:'Moudon'},stationboard:[{name:'R9',category:'R',number:'9',to:'Lausanne',stop:{departure:at,platform:'1',prognosis:{departure:'2026-10-21T10:12:00+02:00',platform:'2'}}}]};}
test('Swiss board shows prognosis, filters malformed journeys and limits exposed fields',()=>{
 const raw=board();raw.stationboard.push({},raw.stationboard[0]);const value=api.boardData(raw,Date.parse('2026-10-21T08:00:00Z'));
 assert.equal(value.departures.length,1);assert.equal(value.departures[0].departureAt,Date.parse('2026-10-21T08:12:00Z'));assert.equal(value.departures[0].delay,2);assert.equal(value.departures[0].platform,'2');
 assert.throws(()=>api.boardData({},0));
});

test('Swiss API caches briefly, deduplicates pending boards and retains stale data on outage',async()=>{
 let now=Date.parse('2026-10-21T08:00:00Z'),calls=0,fail=false,urls=[];
 const client=api.transit({now:()=>now,fetch:async(url,options)=>{calls++;urls.push(url);assert.equal(options.credentials,'omit');if(fail)throw Error('offline');return {ok:true,json:async()=>url.includes('locations')?{stations:[{id:'8504030',name:'Moudon',type:'station'},{name:'no id'}]}:board()};}});
 const result=await client.board({id:'8504030',name:'Moudon'});assert.equal(result.stale,false);assert.equal(result.departures.length,1);
 await client.board({id:'8504030',name:'Moudon'});assert.equal(calls,1);
 now+=61000;await Promise.all([client.board('Moudon'),client.board('Moudon')]);assert.equal(calls,2);
 fail=true;now+=61000;const stale=await client.board('Moudon');assert.equal(stale.stale,true);assert.equal(stale.updatedAt,now-61000);assert.equal(stale.departures.length,1);
 await assert.rejects(client.board('Unknown'));fail=false;const stations=await client.search('Moudon');assert.equal(stations.length,1);await client.search('Moudon');assert.equal(calls,5);assert.ok(urls.every(u=>u.startsWith('https://transport.opendata.ch/v1/')));
});

test('Swiss API honors rate limiting and arrival routing uses event date/time',async()=>{
 let now=100000,calls=0;
 const limited=api.transit({now:()=>now,fetch:async()=>{calls++;return {ok:false,status:429,headers:{get:()=>120}};}});
 await assert.rejects(limited.board('Moudon'));await assert.rejects(limited.board('Moudon'));assert.equal(calls,1);now+=120001;await assert.rejects(limited.board('Moudon'));assert.equal(calls,2);
 let url;const client=api.transit({fetch:async u=>{url=new URL(u);return {ok:true,json:async()=>({connections:[{}, {from:{departure:'2026-10-21T09:00:00+02:00',station:{id:'a',name:'Moudon'}},to:{arrival:'2026-10-21T09:40:00+02:00',station:{id:'b',name:'Lausanne'}},products:['R'],sections:[{journey:{}},{walk:{}}]}]})};}});
 const routes=await client.connections('Moudon','Lausanne',{date:'2026-10-21',start:'10:00'});assert.equal(routes.length,1);assert.equal(routes[0].durationMinutes,40);assert.equal(routes[0].changes,0);assert.equal(url.searchParams.get('isArrivalTime'),'1');assert.equal(url.searchParams.get('date'),'2026-10-21');assert.equal(url.searchParams.get('time'),'10:00');
});
