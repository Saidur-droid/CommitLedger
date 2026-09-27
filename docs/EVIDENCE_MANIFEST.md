# Evidence Manifest

## Already created

- Real GitHub issue #1.
- Real GitHub pull request #2.
- PR #2 merged through GitHub.
- Daml contract source implementing the full authorization lifecycle.
- Daml negative-test source for unauthorized verification, bad evidence, unauthorized settlement and replay.
- Canonical GitHub API verifier with SHA-256 evidence hashing.
- Zero-dependency Node tests.
- Canton JSON Ledger API adapter and demo command.
- Local judge-facing web application.
- Competition compliance and winning-standard gates.

## Runtime evidence still required before final submission

These cannot be truthfully marked complete until executed against a Canton/Daml runtime:

- Daml compiler/build success.
- Daml Script test success.
- Canton LocalNet package deployment.
- Real JSON Ledger API contract creation.
- End-to-end state transitions through `SettlementReceipt`.
- Captured ledger update / contract identifiers.
- Recorded demo video based on the verified runtime.

## Integrity note

A missing runtime proof is a build task, not something to hide with screenshots, mock transaction IDs, fabricated users, or fake adoption.
