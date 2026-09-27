import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCreateBountyCommand,
  buildReturnForRevisionCommand,
  buildVerifyMergedCommand,
  buildSettleCommand
} from "../src/canton-commands.mjs";

test("builds a Daml Bounty create command with the exact template", () => {
  const command = buildCreateBountyCommand({
    packageId: "pkg123",
    maintainer: "Maintainer::1",
    verifier: "Verifier::1",
    bounty: {
      bountyId: "bounty-5",
      repository: "Saidur-droid/CommitLedger",
      issueNumber: 5,
      issueUrl: "https://github.com/Saidur-droid/CommitLedger/issues/5",
      title: "Demo",
      rewardAmount: "100.0",
      rewardUnit: "DEMO_CREDIT"
    }
  });
  assert.equal(command.CreateCommand.templateId, "pkg123:CommitLedger:Bounty");
  assert.equal(command.CreateCommand.createArguments.rewardUnit, "DEMO_CREDIT");
});

test("builds the explicit revision path", () => {
  const command = buildReturnForRevisionCommand({
    packageId: "pkg123",
    submittedBountyCid: "cid-submitted",
    reason: "Update tests"
  });
  assert.equal(command.ExerciseCommand.choice, "SubmittedBounty_ReturnForRevision");
  assert.equal(command.ExerciseCommand.choiceArgument.reason, "Update tests");
});

test("binds issue-aware canonical merge evidence into the verifier choice", () => {
  const evidence = {
    repository: "Saidur-droid/CommitLedger",
    issueNumber: 5,
    prNumber: 6,
    prUrl: "https://github.com/Saidur-droid/CommitLedger/pull/6",
    headSha: "abc",
    baseBranch: "main",
    merged: true,
    mergedAt: "2026-09-27T10:57:30Z",
    evidenceHash: "sha256:abc"
  };
  const command = buildVerifyMergedCommand({
    packageId: "pkg123",
    submittedBountyCid: "cid-submitted",
    evidence
  });
  assert.equal(command.ExerciseCommand.choice, "SubmittedBounty_VerifyMerged");
  assert.equal(command.ExerciseCommand.choiceArgument.evidence.issueNumber, 5);
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
