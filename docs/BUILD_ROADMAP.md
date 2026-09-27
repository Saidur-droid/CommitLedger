# CommitLedger — Competition Build Roadmap

_Last updated: 2026-09-27_

## P0 — foundation

- [x] Product/repo name locked.
- [x] MergeEarn/Nimiq isolation locked.
- [x] No-paid-service constraint locked.
- [x] Competition compliance gate created.
- [x] Winning-quality standard created.
- [ ] Daml package scaffold.
- [ ] Core bounty lifecycle contracts.
- [ ] Contract authorization tests.
- [ ] Local Canton sandbox/dev setup.
- [ ] JSON Ledger API client.
- [ ] GitHub verification adapter.
- [ ] Minimal judge UI.

## P0 — contract model

Required state/evidence:
- bounty identity
- maintainer
- contributor/claim state
- repository + issue identity
- reward/test-asset representation
- linked PR identity
- verified merge evidence digest/reference
- settlement state
- immutable settlement receipt/reference

Required protections:
- maintainer-only creation/cancellation policy
- explicit contributor claim/accept flow
- verification gate before settlement
- unauthorized exercise rejection
- duplicate settlement prevention

## P0 — GitHub verifier

Verify server-side:
- repository full name
- issue number
- PR repository
- PR number
- expected base branch
- merged status
- merge commit SHA
- claimant/author policy where used

Never trust browser-provided merge state.

## P0 — Canton integration

Use current Canton 3.x/Daml tooling:
- dpm for build/test
- Daml contracts
- Canton sandbox/local development network
- JSON Ledger API V2 for create/exercise/read operations

No mocked Canton path in the final demo.

## P1 — judge proof

Create:
- deterministic seed/demo command
- one-command or minimal-command local run path
- proof view with GitHub + ledger evidence
- architecture diagram
- failure-case matrix
- threat/trust-boundary document
- demo script
- submission copy

## P1 — polish

- responsive UI
- clear human state names
- one primary action per screen
- clear test/demo asset labeling
- useful empty/error/retry states
- no crypto jargon unless it helps explain Canton

## Freeze rule

Once the complete P0 flow is reproducibly green, prioritize evidence and polish over adding features.
