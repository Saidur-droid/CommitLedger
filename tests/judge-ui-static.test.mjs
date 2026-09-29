import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const html = await fs.readFile(new URL('../web/index.html', import.meta.url), 'utf8');

test('judge UI exposes competition readiness without claiming ready by default', () => {
  assert.match(html, /id="competition-readiness"/);
  assert.match(html, /BLOCKED/);
  assert.doesNotMatch(html, /SUBMISSION READY/);
});

test('judge UI maps all six official judging criteria', () => {
  for (const label of ['Value \/ Problem','ICP \/ Audience','Metrics \/ Validation','GTM Materials','MVP Materials','Pitch Materials']) {
    assert.match(html, new RegExp(label));
  }
});

test('judge UI identifies Track 1 and keeps runtime proof evidence-first', () => {
  assert.match(html, /Track 1/);
  assert.match(html, /No sample transaction IDs or simulated settlement success/);
});

test('judge cockpit exposes source authorization settlement and runtime summary', () => {
  for (const label of ['Source','Authorization','Settlement','Runtime']) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /Runtime[\s\S]*BLOCKED/);
});
