import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const context=vm.createContext({module:{exports:{}}});
vm.runInContext(readFileSync(new URL('../dist/music-colors.js',import.meta.url),'utf8'),context);
const {palette}=context.module.exports;
test('cover palettes follow the dominant hue while keeping both background stops dark',()=>{
 const red=palette([230,35,20,255,200,30,10,255,255,255,255,255]),blue=palette([20,35,230,255,25,30,200,255]);
 assert.notEqual(red.a,blue.a);assert.match(red.a,/hsl\((?:[0-9]|1[0-9]), 38%, 23%\)/);assert.match(blue.a,/hsl\(2[0-5][0-9], 38%, 23%\)/);
 for(const colors of [red,blue])assert.match(colors.b,/, 30%, 11%\)/);
});
test('empty, transparent and neutral covers retain a readable fallback',()=>{
 const fallback=JSON.stringify(palette([]));
 assert.equal(JSON.stringify(palette([255,0,0,0])),fallback);assert.equal(JSON.stringify(palette([0,0,0,255,240,240,240,255])),fallback);
});
