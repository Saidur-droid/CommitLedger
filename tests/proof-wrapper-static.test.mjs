import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const wrapper = await fs.readFile(new URL('../scripts/prove-and-report.sh', import.meta.url), 'utf8');
const verify = await fs.readFile(new URL('../scripts/verify-all.sh', import.meta.url), 'utf8');

test('single proof wrapper always reports exit status and useful diagnostics', () => {
  assert.match(wrapper, /EXIT STATUS/);
  assert.match(wrapper, /canton-demo\.log/);
  assert.match(wrapper, /canton-sandbox\.log/);
  assert.match(wrapper, /daml-tests\.log/);
  assert.match(wrapper, /node-tests\.log/);
});

test('verification prints explicit stage markers', () => {
  for (const marker of ['STAGE 1\\/4: Node','STAGE 2\\/4: DPM','STAGE 3\\/4: Daml build','STAGE 4\\/4: Daml tests']) {
    assert.match(verify, new RegExp(marker));
  }
});

test('verification explicitly disables errexit and checks every stage status', () => {
  assert.match(verify, /^set \+e$/m);
  assert.doesNotMatch(verify, /^set\s+-[A-Za-z]*e[A-Za-z]*\s*(?:#.*)?$/m);
  assert.match(verify, /npm test > evidence\/node-tests\.log 2>&1/);
  assert.match(verify, /status=\$\?/);
  assert.match(verify, /if \[ "\$status" -ne 0 \]; then/);
  assert.match(verify, /STAGE 1\/4: Node: PASS/);
  assert.match(verify, /STAGE 4\/4: Daml tests: PASS/);
  assert.match(verify, /BUILD\/TEST VERIFICATION COMPLETE/);
  assert.match(verify, /exit 0/);
});
