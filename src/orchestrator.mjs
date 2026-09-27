import { CantonJsonApi } from "./canton-json-api.mjs";
import {
  templateId,
  buildCreateBountyCommand,
  buildClaimRequestCommand,
  buildAcceptClaimCommand,
  buildSubmitPullRequestCommand,
  buildVerifyMergedCommand,
  buildSettleCommand
} from "./canton-commands.mjs";
import { assertDistinctParties, validateBountyDraft } from "./domain.mjs";
import { fetchGitHubIssue, fetchVerifiedPullRequest } from "./github-verifier.mjs";

function required(value, name) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${name} is required`);
  return text;
}

function offsetOf(result) {
  const offset = Number(result?.completionOffset);
  if (!result?.updateId || !Number.isFinite(offset)) {
    throw new Error("Canton submission did not return updateId and completionOffset");
  }
  return offset;
}

function proofStep(name, submission, event) {
  return {
    name,
    updateId: submission.updateId,
    completionOffset: Number(submission.completionOffset),
    contractId: event.contractId,
    templateId: event.templateId,
    createArgument: event.createArgument
  };
}

function roleClient(baseUrl, token) {
  return new CantonJsonApi({ baseUrl, token });
}

async function expectLedgerFailure(name, action) {
  try {
    await action();
  } catch (error) {
    return { name, rejected: true, error: error.message };
  }
  throw new Error(`Expected Canton rejection did not occur: ${name}`);
}

async function submitAndFind({
  client,
  command,
  actAs,
  workflowId,
  lookupParty,
  lookupTemplateId,
  predicate
}) {
  const submission = await client.submitAndWait({
    commands: [command],
    actAs: [actAs],
    workflowId,
    commandId: `${workflowId}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  });
  const event = await client.findActiveContract({
    party: lookupParty,
    templateId: lookupTemplateId,
    activeAtOffset: offsetOf(submission),
    predicate
  });
  return { submission, event };
}

export function runtimeConfigFromEnv(env = process.env) {
  const fallbackToken = env.CANTON_TOKEN || "";
  return {
    baseUrl: required(env.CANTON_JSON_API_URL, "CANTON_JSON_API_URL"),
    packageId: required(env.CANTON_PACKAGE_ID, "CANTON_PACKAGE_ID"),
    parties: assertDistinctParties({
      maintainer: env.CANTON_MAINTAINER_PARTY,
      contributor: env.CANTON_CONTRIBUTOR_PARTY,
      verifier: env.CANTON_VERIFIER_PARTY
    }),
    tokens: {
      maintainer: required(env.CANTON_MAINTAINER_TOKEN || fallbackToken, "CANTON_MAINTAINER_TOKEN or CANTON_TOKEN"),
      contributor: required(env.CANTON_CONTRIBUTOR_TOKEN || fallbackToken, "CANTON_CONTRIBUTOR_TOKEN or CANTON_TOKEN"),
      verifier: required(env.CANTON_VERIFIER_TOKEN || fallbackToken, "CANTON_VERIFIER_TOKEN or CANTON_TOKEN")
    }
  };
}

