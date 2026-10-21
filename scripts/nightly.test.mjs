import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const script=new URL('./device/nightly-restart.sh',import.meta.url);
test('nightly restart happens once in its night window, never during startup or an active countdown',()=>{
 const run=(clock='0430',last='2026-10-20',uptime='901',until='0',now='1000')=>spawnSync('sh',[fileURLToPath(script),'decide',clock,'2026-10-21',last,uptime,until,now],{encoding:'utf8'}).stdout.trim();
 for(const clock of ['0430','0459','0500','0529'])assert.equal(run(clock),'restart');
 for(const clock of ['0429','0530','1200','0000'])assert.equal(run(clock),'wait');
 assert.equal(run('0430','2026-10-21'),'wait');assert.equal(run('0430','2026-10-20','899'),'wait');assert.equal(run('0430','2026-10-20','901','1001'),'wait');
});
test('native countdown deadline endpoint rejects foreign pages, invalid keys and injected durations before writing',()=>{
 const dir=mkdtempSync(join(tmpdir(),'hub-nightly-'));
 try{const key='a'.repeat(64);writeFileSync(join(dir,'screen-key'),key);writeFileSync(join(dir,'getprop'),'#!/bin/sh\ncase "$1" in ro.hardware) echo sun8i;; *) echo 6.0.1;; esac\n',{mode:0o700});
 let source=readFileSync(new URL('./device/activity.cgi',import.meta.url),'utf8').replace('BASE=/data/local/hub','BASE="'+dir+'"').replaceAll('"$BB" ','');
 const file=join(dir,'activity.cgi');writeFileSync(file,source);const valid=JSON.stringify({seconds:120,key});
 const run=(body=valid,extra={})=>spawnSync('sh',[file],{input:body,encoding:'utf8',env:{...process.env,PATH:dir+':'+process.env.PATH,REMOTE_ADDR:'127.0.0.1',HTTP_HOST:'127.0.0.1:4173',HTTP_REFERER:'http://127.0.0.1:4173/',REQUEST_METHOD:'POST',CONTENT_TYPE:'application/json',CONTENT_LENGTH:String(Buffer.byteLength(body)),...extra}}).stdout;
 for(const extra of [{REMOTE_ADDR:'192.168.1.2'},{HTTP_HOST:'evil.test'},{HTTP_REFERER:'https://evil.test/'},{HTTP_REFERER:''},{CONTENT_TYPE:'text/plain'},{REQUEST_METHOD:'GET'}])assert.doesNotMatch(run(valid,extra),/200 OK/);
 for(const body of [JSON.stringify({seconds:86401,key}),JSON.stringify({seconds:12,key:'b'.repeat(64)}),JSON.stringify({seconds:'1;reboot',key})])assert.doesNotMatch(run(body),/200 OK/);
 assert.equal(existsSync(join(dir,'activity-until')),false);assert.match(run(),/200 OK/);assert.ok(Number(readFileSync(join(dir,'activity-until'),'utf8'))>Date.now()/1000+200);assert.match(run(JSON.stringify({seconds:0,key})),/200 OK/);assert.equal(readFileSync(join(dir,'activity-until'),'utf8'),'0\n');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('activity client uses the existing native nonce and validates countdown bounds',async()=>{
 const c=vm.createContext({AbortSignal});vm.runInContext(readFileSync(new URL('../dist/screen.js',import.meta.url),'utf8'),c);const calls=[];const client=c.HubScreen.client(async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>url.includes('activity')?{native:true,saved:true}:{native:true,percent:25,fixed:true,key:'a'.repeat(64)}};},{protocol:'http:',hostname:'127.0.0.1',port:'4173'});
 for(const n of [-1,86401,NaN,1.2,'10'])await assert.rejects(client.activity(n));assert.equal(calls.length,0);assert.equal(await client.activity(60),true);assert.equal(calls.length,2);assert.equal(JSON.parse(calls[1].options.body).seconds,60);assert.equal(JSON.parse(calls[1].options.body).key.length,64);
});
