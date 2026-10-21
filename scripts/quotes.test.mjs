import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('240 unique sourced quotations remain readable and alternate authors', () => {
  const context = vm.createContext({});
  context.window = context;
  vm.runInContext(readFileSync(new URL('../dist/data.js', import.meta.url), 'utf8'), context);
  context.HUB_DATA = context.window.HUB_DATA;
  vm.runInContext(readFileSync(new URL('../dist/quotes.js', import.meta.url), 'utf8'), context);
  const quotes = context.HUB_DATA.quotes;
  assert.equal(quotes.length, 240);
  assert.equal(new Set(quotes.map(q => q.text.toLocaleLowerCase('fr'))).size, 240);
  assert.equal(new Set(quotes.map(q => q.author)).size, 8);
  quotes.forEach((q, i) => {
    assert.ok(q.text.length > 5 && q.text.length <= 240);
    assert.ok(q.author && q.work);
    assert.ok(['Stoïcisme', 'Littérature', 'Philosophie'].includes(q.category));
    assert.equal(new URL(q.source).protocol, 'https:');
    if (i) assert.notEqual(q.author, quotes[i - 1].author);
  });
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const deferred = [...html.matchAll(/<script src="([^"]+)" defer>/g)].map(x => x[1]);
  assert.ok(deferred.indexOf('data.js') < deferred.indexOf('quotes.js'));
  assert.ok(deferred.indexOf('quotes.js') < deferred.indexOf('app.js'));
});
