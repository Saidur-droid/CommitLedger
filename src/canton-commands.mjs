function requireText(value, name) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${name} is required`);
  return text;
}

function damlInt(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number)) throw new Error(`${name} must be a safe integer`);
  return String(number);
}

function normalizePullRequestRef(pullRequest) {
  return {
    repository: requireText(pullRequest?.repository, "pullRequest.repository"),
    prNumber: damlInt(pullRequest?.prNumber, "pullRequest.prNumber"),
    prUrl: requireText(pullRequest?.prUrl, "pullRequest.prUrl"),
    headSha: requireText(pullRequest?.headSha, "pullRequest.headSha"),
    baseBranch: requireText(pullRequest?.baseBranch, "pullRequest.baseBranch")
  };
}

function normalizeMergeEvidence(evidence) {
  return {
    repository: requireText(evidence?.repository, "evidence.repository"),
    issueNumber: damlInt(evidence?.issueNumber, "evidence.issueNumber"),
    prNumber: damlInt(evidence?.prNumber, "evidence.prNumber"),
    prUrl: requireText(evidence?.prUrl, "evidence.prUrl"),
    headSha: requireText(evidence?.headSha, "evidence.headSha"),
    mergeCommitSha: requireText(evidence?.mergeCommitSha, "evidence.mergeCommitSha"),
    baseBranch: requireText(evidence?.baseBranch, "evidence.baseBranch"),
    merged: Boolean(evidence?.merged),
    mergedAt: requireText(evidence?.mergedAt, "evidence.mergedAt"),
    evidenceHash: requireText(evidence?.evidenceHash, "evidence.evidenceHash")
  };
}

export function templateId(packageId, template) {
  return `${requireText(packageId, "packageId")}:CommitLedger:${template}`;
}

export function createCommand(template, args) {
  return { CreateCommand: { templateId: template, createArguments: args } };
}

export function exerciseCommand(template, contractId, choice, choiceArgument = {}) {
  return {
    ExerciseCommand: {
      templateId: template,
      contractId: requireText(contractId, "contractId"),
      choice,
      choiceArgument
    }
  };
}

export function buildCreateBountyCommand({ packageId, maintainer, verifier, bounty }) {
  return createCommand(templateId(packageId, "Bounty"), {
    maintainer: requireText(maintainer, "maintainer"),
    verifier: requireText(verifier, "verifier"),
    bountyId: requireText(bounty.bountyId, "bountyId"),
    repository: requireText(bounty.repository, "repository"),
    issueNumber: damlInt(bounty.issueNumber, "issueNumber"),
    issueUrl: requireText(bounty.issueUrl, "issueUrl"),
    title: requireText(bounty.title, "title"),
    rewardAmount: requireText(bounty.rewardAmount, "rewardAmount"),
    rewardUnit: requireText(bounty.rewardUnit, "rewardUnit")
  });
}

export function buildClaimRequestCommand({ packageId, contributor, maintainer, bountyId, contributorGithub }) {
  return createCommand(templateId(packageId, "ClaimRequest"), {
    contributor: requireText(contributor, "contributor"),
    maintainer: requireText(maintainer, "maintainer"),
    bountyId: requireText(bountyId, "bountyId"),
    contributorGithub: requireText(contributorGithub, "contributorGithub")
  });
}

export function buildAcceptClaimCommand({ packageId, claimRequestCid, bountyCid }) {
  return exerciseCommand(
    templateId(packageId, "ClaimRequest"),
    claimRequestCid,
    "ClaimRequest_Accept",
    { bountyCid: requireText(bountyCid, "bountyCid") }
  );
}

export function buildSubmitPullRequestCommand({ packageId, claimedBountyCid, pullRequest }) {
  return exerciseCommand(
    templateId(packageId, "ClaimedBounty"),
    claimedBountyCid,
    "ClaimedBounty_SubmitPullRequest",
    { pullRequest: normalizePullRequestRef(pullRequest) }
  );
}

export function buildReturnForRevisionCommand({ packageId, submittedBountyCid, reason }) {
  return exerciseCommand(
    templateId(packageId, "SubmittedBounty"),
    submittedBountyCid,
    "SubmittedBounty_ReturnForRevision",
    { reason: requireText(reason, "reason") }
  );
}

export function buildVerifyMergedCommand({ packageId, submittedBountyCid, evidence }) {
  return exerciseCommand(
    templateId(packageId, "SubmittedBounty"),
    submittedBountyCid,
    "SubmittedBounty_VerifyMerged",
    { evidence: normalizeMergeEvidence(evidence) }
  );
}

export function buildSettleCommand({ packageId, verifiedBountyCid, settledAt, settlementRef }) {
  return exerciseCommand(
    templateId(packageId, "VerifiedBounty"),
    verifiedBountyCid,
    "VerifiedBounty_Settle",
    {
      settledAt: requireText(settledAt, "settledAt"),
      settlementRef: requireText(settlementRef, "settlementRef")
    }
  );
}
