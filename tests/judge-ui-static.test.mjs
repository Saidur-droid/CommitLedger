import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const html = await fs.readFile(new URL('../web/index.html', import.meta.url), 'utf8');

test('judge UI marks the product ready without claiming submission ready', () => {
  assert.match(html, /id="competition-readiness"/);
  assert.match(html, /READY · product/);
  assert.doesNotMatch(html, /SUBMISSION READY/);
  assert.doesNotMatch(html, /HackCanton S3|Track 1|Mana \/ activity \/ journal/);
});

test('judge UI maps the six Colosseum judging criteria', () => {
  for (const label of ['Functionality','Potential Impact','Novelty','UX','Open-source \/ Composability','Business Plan']) {
    assert.match(html, new RegExp(label));
  }
});

test('judge UI presents the foundation settlement story and evidence-first proof', () => {
  assert.match(html, /A foundation pays contributors only after independently verified work/);
  assert.match(html, /Foundation \/ Maintainer/);
  assert.match(html, /Independent Verifier/);
  assert.match(html, /No simulated settlement success/i);
});

test('judge cockpit exposes the verified fixture and replay-rejection story', () => {
  assert.match(html, /GitHub #69 → PR #73/);
  assert.match(html, /REPLAY REJECTED/);
  assert.match(html, /Daml authorization \+ real Canton proof/);
  assert.match(html, /Crypto World's Fair 2026/);
});
