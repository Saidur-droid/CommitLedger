const IMPLEMENTATION_GATES = [
  "nodeTests",
  "damlBuild",
  "damlTests",
  "cantonLifecycle",
  "negativeSecurity",
  "judgeUi",
  "track1Package",
];

const EXTERNAL_GATES = [
  "publicRepository",
  "publicArtifacts",
  "mana1000",
  "activity10Days",
  "journalNonEmpty",
  "projectProfileComplete",
  "track1Selected",
];

function normalizeStatus(value, kind) {
  const raw = String(value?.status || "").toLowerCase();
  if (raw === "verified" || raw === "pass") return "PASS";
  if (raw === "failed" || raw === "fail") return "FAIL";
  if (raw === "blocked" || raw === "pending" || raw === "unknown" || raw === "") return "BLOCKED";
  return kind === "implementation" ? "FAIL" : "BLOCKED";
}

function gateRecord(name, value, kind) {
  return {
    name,
    kind,
    status: normalizeStatus(value, kind),
    reason: value?.reason || "",
    runId: value?.runId || "",
    sourceCommit: value?.sourceCommit || "",
  };
}

function coherenceGate(implementation) {
  const verifiedRuntime = IMPLEMENTATION_GATES
    .map(name => [name, implementation?.[name]])
    .filter(([, value]) => normalizeStatus(value, "implementation") === "PASS")
    .filter(([, value]) => value?.runId || value?.sourceCommit);

  if (verifiedRuntime.length === 0) return null;

  const runIds = new Set(verifiedRuntime.map(([, value]) => value?.runId).filter(Boolean));
  const sourceCommits = new Set(verifiedRuntime.map(([, value]) => value?.sourceCommit).filter(Boolean));
  if (runIds.size <= 1 && sourceCommits.size <= 1) return null;

  return {
    name: "evidenceCoherence",
    kind: "implementation",
    status: "FAIL",
    reason: "Verified implementation evidence must come from one coherent run and source commit.",
    runId: "",
    sourceCommit: "",
  };
}

export function evaluateCompetitionReadiness({ implementation = {}, external = {} } = {}) {
  const gates = [
    ...IMPLEMENTATION_GATES.map(name => gateRecord(name, implementation[name], "implementation")),
    ...EXTERNAL_GATES.map(name => gateRecord(name, external[name], "external")),
  ];

  const coherence = coherenceGate(implementation);
  if (coherence) gates.push(coherence);

  const counts = gates.reduce((acc, gate) => {
    if (gate.status === "PASS") acc.pass += 1;
    else if (gate.status === "FAIL") acc.fail += 1;
    else acc.blocked += 1;
    return acc;
  }, { pass: 0, blocked: 0, fail: 0 });

  const status = counts.fail > 0 ? "FAIL" : counts.blocked > 0 ? "BLOCKED" : "PASS";
  return { status, gates, counts };
}

export const competitionGateNames = Object.freeze({
  implementation: [...IMPLEMENTATION_GATES],
  external: [...EXTERNAL_GATES],
});
