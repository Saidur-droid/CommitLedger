function required(value, name) {
  if (value === undefined || value === null || value === "") throw new Error(`${name} is required`);
  return value;
}

export function buildEvidencePassport(proof) {
  if (!proof || typeof proof !== "object") throw new Error("proof is required");
  if (!Array.isArray(proof.steps) || proof.steps.length !== 6) throw new Error("complete six-step proof is required");
  if (!Array.isArray(proof.negativeChecks) || proof.negativeChecks.length !== 3) throw new Error("three negative checks are required");
  const receipt = required(proof.settlementReceipt, "settlementReceipt");
  const settled = proof.steps.find(step => step.name === "SETTLED") || proof.steps.at(-1);
  required(settled?.contractId, "settlement receipt contractId");
  required(settled?.updateId, "settlement updateId");

  return {
    schemaVersion: 1,
    product: "CommitLedger",
    runId: required(proof.runId, "runId"),
    generatedAt: required(proof.generatedAt, "generatedAt"),
    sourceCommit: required(proof.sourceCommit, "sourceCommit"),
    environment: required(proof.environment, "environment"),
    workEvidence: {
      repository: required(receipt.repository, "receipt.repository"),
      issueNumber: required(receipt.issueNumber, "receipt.issueNumber"),
      pullRequestNumber: required(receipt.pullRequest?.prNumber, "receipt.pullRequest.prNumber"),
      mergeCommitSha: required(receipt.mergeCommitSha, "receipt.mergeCommitSha"),
      evidenceHash: required(receipt.evidenceHash, "receipt.evidenceHash")
    },
    authorization: {
      maintainer: required(proof.parties?.maintainer, "parties.maintainer"),
      contributor: required(proof.parties?.contributor, "parties.contributor"),
      verifier: required(proof.parties?.verifier, "parties.verifier"),
      model: "Maintainer / Contributor / Verifier"
    },
    settlement: {
      rewardAmount: receipt.rewardAmount,
      rewardUnit: receipt.rewardUnit,
      settlementRef: receipt.settlementRef || "",
      receiptContractId: settled.contractId,
      updateId: settled.updateId,
      completionOffset: settled.completionOffset,
      packageId: required(proof.packageId, "packageId")
    },
    security: {
      checks: proof.negativeChecks.map(check => ({
        name: required(check.name, "negative check name"),
        code: required(check.code, "negative check code")
      }))
    },
    integrity: {
      sourceBound: true,
      realMoney: false,
      statement: "DEMO_CREDIT is non-production test value. This passport summarizes executed evidence; it is not a payment receipt."
    }
  };
}
