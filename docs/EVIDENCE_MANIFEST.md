# Evidence Manifest

## Already created

- Real open GitHub issue #5.
- Real merged GitHub pull request #6.
- PR #6 references issue #5 without closing it, enabling reproducible bounty-source verification.
- Daml contract source implementing the role-separated authorization lifecycle.
- Daml revision/resubmission path.
- Daml negative-test source for unauthorized verification, bad merge evidence, wrong issue binding, unauthorized settlement, and replay.
- Canonical GitHub verifier with exact issue-reference validation.
- SHA-256 merge evidence that includes repository, issue, PR, URL, head SHA, base branch and merge timestamp.
- Zero-dependency Node domain / verifier / Canton command / orchestrator tests.
- Canton JSON Ledger API client with active-contract discovery.
- One-command full lifecycle orchestrator.
- Judge-facing web application with a real Canton proof timeline and final receipt view.
- Competition compliance and winning-standard gates.
- No paid hosting/API dependency.

## Runtime evidence still required before final submission

These cannot be truthfully marked complete until executed against a Canton/Daml runtime:

- Daml compiler/build success.
- Daml Script test success.
- Canton package deployment.
- Real JSON Ledger API contract creation.
- End-to-end transitions through `SettlementReceipt`.
- Captured ledger update IDs / contract IDs.
- Captured authorization/replay failures.
- Recorded final demo video based on verified runtime.

## Integrity note

A missing runtime proof is a build task, not something to hide with screenshots, mock transaction IDs, fabricated users, or fake adoption.
