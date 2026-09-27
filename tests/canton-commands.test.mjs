import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCreateBountyCommand,
  buildVerifyMergedCommand,
  buildSettleCommand
} from "../src/canton-commands.mjs";

test("builds a Daml Bounty create command with the exact template", () => {
  const command = buildCreateBountyCommand({
    packageId: "pkg123",
    maintainer: "Maintainer::1",
    verifier: "Verifier::1",
    bounty: {
      bountyId: "bounty-1",
      repository: "Saidur-droid/CommitLedger",
      issueNumber: 1,
      issueUrl: "https://github.com/Saidur-droid/CommitLedger/issues/1",
      title: "Demo",
      rewardAmount: "100.0",
      rewardUnit: "DEMO_CREDIT"
    }
  });
  assert.equal(command.CreateCommand.templateId, "pkg123:CommitLedger:Bounty");
  assert.equal(command.CreateCommand.createArguments.rewardUnit, "DEMO_CREDIT");
});

test("binds canonical merge evidence into the verifier choice", () => {
  const evidence = {
    repository: "Saidur-droid/CommitLedger",
    prNumber: 2,
    prUrl: "https://github.com/Saidur-droid/CommitLedger/pull/2",
    headSha: "abc",
    baseBranch: "main",
    merged: true,
    mergedAt: "2026-09-27T00:00:00Z",
    evidenceHash: "sha256:abc"
  };
  const command = buildVerifyMergedCommand({
    packageId: "pkg123",
    submittedBountyCid: "cid-submitted",
    evidence
  });
  assert.equal(command.ExerciseCommand.choice, "SubmittedBounty_VerifyMerged");
  assert.deepEqual(command.ExerciseCommand.choiceArgument.evidence, evidence);
});

test("settlement is an explicit consuming Daml choice", () => {
  const command = buildSettleCommand({
    packageId: "pkg123",
    verifiedBountyCid: "cid-verified",
    settledAt: "2026-09-27T10:00:00Z",
    settlementRef: "settlement-001"
  });
  assert.equal(command.ExerciseCommand.choice, "VerifiedBounty_Settle");
});
