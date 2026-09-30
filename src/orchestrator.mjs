import { randomUUID } from "node:crypto";
import { expectLedgerFailure } from "./ledger-errors.mjs";
import { CantonJsonApi, extractTransactionCreatedEvents } from "./canton-json-api.mjs";
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
  if (!result?.updateId || !Number.isSafeInteger(offset) || offset <= 0) {
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

function roleClient(baseUrl, token, runtime) {
  const client = new CantonJsonApi({ baseUrl, token, userId: runtime.userId || "", insecureLocal: runtime.insecureLocal || false });
  client.packageIdSelectionPreference = runtime.packageId ? [runtime.packageId] : [];
  return client;
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
  const response = await client.submitAndWaitForTransaction({
    commands: [command],
    actAs: [actAs],
    workflowId,
    commandId: `${workflowId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    packageIdSelectionPreference: client.packageIdSelectionPreference || []
  });
  const transaction = response?.transaction;
  const offset = Number(transaction?.offset);
  if (!transaction?.updateId || !Number.isSafeInteger(offset) || offset <= 0) {
    throw new Error("Canton transaction response did not return updateId and offset");
  }
  const requestedEntity = String(lookupTemplateId).split(":").slice(-2).join(":");
  const matches = extractTransactionCreatedEvents(response).filter(candidate => {
    const candidateEntity = String(candidate?.templateId || "").split(":").slice(-2).join(":");
    return candidateEntity === requestedEntity && predicate(candidate?.createArgument || {});
  });
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one created ${requestedEntity} contract, found ${matches.length}`);
  }
  return {
    submission: { updateId: transaction.updateId, completionOffset: offset },
    event: matches[0]
  };
}

export function runtimeConfigFromEnv(env = process.env) {
  const fallbackToken = env.CANTON_TOKEN || "";
  const insecureLocal = env.CANTON_INSECURE_LOCAL === "true";
  const baseUrl = required(env.CANTON_JSON_API_URL, "CANTON_JSON_API_URL");
  if (insecureLocal && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname)) {
    throw new Error("insecure Canton mode requires loopback");
  }
  const token = (value, label) => insecureLocal ? String(value || "") : required(value, label);
  return {
    insecureLocal,
    userId: env.CANTON_USER_ID || "",
    baseUrl,
    packageId: required(env.CANTON_PACKAGE_ID, "CANTON_PACKAGE_ID"),
    packageName: required(env.CANTON_PACKAGE_NAME || "commit-ledger", "CANTON_PACKAGE_NAME"),
    parties: assertDistinctParties({
      maintainer: env.CANTON_MAINTAINER_PARTY,
      contributor: env.CANTON_CONTRIBUTOR_PARTY,
      verifier: env.CANTON_VERIFIER_PARTY
    }),
    tokens: {
      maintainer: token(env.CANTON_MAINTAINER_TOKEN || fallbackToken, "CANTON_MAINTAINER_TOKEN or CANTON_TOKEN"),
      contributor: token(env.CANTON_CONTRIBUTOR_TOKEN || fallbackToken, "CANTON_CONTRIBUTOR_TOKEN or CANTON_TOKEN"),
      verifier: token(env.CANTON_VERIFIER_TOKEN || fallbackToken, "CANTON_VERIFIER_TOKEN or CANTON_TOKEN")
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
  const packageName = runtime.packageName || "commit-ledger";
  const runId = randomUUID();
  contributorGithub = required(contributorGithub, "contributorGithub");
  const issue = await fetchGitHubIssue({ issueUrl, token: githubToken });
  const bounty = validateBountyDraft({
    bountyId: `demo-${runId}`,
    repository: issue.repository,
    issueNumber: issue.issueNumber,
    issueUrl: issue.issueUrl,
    title: issue.title,
    rewardAmount,
    rewardUnit: "DEMO_CREDIT"
  });

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

  const maintainerApi = roleClient(baseUrl, tokens.maintainer, runtime);
  const contributorApi = roleClient(baseUrl, tokens.contributor, runtime);
  const verifierApi = roleClient(baseUrl, tokens.verifier, runtime);
  const proof = {
    schemaVersion: 2,
    runId,
    packageId,
    packageName,
    generatedAt: now().toISOString(),
    environment: runtime.insecureLocal ? "local-sandbox-no-auth" : "authenticated-ledger",
    issue,
    bounty,
    parties,
    steps: [],
    negativeChecks: [],
    mergeEvidence: evidence,
    settlementReceipt: null
  };

  const bountyCreated = await submitAndFind({
    client: maintainerApi,
    command: buildCreateBountyCommand({
      packageName,
      maintainer: parties.maintainer,
      verifier: parties.verifier,
      bounty
    }),
    actAs: parties.maintainer,
    workflowId: "commitledger-create-bounty",
    lookupParty: parties.maintainer,
    lookupTemplateId: templateId(packageName, "Bounty"),
    predicate: arg => arg.bountyId === bounty.bountyId
  });
  proof.steps.push(proofStep("BOUNTY_ON_LEDGER", bountyCreated.submission, bountyCreated.event));

  const claimCreated = await submitAndFind({
    client: contributorApi,
    command: buildClaimRequestCommand({
      packageName,
      contributor: parties.contributor,
      maintainer: parties.maintainer,
      bountyId: bounty.bountyId,
      contributorGithub: required(contributorGithub, "contributorGithub")
    }),
    actAs: parties.contributor,
    workflowId: "commitledger-claim-request",
    lookupParty: parties.contributor,
    lookupTemplateId: templateId(packageName, "ClaimRequest"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.contributorGithub === contributorGithub
  });
  proof.steps.push(proofStep("CLAIM_REQUESTED", claimCreated.submission, claimCreated.event));

  const claimAccepted = await submitAndFind({
    client: maintainerApi,
    command: buildAcceptClaimCommand({
      packageName,
      claimRequestCid: claimCreated.event.contractId,
      bountyCid: bountyCreated.event.contractId
    }),
    actAs: parties.maintainer,
    workflowId: "commitledger-accept-claim",
    lookupParty: parties.maintainer,
    lookupTemplateId: templateId(packageName, "ClaimedBounty"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.contributorGithub === contributorGithub
  });
  proof.steps.push(proofStep("CLAIMED", claimAccepted.submission, claimAccepted.event));

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
      packageName,
      claimedBountyCid: claimAccepted.event.contractId,
      pullRequest
    }),
    actAs: parties.contributor,
    workflowId: "commitledger-submit-pr",
    lookupParty: parties.contributor,
    lookupTemplateId: templateId(packageName, "SubmittedBounty"),
    predicate: arg => arg.bountyId === bounty.bountyId && Number(arg.pullRequest?.prNumber) === Number(prNumber)
  });
  proof.steps.push(proofStep("PR_SUBMITTED", submitted.submission, submitted.event));

  proof.negativeChecks.push(await expectLedgerFailure(
    "wrong issue evidence rejected",
    () => verifierApi.submitAndWait({
      commands: [buildVerifyMergedCommand({
        packageName,
        submittedBountyCid: submitted.event.contractId,
        evidence: { ...evidence, issueNumber: evidence.issueNumber + 1000 }
      })],
      actAs: [parties.verifier],
      workflowId: "commitledger-negative-wrong-issue",
      commandId: `negative-wrong-issue-${Date.now()}`
    }),
    { codes: ["DAML_UNHANDLED_EXCEPTION", "DAML_INTERPRETATION_ERROR"], contains: "evidence issue number mismatch" }
  ));

  const verified = await submitAndFind({
    client: verifierApi,
    command: buildVerifyMergedCommand({
      packageName,
      submittedBountyCid: submitted.event.contractId,
      evidence
    }),
    actAs: parties.verifier,
    workflowId: "commitledger-verify-merge",
    lookupParty: parties.verifier,
    lookupTemplateId: templateId(packageName, "VerifiedBounty"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.evidence?.evidenceHash === evidence.evidenceHash
  });
  proof.steps.push(proofStep("VERIFIED", verified.submission, verified.event));

  const settledAt = now().toISOString();
  const settlementRef = `github:${evidence.repository}#${evidence.prNumber}:${evidence.evidenceHash.slice(7, 19)}`;
  proof.negativeChecks.push(await expectLedgerFailure(
    "unauthorized contributor settlement rejected",
    () => contributorApi.submitAndWait({
      commands: [buildSettleCommand({
        packageName,
        verifiedBountyCid: verified.event.contractId,
        settledAt,
        settlementRef: "unauthorized-attempt"
      })],
      actAs: [parties.contributor],
      workflowId: "commitledger-negative-unauthorized-settle",
      commandId: `negative-unauthorized-settle-${Date.now()}`
    }),
    { codes: ["DAML_AUTHORIZATION_ERROR"] }
  ));

  const settled = await submitAndFind({
    client: maintainerApi,
    command: buildSettleCommand({
      packageName,
      verifiedBountyCid: verified.event.contractId,
      settledAt,
      settlementRef
    }),
    actAs: parties.maintainer,
    workflowId: "commitledger-settle",
    lookupParty: parties.maintainer,
    lookupTemplateId: templateId(packageName, "SettlementReceipt"),
    predicate: arg => arg.bountyId === bounty.bountyId && arg.evidenceHash === evidence.evidenceHash
  });
  proof.steps.push(proofStep("SETTLED", settled.submission, settled.event));
  proof.settlementReceipt = settled.event.createArgument;

  proof.negativeChecks.push(await expectLedgerFailure(
    "duplicate settlement rejected",
    () => maintainerApi.submitAndWait({
      commands: [buildSettleCommand({
        packageName,
        verifiedBountyCid: verified.event.contractId,
        settledAt,
        settlementRef: "duplicate-attempt"
      })],
      actAs: [parties.maintainer],
      workflowId: "commitledger-negative-duplicate-settle",
      commandId: `negative-duplicate-settle-${Date.now()}`
    }),
    { codes: ["CONTRACT_NOT_FOUND", "CONTRACT_NOT_ACTIVE"], contains: verified.event.contractId }
  ));

  return proof;
}
