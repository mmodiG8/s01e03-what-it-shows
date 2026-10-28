import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  causeOf, dayFirst, groupByCause, sameCause, uniqueById,
  type Report, type Tenant
} from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';

const data = new URL('../src/lib/data/', import.meta.url);
const reports: Report[] = JSON.parse(readFileSync(new URL('reports-4471.json', data), 'utf8'));
const tenants = new Map<string, Tenant>(
  readdirSync(new URL('tenants/', data)).map((file) => {
    const tenant: Tenant = JSON.parse(readFileSync(new URL(`tenants/${file}`, data), 'utf8'));
    return [tenant.handle, tenant];
  })
);

test('overlapping export pages produce exactly one report per ID', () => {
  assert.equal(reports.length, 427);
  const unique = uniqueById(reports);
  assert.equal(unique.length, 412);
  assert.ok(unique.every((r) => r.mergedInto === 4471));
  for (const r of unique) {
    for (const copy of reports.filter((copy) => copy.id === r.id)) assert.deepEqual(copy, r);
  }
});

test('counts come from tenants and form channels, not intake tags', () => {
  const groups = groupByCause(uniqueById(reports), (r) => tenants.get(r.tenant));
  assert.deepEqual(groups.map((g) => [g.cause, g.reports.length]), [['parser', 379], ['hint', 33]]);
  assert.deepEqual(groups.map((g) => g.taggedAs), [
    { parser: 356, hint: 23 }, { parser: 15, hint: 18 }
  ]);
  assert.equal(groups.reduce((sum, g) => sum + g.reports.length, 0), 412);
});

test('same subjects do not decide whether reports share a cause', () => {
  const alder = tenants.get('alder.physio');
  assert.equal(causeOf({ channel: 'form' }, alder), 'hint');
  assert.equal(causeOf({ channel: 'app' }, alder), 'parser');
  assert.equal(sameCause({ channel: 'app' }, alder, { channel: 'form' }, alder), false);
  assert.equal(sameCause({ channel: 'app' }, alder, { channel: 'email' }, alder), true);
  assert.equal(sameCause({ channel: 'email' }, undefined, { channel: 'email' }, undefined), false);
  assert.equal(causeOf({ channel: 'form' }, tenants.get('morrow.tax')), 'parser');
  assert.equal(dayFirst('en-US'), false);
});

test('the signed page uses a stable, derived desk reference', () => {
  const page = readFileSync(new URL('../src/routes/kb/incidents/4471-review/+page.svx', import.meta.url), 'utf8');
  const signature = page.match(/^signature: '([^']+)'$/m)?.[1];
  assert.ok(signature, 'The signed page must have a signature');
  assert.ok(signature.startsWith('v1.'), 'The page must use the exact course-issued ticket');
  const ref = deskRef(signature);
  assert.match(ref, /^DR-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  assert.equal(deskRef(` ${signature} `), ref);
  assert.notEqual(deskRef('another signature'), ref);
});
