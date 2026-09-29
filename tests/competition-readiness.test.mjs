import test from "node:test";
import assert from "node:assert/strict";
import { evaluateCompetitionReadiness } from "../src/competition-readiness.mjs";

const verifiedImplementation = {
  nodeTests: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  damlBuild: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  damlTests: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  cantonLifecycle: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  negativeSecurity: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  judgeUi: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
  track1Package: { status: "verified", runId: "run-1", sourceCommit: "abc123" },
};
const verifiedExternal = {
  publicRepository: { status: "verified" },
  publicArtifacts: { status: "verified" },
  mana1000: { status: "verified" },
  activity10Days: { status: "verified" },
  journalNonEmpty: { status: "verified" },
  projectProfileComplete: { status: "verified" },
  track1Selected: { status: "verified" },
};

test("returns PASS only when implementation and external gates are verified", () => {
  const result = evaluateCompetitionReadiness({ implementation: verifiedImplementation, external: verifiedExternal });
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.counts, { pass: 14, blocked: 0, fail: 0 });
});

test("returns BLOCKED when an external gate is not yet verified", () => {
  const result = evaluateCompetitionReadiness({
    implementation: verifiedImplementation,
    external: { ...verifiedExternal, mana1000: { status: "blocked", reason: "AppsFactory account not checked" } },
  });
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.gates.find(g => g.name === "mana1000").status, "BLOCKED");
});

test("returns FAIL when an implementation gate fails even if external gates are blocked", () => {
  const result = evaluateCompetitionReadiness({
    implementation: { ...verifiedImplementation, damlTests: { status: "failed", reason: "Daml test failed" } },
    external: { ...verifiedExternal, publicRepository: { status: "blocked" } },
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
