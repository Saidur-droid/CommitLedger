import test from "node:test";
import assert from "node:assert/strict";
import { assertTransition, validateBountyDraft } from "../src/domain.mjs";

test("allows only the intended competition lifecycle", () => {
  assert.doesNotThrow(() => assertTransition("DRAFT", "ISSUE_VERIFIED"));
  assert.doesNotThrow(() => assertTransition("VERIFIED", "SETTLED"));
  assert.throws(() => assertTransition("BOUNTY_ON_LEDGER", "SETTLED"), /invalid transition/);
  assert.throws(() => assertTransition("SETTLED", "VERIFIED"), /invalid transition/);
});

test("normalizes a deterministic bounty draft", () => {
  const draft = validateBountyDraft({
    repository: "Saidur-droid/CommitLedger",
    issueNumber: 1,
    issueUrl: "https://github.com/Saidur-droid/CommitLedger/issues/1",
    title: "Verified contribution settlement",
    rewardAmount: 100
  });

  assert.equal(draft.bountyId, "bounty-Saidur-droid-CommitLedger-1");
  assert.equal(draft.rewardAmount, "100.0");
  assert.equal(draft.rewardUnit, "DEMO_CREDIT");
});
