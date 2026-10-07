import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCompetitionReadiness, competitionGateNames } from "../src/competition-readiness.mjs";

const verifiedImplementation = {
  nodeTests: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  damlBuild: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  damlTests: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  cantonLifecycle: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  negativeSecurity: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  judgeUi: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  colosseumPackage: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
};
const verifiedExternal = {
  repositoryAccess: { status: "verified" },
  presentationVideo: { status: "verified" },
  technicalDemoVideo: { status: "verified" },
  projectProfileComplete: { status: "verified" },
  founderProfileComplete: { status: "verified" },
  preExistingWorkDisclosure: { status: "verified" },
  demandValidationDisclosure: { status: "verified" },
};

test("uses Colosseum-specific implementation and submission gates", () => {
  assert.deepEqual(competitionGateNames.implementation, [
    "nodeTests","damlBuild","damlTests","cantonLifecycle","negativeSecurity","judgeUi","colosseumPackage"
  ]);
  assert.deepEqual(competitionGateNames.external, [
    "repositoryAccess","presentationVideo","technicalDemoVideo","projectProfileComplete",
    "founderProfileComplete","preExistingWorkDisclosure","demandValidationDisclosure"
  ]);
});

test("returns PASS only when implementation and external gates are verified", () => {
  const result = evaluateCompetitionReadiness({ implementation: verifiedImplementation, external: verifiedExternal });
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.counts, { pass: 14, blocked: 0, fail: 0 });
});

test("returns BLOCKED when a submission-side gate is not yet verified", () => {
  const result = evaluateCompetitionReadiness({
    implementation: verifiedImplementation,
    external: { ...verifiedExternal, repositoryAccess: { status: "blocked", reason: "Judge repository access not yet confirmed" } },
  });
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.gates.find(g => g.name === "repositoryAccess").status, "BLOCKED");
});

test("returns FAIL when an implementation gate fails even if submission gates are blocked", () => {
  const result = evaluateCompetitionReadiness({
    implementation: { ...verifiedImplementation, damlTests: { status: "failed", reason: "Daml test failed" } },
    external: { ...verifiedExternal, repositoryAccess: { status: "blocked" } },
  });
  assert.equal(result.status, "FAIL");
  assert.ok(result.counts.fail >= 1);
});

test("rejects evidence mixed across runtime run IDs or source commits", () => {
  const result = evaluateCompetitionReadiness({
    implementation: {
      ...verifiedImplementation,
      cantonLifecycle: { status: "verified", runId: "run-2", sourceCommit: "def456" },
    },
    external: verifiedExternal,
  });
  assert.equal(result.status, "FAIL");
  assert.equal(result.gates.find(g => g.name === "evidenceCoherence").status, "FAIL");
});
