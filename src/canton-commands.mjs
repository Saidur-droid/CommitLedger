function requireText(value, name) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${name} is required`);
  return text;
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
    issueNumber: Number(bounty.issueNumber),
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
    { pullRequest }
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
    { evidence }
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
