import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const html = await fs.readFile(new URL('../web/index.html', import.meta.url), 'utf8');

test('judge UI exposes competition readiness without claiming submission ready', () => {
  assert.match(html, /id="competition-readiness"/);
  assert.match(html, /BLOCKED · external gates pending/);
  assert.doesNotMatch(html, /SUBMISSION READY/);
});

test('judge UI maps all six official judging criteria', () => {
  for (const label of ['Value \/ Problem','ICP \/ Audience','Metrics \/ Validation','GTM Materials','MVP Materials','Pitch Materials']) {
    assert.match(html, new RegExp(label));
  }
});

test('judge UI identifies the Season 4 RWA / Business Workflows track and remains evidence-first', () => {
  assert.match(html, /RWA \/ Business Workflows/);
  assert.match(html, /no sample transaction IDs or simulated settlement success/i);
});

test('judge cockpit exposes current verified fixture and runtime proof state', () => {
  for (const label of ['Source','Authorization','Settlement','Runtime']) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /GitHub #69 → PR #73/);
  assert.match(html, /Runtime[\s\S]*VERIFIED/);
  assert.match(html, /PASS[\s\S]*Daml \+ real Canton proof/);
});

test('Season 4 judge mode exposes passport and replay rejection story', () => {
  assert.match(html, /60-SECOND JUDGE MODE/);
  assert.match(html, /Open Evidence Passport/);
  assert.match(html, /Show the rejection moment/);
  assert.match(html, /RWA \/ Business Workflows/);
});
