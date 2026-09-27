export const bountyStates = Object.freeze([
  "DRAFT",
  "ISSUE_VERIFIED",
  "BOUNTY_ON_LEDGER",
  "CLAIM_REQUESTED",
  "CLAIMED",
  "PR_SUBMITTED",
  "VERIFIED",
  "SETTLED",
  "CANCELLED"
]);

const transitions = Object.freeze({
  DRAFT: ["ISSUE_VERIFIED"],
  ISSUE_VERIFIED: ["BOUNTY_ON_LEDGER"],
  BOUNTY_ON_LEDGER: ["CLAIM_REQUESTED", "CANCELLED"],
  CLAIM_REQUESTED: ["CLAIMED", "BOUNTY_ON_LEDGER"],
  CLAIMED: ["PR_SUBMITTED"],
  PR_SUBMITTED: ["VERIFIED", "CLAIMED"],
  VERIFIED: ["SETTLED"],
  SETTLED: [],
  CANCELLED: []
});

export function canTransition(from, to) {
  return Boolean(transitions[from]?.includes(to));
}

export function assertTransition(from, to) {
  if (!bountyStates.includes(from)) throw new Error(`unknown state: ${from}`);
  if (!bountyStates.includes(to)) throw new Error(`unknown state: ${to}`);
  if (!canTransition(from, to)) throw new Error(`invalid transition: ${from} -> ${to}`);
}

export function assertDistinctParties({ maintainer, contributor, verifier }) {
  const parties = [maintainer, contributor, verifier].map(value => String(value || "").trim());
  if (parties.some(value => !value)) throw new Error("maintainer, contributor and verifier parties are required");
  if (new Set(parties).size !== 3) throw new Error("maintainer, contributor and verifier must be distinct Canton parties");
  return { maintainer: parties[0], contributor: parties[1], verifier: parties[2] };
}

export function normalizeRepository(value) {
  const normalized = String(value || "").trim();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(normalized)) {
    throw new Error("repository must be owner/name");
  }
  return normalized;
}

export function validateBountyDraft(input) {
  const repository = normalizeRepository(input.repository);
  const issueNumber = Number(input.issueNumber);
  const rewardAmount = Number(input.rewardAmount);
  const title = String(input.title || "").trim();
  const issueUrl = String(input.issueUrl || "").trim();

  if (!Number.isInteger(issueNumber) || issueNumber <= 0) throw new Error("issueNumber must be a positive integer");
  if (!Number.isFinite(rewardAmount) || rewardAmount <= 0) throw new Error("rewardAmount must be positive");
  if (!title || title.length > 180) throw new Error("title is required and must be <= 180 characters");
  if (!/^https:\/\/github\.com\//i.test(issueUrl)) throw new Error("issueUrl must be a github.com URL");

  return {
    bountyId: String(input.bountyId || `bounty-${repository.replace("/", "-")}-${issueNumber}`),
    repository,
    issueNumber,
    issueUrl,
    title,
    rewardAmount: rewardAmount.toFixed(1),
    rewardUnit: String(input.rewardUnit || "DEMO_CREDIT")
  };
}