export async function runFullLifecycle({
  runtime,
  issueUrl,
  rewardAmount = 100,
  contributorGithub,
  prNumber,
  baseBranch = "main",
  githubToken = "",
  now = () => new Date()
}) {
  const { baseUrl, packageId, parties, tokens } = runtime;
  const issue = await fetchGitHubIssue({ issueUrl, token: githubToken });
  const bounty = validateBountyDraft({
    repository: issue.repository,
    issueNumber: issue.issueNumber,
    issueUrl: issue.issueUrl,
    title: issue.title,
    rewardAmount,
    rewardUnit: "DEMO_CREDIT"
  });

  const maintainerApi = roleClient(baseUrl, tokens.maintainer);
  const contributorApi = roleClient(baseUrl, tokens.contributor);
  const verifierApi = roleClient(baseUrl, tokens.verifier);
  const proof = {
    issue,
    bounty,
    parties,
    steps: [],
    negativeChecks: [],
    mergeEvidence: null,
    settlementReceipt: null
  };

  const bountyCreated = await submitAndFind({
    client: maintainerApi,
    command: buildCreateBountyCommand({
      packageId,
      maintainer: parties.maintainer,
      verifier: parties.verifier,
      bounty
    }),
    actAs: parties.maintainer,
    workflowId: "commitledger-create-bounty",
    lookupParty: parties.maintainer,
    lookupTemplateId: templateId(packageId, "Bounty"),
    predicate: arg => arg.bountyId === bounty.bountyId
  });
  proof.steps.push(proofStep("BOUNTY_ON_LEDGER", bountyCreated.submission, bountyCreated.event));

  const claimCreated = await submitAndFind({
    client: contributorApi,
    command: buildClaimRequestCommand({
      packageId,
      contributor: parties.contributor,
      maintainer: parties.maintainer,
      bountyId: bounty.bountyId,
      contributorGithub: required(contributorGithub, "contributorGithub")
    }),
    actAs: parties.contributor,
    workflowId: "commitledger-claim-request",
    lookupParty: parties.contributor,
    lookupTemplateId: templateId(packageId, "ClaimRequest"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.contributorGithub === contributorGithub
  });
  proof.steps.push(proofStep("CLAIM_REQUESTED", claimCreated.submission, claimCreated.event));

  const claimAccepted = await submitAndFind({
    client: maintainerApi,
    command: buildAcceptClaimCommand({
      packageId,
      claimRequestCid: claimCreated.event.contractId,
      bountyCid: bountyCreated.event.contractId
    }),
    actAs: parties.maintainer,
    workflowId: "commitledger-accept-claim",
    lookupParty: parties.maintainer,
    lookupTemplateId: templateId(packageId, "ClaimedBounty"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.contributorGithub === contributorGithub
  });
  proof.steps.push(proofStep("CLAIMED", claimAccepted.submission, claimAccepted.event));

  const evidence = await fetchVerifiedPullRequest({
    repository: bounty.repository,
    prNumber: Number(prNumber),
    token: githubToken,
    expected: {
      baseBranch,
      contributorGithub,
      issueNumber: bounty.issueNumber
    }
  });
  proof.mergeEvidence = evidence;

  const pullRequest = {
    repository: evidence.repository,
    prNumber: evidence.prNumber,
    prUrl: evidence.prUrl,
    headSha: evidence.headSha,
    baseBranch: evidence.baseBranch
  };

  const submitted = await submitAndFind({
    client: contributorApi,
    command: buildSubmitPullRequestCommand({
      packageId,
      claimedBountyCid: claimAccepted.event.contractId,
      pullRequest
    }),
    actAs: parties.contributor,
    workflowId: "commitledger-submit-pr",
    lookupParty: parties.contributor,
    lookupTemplateId: templateId(packageId, "SubmittedBounty"),
    predicate: arg => arg.bountyId === bounty.bountyId && Number(arg.pullRequest?.prNumber) === Number(prNumber)
  });
  proof.steps.push(proofStep("PR_SUBMITTED", submitted.submission, submitted.event));

  proof.negativeChecks.push(await expectLedgerFailure(
    "wrong issue evidence rejected",
    () => verifierApi.submitAndWait({
      commands: [buildVerifyMergedCommand({
        packageId,
        submittedBountyCid: submitted.event.contractId,
        evidence: { ...evidence, issueNumber: evidence.issueNumber + 1000 }
      })],
      actAs: [parties.verifier],
      workflowId: "commitledger-negative-wrong-issue",
      commandId: `negative-wrong-issue-${Date.now()}`
    })
  ));

  const verified = await submitAndFind({
    client: verifierApi,
    command: buildVerifyMergedCommand({
      packageId,
      submittedBountyCid: submitted.event.contractId,
      evidence
    }),
    actAs: parties.verifier,
    workflowId: "commitledger-verify-merge",
    lookupParty: parties.verifier,
    lookupTemplateId: templateId(packageId, "VerifiedBounty"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.evidence?.evidenceHash === evidence.evidenceHash
  });
  proof.steps.push(proofStep("VERIFIED", verified.submission, verified.event));

  const settledAt = now().toISOString();
  const settlementRef = `github:${evidence.repository}#${evidence.prNumber}:${evidence.evidenceHash.slice(7, 19)}`;
  proof.negativeChecks.push(await expectLedgerFailure(
    "unauthorized contributor settlement rejected",
    () => contributorApi.submitAndWait({
      commands: [buildSettleCommand({
        packageId,
        verifiedBountyCid: verified.event.contractId,
        settledAt,
        settlementRef: "unauthorized-attempt"
      })],
      actAs: [parties.contributor],
      workflowId: "commitledger-negative-unauthorized-settle",
      commandId: `negative-unauthorized-settle-${Date.now()}`
    })
  ));

  const settled = await submitAndFind({
    client: maintainerApi,
    command: buildSettleCommand({
      packageId,
      verifiedBountyCid: verified.event.contractId,
      settledAt,
      settlementRef
    }),
    actAs: parties.maintainer,
    workflowId: "commitledger-settle",
    lookupParty: parties.maintainer,
    lookupTemplateId: templateId(packageId, "SettlementReceipt"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.evidenceHash === evidence.evidenceHash
  });
  proof.steps.push(proofStep("SETTLED", settled.submission, settled.event));
  proof.settlementReceipt = settled.event.createArgument;

  proof.negativeChecks.push(await expectLedgerFailure(
    "duplicate settlement rejected",
    () => maintainerApi.submitAndWait({
      commands: [buildSettleCommand({
        packageId,
        verifiedBountyCid: verified.event.contractId,
        settledAt,
        settlementRef: "duplicate-attempt"
      })],
      actAs: [parties.maintainer],
      workflowId: "commitledger-negative-duplicate-settle",
      commandId: `negative-duplicate-settle-${Date.now()}`
    })
  ));

  return proof;
}
