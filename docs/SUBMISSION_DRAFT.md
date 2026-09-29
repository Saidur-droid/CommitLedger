# CommitLedger — HackCanton Season 3 Submission Draft

**Status: draft. Do not submit until `docs/FINAL_CHECKLIST.md` has no critical implementation failures and all external account/publication gates are verified.**

## Track
**Track 1 — Real-World Assets (RWA) & Business Workflows**

## One-line description
CommitLedger turns verified GitHub contribution work into an authorization-controlled Canton settlement workflow with an auditable receipt.

## Problem
GitHub can prove that an issue exists and a pull request merged, but it does not by itself enforce which party may verify a bounty claim or which party may settle it.

## Solution
CommitLedger binds a real GitHub issue and merged pull request to a Daml state machine:

Issue → Bounty → Claim → Pull Request → Merge Verification → Settlement → SettlementReceipt.

The backend independently validates repository identity, issue binding, contributor policy, base branch, merged state, head SHA, merge commit SHA, and merge evidence before the ledger workflow advances.

## Why Canton
Canton/Daml is used for meaningful workflow state and authorization: distinct maintainer, contributor, and verifier roles; authorized contract choices; inspectable update/contract identifiers; and consumed-contract replay protection. GitHub remains the external evidence source.

## Target users / ICP
Open-source maintainers, foundations, ecosystem grant programs, and organizations operating contributor bounty workflows.

## GTM
1. prove the workflow in one repository;
2. pilot with one foundation/ecosystem bounty operator;
3. after validation, expand repository support and integrate an approved settlement adapter.

No paid pilot or customer traction is claimed today.

## Validation / evidence
Use only evidence captured for the exact submission commit:
- real GitHub issue and merged PR fixture;
- green Node test suite;
- green Daml build/script tests;
- real Canton lifecycle to SettlementReceipt;
- exact negative rejection evidence;
- browser-accessible judge flow and exported proof.

Transport mocks are never described as live Canton evidence.

## Demo and pitch
The final recorded demo must be **5 minutes or less** and show:
1. problem and roles;
2. real GitHub issue/PR evidence;
3. authorized Canton lifecycle;
4. wrong-evidence / unauthorized / replay rejection;
5. final receipt and why Canton is necessary;
6. Track 1 business use and pilot path.

## Integrity
DEMO_CREDIT is non-production test value. CommitLedger does not claim fiat/Canton Coin transfer, MainNet operation, production custody, real users, revenue, or organizer endorsement without evidence.

## AI disclosure
AI-assisted tools were used for research, planning, code review, tests, documentation, and implementation support. The team remains responsible for every submitted artifact and claim.

## Hackathon-period disclosure
Any pre-existing code must be disclosed. Only work completed during the official delivery phase (2026-09-18 through 2026-10-09) should be presented to judges as hackathon-period work.

## Final links
Populate only when public and verified:
- Repository:
- Live/demo page:
- Demo video:
- Pitch:
- Evidence bundle:
