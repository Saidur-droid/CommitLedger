# CommitLedger Competition-Ready Delivery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a HackCanton Season 3 Track 1-ready CommitLedger build with evidence-backed compliance automation, real Canton proof, judge-facing UX, and complete business/pitch materials while deferring repository visibility and final portal submission.

**Architecture:** Keep the existing GitHub verifier -> Daml lifecycle -> Canton JSON Ledger API architecture. Add a fail-closed competition readiness model, evidence manifests, Track 1 business artifacts, runtime proof automation, and a judge-facing proof dashboard. External account/publication gates remain BLOCKED rather than being faked green.

**Tech Stack:** Node.js 22, Daml/DPM 3.5.12, Canton JSON Ledger API v2, vanilla web UI, GitHub Actions, Figma, Linear.

**Spec:** `docs/superpowers/specs/2026-09-29-hackcanton-s3-competition-ready-design.md`

## Global Constraints

- Target exactly one competition track: Track 1 — Real-World Assets (RWA) & Business Workflows.
- Submission deadline: 2026-10-09 23:59 UTC.
- Meaningful Canton integration must be demonstrated by a real runtime, not mocked transport.
- Final video must be no longer than 5 minutes.
- Public repository/public links, Mana/activity, journal, and project-profile gates are deferred external blockers; automation must report them as BLOCKED until verified.
- Never claim MainNet, Canton Coin/fiat settlement, production custody, users, traction, or metrics without evidence.
- DEMO_CREDIT is non-production test value.
- AI assistance must be disclosed in submission materials.
- Work before 2026-09-18 must be disclosed as pre-existing; judges evaluate hackathon-period work.

## Review Focus

- A missing external/account gate must never become PASS.
- A network/auth/rate-limit error must never count as a Daml security rejection.
- Evidence from different source commits/runs must never be combined into one green readiness result.
- UI must never render sample identifiers as if they were real runtime proof.
- Track 1 business claims must stay evidence-based and avoid invented validation.

---

### Task 1: Competition readiness engine

**Files:**
- Create: `src/competition-readiness.mjs`
- Create: `tests/competition-readiness.test.mjs`
- Create: `scripts/check-competition-readiness.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `evaluateCompetitionReadiness(input) -> { status, gates, counts }`
- Produces CLI JSON/Markdown summary from evidence + external-gate input.

- [ ] Write failing tests for PASS/BLOCKED/FAIL semantics and mixed-run rejection.
- [ ] Run targeted test and verify RED.
- [ ] Implement the minimal readiness evaluator.
- [ ] Add CLI wrapper and package script.
- [ ] Run targeted test and full `npm test`.
- [ ] Commit.

### Task 2: Track 1 business and submission package

**Files:**
- Create: `docs/TRACK1_BUSINESS_BRIEF.md`
- Create: `docs/PILOT_PLAN.md`
- Create: `docs/AI_DISCLOSURE.md`
- Create: `docs/HACKATHON_WORK_DISCLOSURE.md`
- Modify: `docs/SUBMISSION_DRAFT.md`
- Modify: `docs/FINAL_CHECKLIST.md`

**Interfaces:**
- Consumes official rules/spec.
- Produces judge-ready factual copy with no fabricated traction.

- [ ] Draft Track 1 one-page business brief.
- [ ] Draft 2–3 step pilot plan.
- [ ] Add explicit AI and pre-existing-work disclosures.
- [ ] Align submission draft/checklist to official S3 gates.
- [ ] Repository content review for unsupported claims.
- [ ] Commit.

### Task 3: Real Canton proof on connected development machine

**Files:**
- Modify as required: `scripts/bootstrap-dpm.sh`, `scripts/run-local-proof.sh`, `scripts/verify-all.sh`, runtime code/tests.
- Evidence output: `evidence/*` (ignored except placeholders).

**Interfaces:**
- Produces one coherent evidence bundle from a single source commit/run.
- Consumed by Task 1 readiness engine and judge UI.

- [ ] Verify machine prerequisites and install pinned DPM 3.5.12.
- [ ] Run full Node suite.
- [ ] Run Daml build/test.
- [ ] Start fresh Canton sandbox and deploy DAR.
- [ ] Execute GitHub -> Canton lifecycle through SettlementReceipt.
- [ ] Capture wrong-evidence, unauthorized-settlement, duplicate-settlement rejections.
- [ ] Validate evidence bundle and source-commit consistency.
- [ ] If a code/script defect appears, reproduce with a failing test before fixing.
- [ ] Commit any fixes; never commit generated secrets/evidence.

### Task 4: Judge proof dashboard and compliance view

**Files:**
- Modify: `web/index.html`
- Modify: `web/app.js`
- Modify: `web/styles.css`
- Add/modify UI tests as supported by existing test approach.

**Interfaces:**
- Consumes runtime proof and readiness summary.
- Produces 60–90 second judge flow and explicit six-criteria evidence view.

- [ ] Add failing tests for readiness rendering/no fake PASS where feasible.
- [ ] Implement Value / ICP / Validation / GTM / MVP / Pitch evidence section.
- [ ] Add Track 1 badge/business workflow mapping.
- [ ] Add readiness PASS/BLOCKED/FAIL panel.
- [ ] Preserve full IDs/copy/export/rejection details.
- [ ] Run tests and browser smoke/mobile QA on connected machine.
- [ ] Commit.

### Task 5: Figma judge-flow design

**Files:** Figma design file; no repo code until design is approved against implemented constraints.

**Interfaces:**
- Consumes implemented judge-flow information architecture.
- Produces editable desktop/mobile judge UI reference.

- [ ] Create Figma file.
- [ ] Build tokens/components matching existing web implementation.
- [ ] Design hero, lifecycle, proof timeline, security rejection, readiness, business evidence, receipt views.
- [ ] Include desktop and mobile frames.
- [ ] Verify no visual state implies fabricated runtime success.

### Task 6: Linear competition delivery system

**Files:** Linear project/issues.

**Interfaces:**
- Consumes official requirements and evidence gates.
- Produces persistent delivery tracker with Verified vs Blocked distinction.

- [ ] Create `CommitLedger — HackCanton S3 Delivery` project.
- [ ] Create milestones for Compliance, Runtime Proof, Judge UX, Submission Package.
- [ ] Create issues for each mandatory rule/evidence gate.
- [ ] Link PR #8/spec where supported.
- [ ] Set deadline/target date before 2026-10-09.
- [ ] Keep publication/Mana/profile items BLOCKED until user completes external actions.

### Task 7: Final evidence review

**Files:**
- Modify: `docs/DELIVERY_STATUS.md`
- Modify: `docs/EVIDENCE_MANIFEST.md`
- Modify: `README.md` as needed.

**Interfaces:**
- Consumes all prior task evidence.
- Produces truthful final pre-publication status.

- [ ] Run full Node suite.
- [ ] Run Daml tests/runtime proof if environment remains available.
- [ ] Run competition readiness checker.
- [ ] Verify browser/mobile judge flow.
- [ ] Review repo for secrets and unsupported claims.
- [ ] Update status docs with exact evidence.
- [ ] Keep PR draft until all implementation gates are green; do not make repo public or submit without explicit final-phase instruction.
