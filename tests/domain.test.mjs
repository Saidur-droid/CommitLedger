import test from "node:test";
import assert from "node:assert/strict";
import { assertDistinctParties, assertTransition, validateBountyDraft } from "../src/domain.mjs";

test("allows only the intended competition lifecycle", () => {
  assert.doesNotThrow(() => assertTransition("DRAFT", "ISSUE_VERIFIED"));
  assert.doesNotThrow(() => assertTransition("BOUNTY_ON_LEDGER", "CLAIM_REQUESTED"));
  assert.doesNotThrow(() => assertTransition("CLAIM_REQUESTED", "CLAIMED"));
  assert.doesNotThrow(() => assertTransition("PR_SUBMITTED", "CLAIMED"));
  assert.doesNotThrow(() => assertTransition("VERIFIED", "SETTLED"));
  assert.throws(() => assertTransition("BOUNTY_ON_LEDGER", "SETTLED"), /invalid transition/);
  assert.throws(() => assertTransition("SETTLED", "VERIFIED"), /invalid transition/);
});

test("requires three distinct Canton roles", () => {
  assert.deepEqual(assertDistinctParties({
    maintainer: "Maintainer::1",
    contributor: "Contributor::1",
    verifier: "Verifier::1"
  }), {
    maintainer: "Maintainer::1",
    contributor: "Contributor::1",
    verifier: "Verifier::1"
  });
  assert.throws(() => assertDistinctParties({
    maintainer: "Same::1",
    contributor: "Same::1",
    verifier: "Verifier::1"
  }), /distinct Canton parties/);
});

test("normalizes a deterministic bounty draft", () => {
  const draft = validateBountyDraft({
    repository: "Saidur-droid/CommitLedger",
    issueNumber: 5,
    issueUrl: "https://github.com/Saidur-droid/CommitLedger/issues/5",
    title: "Verified contribution settlement",
    rewardAmount: 100
  });

  assert.equal(draft.bountyId, "bounty-Saidur-droid-CommitLedger-5");
  assert.equal(draft.rewardAmount, "100.0");
  assert.equal(draft.rewardUnit, "DEMO_CREDIT");
});
