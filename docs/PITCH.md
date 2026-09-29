# HackCanton Season 3 — CommitLedger Pitch

## 15-second version

CommitLedger turns a verified GitHub contribution into an authorization-controlled Canton settlement receipt. GitHub proves the work event; Daml controls who may advance and settle the workflow; Canton preserves the auditable state and replay-safe receipt.

## Problem

Open-source bounty workflows often stop at "the PR merged." That proves a code event, but not an auditable multi-party settlement process with explicit authority over verification and settlement.

## Product

CommitLedger binds:
`Issue → Bounty → Claim → Pull Request → Verification → SettlementReceipt`.

Three explicit roles participate:
- Maintainer;
- Contributor;
- Verifier.

The backend independently checks canonical GitHub evidence before settlement state can advance.

## Why Canton

Without Canton/Daml, this product loses its core:
- explicit party authorization;
- stateful contractual transitions;
- consumed-contract replay protection;
- inspectable contract/update identifiers;
- final receipt bound to external evidence.

GitHub remains the source of truth for repository events. Canton is the source of truth for authorized settlement workflow state.

## Track 1 business case

Primary ICP:
- open-source maintainers;
- foundations;
- ecosystem bounty programs;
- organizations paying external contributors.

Likely buyer:
the organization operating the contributor/bounty program.

Pilot:
1. one repository and maintainer;
2. one foundation/ecosystem campaign;
3. after validation, add an approved production settlement adapter.

No paid customer, revenue, production transfer or adoption claim is made today.

## Validation

Use only executed evidence:
- real GitHub issue and merged PR fixture;
- full Node test result for the submission commit;
- Daml build and script tests;
- real Canton lifecycle;
- wrong-evidence, unauthorized-settlement and replay rejection;
- exported receipt/proof JSON.

## Close

CommitLedger is not "blockchain attached to GitHub." It separates evidence from authority: GitHub proves what happened, the verifier attests the canonical evidence, and Canton/Daml controls what each party is allowed to do next.
