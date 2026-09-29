# Evidence Manifest

Evidence is accepted only when it is tied to the exact source commit and, for runtime artifacts, one coherent run ID.

## Established source / test evidence

- Real GitHub issue #5.
- Real merged GitHub pull request #6.
- PR #6 references issue #5 without closing it, enabling reproducible bounty-source verification.
- Daml role-separated settlement lifecycle source.
- Canonical GitHub verifier with repository-qualified issue binding, merge commit SHA validation and target-branch reachability checks.
- Structured ledger rejection classifier that excludes infrastructure/auth/throttling failures from security proof.
- Competition-readiness engine with PASS / BLOCKED / FAIL semantics and mixed-run/source-commit rejection.
- Track 1 business brief, pilot plan, AI disclosure and hackathon-period work disclosure.
- Web judge UI exposes official judging criteria and fail-closed readiness state.
- Figma desktop/mobile judge-flow design.
- Linear evidence tracker with compliance/runtime/UX/submission milestones.

Historical executed test evidence:
- original Node suite: 16/16;
- expanded Node suite on commit `202693cbc10d835166fe3bf6240fa56e529ff1cd`: 65/65;
- readiness evaluator isolated TDD fixture: 4/4;
- judge-UI isolated TDD fixture: 3/3.

The newest branch head still requires one clean full `npm test` run.

## Runtime evidence required before product-ready

All items below must be generated from one current source commit/run:

- Node full-suite log.
- DPM 3.5.12 installation/version evidence.
- Daml compiler/build log.
- Daml Script test log.
- DAR/package identifier.
- Canton runtime/environment identifier.
- Distinct Maintainer / Contributor / Verifier parties.
- Real contract and update identifiers for the lifecycle.
- Final active `SettlementReceipt`.
- Canonical merge commit SHA and evidence hash in that receipt.
- Specific Daml/Canton rejection for wrong evidence.
- Specific authorization rejection for unauthorized settlement.
- Specific inactive/not-found rejection for duplicate settlement.
- Proof JSON containing run ID and source commit.
- Browser desktop/mobile QA against the real running app.
- Final recorded demo based on the retained proof.

A timeout, connection error, HTTP 401/403, rate limit, parser error, CI runner failure, mocked transport or static screenshot is not runtime security evidence.

## Competition submission evidence required later

The owner intentionally deferred these final-phase actions:
- public repository;
- public demo/video/pitch/project page;
- logged-out/private-window link verification;
- AppsFactory 1,000 Mana;
- required ≥10 activity days;
- non-empty journal;
- complete project profile;
- eligibility/team confirmation;
- final portal submission receipt.

## GitHub Actions note

Workflow run `36580546442` for head `3c420168453ac68f9dd1bde57e63106e29aaaeb9` failed with zero recorded steps and no allocated runner (`runner_id: 0`) in all three jobs. It produced no application test/runtime evidence and must not be treated as a code-test result.

## Integrity rule

Missing evidence remains BLOCKED. Never replace it with fabricated transaction IDs, fake users, fake adoption, fake security rejections, or inferred runtime success.
