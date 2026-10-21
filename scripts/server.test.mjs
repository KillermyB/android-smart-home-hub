import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import http from 'node:http';

test('private local server rejects secret files, foreign hosts and cross-origin writes', async t => {
  const folder = await mkdtemp(join(tmpdir(), 'smart-hub-test-'));
  const port = 4197;
  const secret='local-only-sentinel-do-not-serve';
  const child = spawn(process.execPath, ['server.mjs'], { cwd: new URL('..', import.meta.url), env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', BASE_URL: `http://localhost:${port}`, HUB_DATA_DIR: folder, TODOIST_API_TOKEN: '', MICROSOFT_CLIENT_ID: '', MICROSOFT_CLIENT_SECRET:secret, GOOGLE_CLIENT_ID: '' }, stdio: ['ignore','pipe','pipe'] });
  t.after(async () => { if(child.exitCode===null&&child.signalCode===null){const exited=new Promise(r=>child.once('exit',r));child.kill();await exited;} await rm(folder, { recursive: true, force: true }); });
  await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('error', reject); child.once('exit', code => reject(new Error('Server stopped: ' + code))); });
  const base = `http://127.0.0.1:${port}`;
  const page = await fetch(base);
  assert.equal(page.status,200);
  assert.match(await page.text(), /Hub\./);
  const status = await (await fetch(base + '/api/status')).json();
  assert.equal(status.calendarConnected,false);
  assert.equal(status.todoist.connected,false);
  for (const path of ['/.env','/.data/key','/server.mjs','/../.env','/api/unknown']) assert.equal((await fetch(base + path)).status,404,path);
  const foreignHostStatus=await new Promise((resolve,reject)=>{http.get(base,{headers:{Host:'attacker.invalid'}},res=>{res.resume();resolve(res.statusCode);}).on('error',reject);});
  assert.equal(foreignHostStatus,403);
  assert.equal((await fetch(base + '/api/tasks',{method:'POST',headers:{Origin:'https://attacker.invalid','Content-Type':'application/json'},body:'{"content":"must not be created"}'})).status,403);
  assert.equal((await fetch(base + '/auth/google')).status,400);
  assert.equal((await fetch(base + '/auth/callback/google?state=forged&code=forged')).status,400);
  for(const asset of ['lyrics.js','home-assistant.js','spotify-link.js','music-colors.js','connection-bundle.js','calendar-import.js','vendor/ical.js','agenda-layout.js']){const response=await fetch(base+'/'+asset);assert.equal(response.status,200,asset);assert.match(response.headers.get('content-type'),/javascript/);}
  for(const name of ['manrope.woff2','manrope-600.woff2','dm-sans-400.woff2']){const font=await fetch(base+'/fonts/'+name);assert.equal(font.status,200,name);assert.match(font.headers.get('content-type'),/font\/woff2/);}
  const weatherIcon=await fetch(base+'/weather-icons/partly-cloudy-day.svg');assert.equal(weatherIcon.status,200);assert.match(weatherIcon.headers.get('content-type'),/svg/);assert.equal((await fetch(base+'/weather-icons/unknown.svg')).status,404);
  const source=await (await fetch(base+'/app.js')).text();assert.equal(source.includes(secret),false);
});

test('network listener refuses to start without an association secret', async () => {
  const child=spawn(process.execPath,['server.mjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,HOST:'0.0.0.0',HUB_ACCESS_TOKEN:''},stdio:'ignore'});
  const code=await new Promise(resolve=>child.once('exit',resolve));assert.notEqual(code,0);
});
