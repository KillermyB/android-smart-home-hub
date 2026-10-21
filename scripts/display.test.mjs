import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
const module = name => { const c=vm.createContext({AbortSignal,ResizeObserver:undefined});vm.runInContext(readFileSync(new URL('../dist/'+name+'.js',import.meta.url),'utf8'),c);return c; };

test('native screen client confines requests to the frame and confirms fixed brightness',async()=>{
  const {HubScreen}=module('screen'),requests=[],location={protocol:'http:',hostname:'127.0.0.1',port:'4173'};
  let data={native:true,percent:75,fixed:true,key:'a'.repeat(64)};
  const request=async(url,options)=>{requests.push({url,options});return {ok:true,json:async()=>data};};
  for(const wrong of [{...location,hostname:'localhost'},{...location,protocol:'https:'},{...location,port:'8123'}])await assert.rejects(HubScreen.client(request,wrong).read());
  assert.equal(requests.length,0);
  const client=HubScreen.client(request,location);await assert.rejects(client.set(75));await client.read();await client.set(75);
  const call=requests.at(-1);assert.equal(call.url,'/cgi-bin/screen.cgi');assert.equal(call.options.method,'POST');assert.equal(call.options.headers['Content-Type'],'application/json');assert.equal(JSON.parse(call.options.body).percent,75);
  for(const invalid of [0,9,101,NaN,'50',12.5])await assert.rejects(client.set(invalid));
  data={...data,fixed:false};await assert.rejects(client.set(75),/confirmée/);
  data={...data,fixed:true,percent:30};await assert.rejects(client.set(75),/confirmée/);
});

test('native endpoint rejects foreign origins, form posts, invalid levels and keys before writing',()=>{
  const dir=mkdtempSync(join(tmpdir(),'hub-screen-'));
  try{
    const key='a'.repeat(64);writeFileSync(join(dir,'screen-key'),key);writeFileSync(join(dir,'screen_brightness'),'255');writeFileSync(join(dir,'screen_brightness_mode'),'1');
    writeFileSync(join(dir,'getprop'),'#!/bin/sh\ncase "$1" in ro.hardware) echo sun8i;; *) echo 6.0.1;; esac\n',{mode:0o700});
    writeFileSync(join(dir,'settings'),'#!/bin/sh\nif [ "$1" = get ]; then cat "$TEST_BASE/$3"; else printf "%s" "$4" >"$TEST_BASE/$3"; fi\n',{mode:0o700});
    const source=readFileSync(new URL('./device/screen.cgi',import.meta.url),'utf8').replace('BASE=/data/local/hub','BASE='+dir).replaceAll('/system/bin/busybox-smp ','').replace('[ "$1" = locked ] || exec flock -x "$BASE/screen.lock" /system/bin/sh "$0" locked','');
    const run=(body='',extra={})=>spawnSync('/bin/sh',['-c',source],{input:body,encoding:'utf8',env:{...process.env,PATH:dir+':'+process.env.PATH,TEST_BASE:dir,REMOTE_ADDR:'127.0.0.1',HTTP_HOST:'127.0.0.1:4173',HTTP_REFERER:'http://127.0.0.1:4173/',REQUEST_METHOD:body?'POST':'GET',CONTENT_TYPE:'application/json',CONTENT_LENGTH:String(Buffer.byteLength(body)),...extra}}).stdout;
    const valid=JSON.stringify({percent:75,key});assert.match(run(),/"fixed":false/);
    for(const extra of [{REMOTE_ADDR:'192.168.1.2'},{HTTP_HOST:'evil.test:4173'},{HTTP_REFERER:'http://evil.test/'},{HTTP_REFERER:''},{CONTENT_TYPE:'text/plain'},{CONTENT_TYPE:'application/x-www-form-urlencoded'},{REQUEST_METHOD:'DELETE'}])assert.doesNotMatch(run(valid,extra),/200 OK/);
    for(const body of [JSON.stringify({percent:0,key}),JSON.stringify({percent:101,key}),JSON.stringify({percent:75,key:'b'.repeat(64)}),JSON.stringify({percent:'75;touch /tmp/unsafe',key})])assert.doesNotMatch(run(body),/200 OK/);
    assert.equal(readFileSync(join(dir,'screen_brightness_mode'),'utf8'),'1');assert.equal(existsSync(join(dir,'screen-percent')),false);
    assert.match(run(valid),/200 OK/);assert.equal(readFileSync(join(dir,'screen_brightness_mode'),'utf8'),'0');assert.equal(readFileSync(join(dir,'screen_brightness'),'utf8'),'191');assert.equal(readFileSync(join(dir,'screen-percent'),'utf8'),'75\n');assert.match(run(),/"percent":75,"fixed":true/);
  }finally{rmSync(dir,{recursive:true,force:true});}
});

test('music outline is one closed path at actual tile dimensions with no dashed seam at completion',()=>{
  const {HubMusicOrbit}=module('music-orbit');
  for(const [width,height] of [[301.5,180.5],[292,170],[640,180],[320,220]]){
    const shape=HubMusicOrbit.geometry(width,height,25);assert.match(shape.path,/ Z$/);assert.equal((shape.path.match(/ A /g)||[]).length,4);assert.ok(shape.length>0);assert.ok(!/NaN/.test(shape.path));
    const line={style:{},setAttribute(name,value){this[name]=value;}};const track={setAttribute(name,value){this[name]=value;}};
    const svg={parentNode:{},getBoundingClientRect:()=>({width,height}),getAttribute:()=>String(svg.progress),setAttribute(){},querySelectorAll:()=>[track,line],querySelector:()=>line};
    // Provide the computed corner radius through the module context.
    const ctx=module('music-orbit');ctx.getComputedStyle=()=>({borderTopLeftRadius:'25px'});
    for(const p of [0,1,48,59,72,99.99,100]){svg.progress=p;ctx.HubMusicOrbit.paint(svg);assert.equal(track.d,line.d);assert.equal(line.style.strokeOpacity,p>0?'1':'0');if(p===100)assert.equal(line['stroke-dasharray'],'none');else{const [draw,gap]=line['stroke-dasharray'].split(' ').map(Number);assert.ok(gap>shape.length);assert.ok(Math.abs(draw-shape.length*p/100)<0.001);}}
  }
});
