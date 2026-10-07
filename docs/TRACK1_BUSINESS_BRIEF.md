# Track 1 Business Brief — CommitLedger

## Problem
Open-source maintainers and bounty programs can verify code changes on GitHub, but GitHub does not by itself enforce who is allowed to approve a bounty settlement, nor does it provide a multi-party settlement state machine.

## ICP
Primary users:
- open-source maintainers running issue-based bounties;
- foundations and ecosystem grant programs;
- organizations paying contributors for verified repository work.

## Use case
A maintainer creates a bounty tied to a canonical GitHub issue. A contributor claims it and submits a pull request. A verifier independently checks the canonical merged PR evidence. Only then can the maintainer settle. Canton records the authorized state transition and final receipt.

## Who pays
The likely economic buyer is the organization operating the bounty or contributor program: a foundation, protocol, open-source company, ecosystem fund, or enterprise engineering organization.

No customer revenue or paid pilot is claimed yet.

## Why Canton
CommitLedger uses Canton/Daml for the part GitHub cannot provide:
- explicit multi-party authorization;
- stateful workflow transitions;
- privacy-compatible role separation;
- consumed-contract semantics that prevent replay of the same verified settlement;
- auditable ledger identifiers and receipt state.

GitHub remains the source of truth for repository events; Canton is the source of truth for the authorized settlement workflow.

## Track 1 mapping
Track 1 asks for an end-to-end business workflow with state changes, fulfillment, role-based UI, and audit/reporting.

CommitLedger maps as:
1. Create — Bounty from a canonical GitHub issue.
2. Update — Claim and PR submission.
3. Fulfill — Independent merge verification.
4. Audit/report — SettlementReceipt with bound evidence.

## Validation available today
Only evidence that actually exists is used:
- a real GitHub issue/merged-PR fixture in the repository;
- Node tests for canonical verification and failure classification;
- Daml contract tests when executed;
- real Canton runtime evidence only after captured from a successful run.

No fabricated users, revenue, production transfers, wallet counts, or traction metrics are claimed.
