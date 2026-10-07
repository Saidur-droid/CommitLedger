import test from "node:test";
import assert from "node:assert/strict";
import { buildEvidencePassport } from "../src/evidence-passport.mjs";

const proof = {
  runId: "run-1",
  generatedAt: "2026-10-07T00:00:00.000Z",
  sourceCommit: "a".repeat(40),
  environment: "authenticated-devnet",
  packageId: "b".repeat(64),
  parties: { maintainer: "Maintainer::1", contributor: "Contributor::1", verifier: "Verifier::1" },
  steps: [
    {name:"BOUNTY_ON_LEDGER",contractId:"c1",updateId:"u1",completionOffset:1},
    {name:"CLAIM_REQUESTED",contractId:"c2",updateId:"u2",completionOffset:2},
    {name:"CLAIMED",contractId:"c3",updateId:"u3",completionOffset:3},
    {name:"PR_SUBMITTED",contractId:"c4",updateId:"u4",completionOffset:4},
    {name:"VERIFIED",contractId:"c5",updateId:"u5",completionOffset:5},
    {name:"SETTLED",contractId:"receipt-cid",updateId:"settle-update",completionOffset:6}
  ],
  negativeChecks: [
    {name:"wrong issue evidence rejected",code:"DAML_UNHANDLED_EXCEPTION"},
    {name:"unauthorized contributor settlement rejected",code:"DAML_AUTHORIZATION_ERROR"},
    {name:"duplicate settlement rejected",code:"CONTRACT_NOT_FOUND"}
  ],
  settlementReceipt: {
    repository:"Saidur-droid/MergeEarn",
    issueNumber:69,
    pullRequest:{prNumber:73},
    mergeCommitSha:"c".repeat(40),
    evidenceHash:"sha256:proof",
    rewardAmount:"100",
    rewardUnit:"DEMO_CREDIT",
    settlementRef:"github:Saidur-droid/MergeEarn#73:proof"
  }
};

test("evidence passport keeps work, authority, settlement and rejection proof together", () => {
  const passport = buildEvidencePassport(proof);
  assert.equal(passport.product, "CommitLedger");
  assert.equal(passport.workEvidence.issueNumber, 69);
  assert.equal(passport.settlement.receiptContractId, "receipt-cid");
  assert.equal(passport.security.checks.length, 3);
  assert.equal(passport.integrity.realMoney, false);
});

test("evidence passport fails closed for incomplete proof", () => {
  assert.throws(() => buildEvidencePassport({...proof, negativeChecks: []}), /three negative checks/);
});
