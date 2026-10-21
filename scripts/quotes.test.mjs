import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

test('curated sourced quotations remain unique, readable and alternate authors', () => {
  const context = vm.createContext({});
  context.window = context;
  vm.runInContext(readFileSync(new URL('../dist/data.js', import.meta.url), 'utf8'), context);
  context.HUB_DATA = context.window.HUB_DATA;
  vm.runInContext(readFileSync(new URL('../dist/quotes.js', import.meta.url), 'utf8'), context);
  const quotes = context.HUB_DATA.quotes;
  assert.ok(quotes.length >= 240);
  assert.equal(new Set(quotes.map(q => q.text.toLocaleLowerCase('fr'))).size, quotes.length);
  assert.ok(new Set(quotes.map(q => q.author)).size >= 16);
  for (const author of ['George Sand', 'Victor Hugo', 'Marceline Desbordes-Valmore', 'Jean de La Fontaine']) assert.ok(quotes.some(q => q.author === author));
  assert.ok(quotes.every(q => !/connoiss|connoître|paroître|dureroient|n’étoit|ne dépend pas moins/.test(q.text)));
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
