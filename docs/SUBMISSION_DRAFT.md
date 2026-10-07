# CommitLedger — Submission Master Draft

_Updated 7 October 2026._

Active targets:
1. HackCanton Season 3
2. Crypto World's Fair — Colosseum

## Shared one-line description

**CommitLedger turns verified contribution work into an authorization-controlled settlement workflow with an auditable receipt.**

## Shared problem

A code host can prove that an issue exists and a pull request merged, but that evidence alone does not define who is authorized to verify a claim, who may settle it, or how duplicate settlement is prevented.

## Shared solution

CommitLedger binds canonical contribution evidence to a role-authorized workflow:

`Issue -> Bounty -> Claim -> Pull Request -> Merge Verification -> Settlement -> SettlementReceipt`

The verifier checks repository identity, issue binding, contributor policy, base branch, merged state, head SHA, merge commit SHA and evidence integrity before settlement can advance.

## Technical differentiation

Canton/Daml provides:
- role-separated Maintainer, Contributor and Verifier authority;
- explicit allowed contract transitions;
- inspectable contract/update identifiers;
- consumed-contract replay protection;
- auditable SettlementReceipt generation.

GitHub remains the external work-evidence source.

## Verified evidence

Frozen proven technical commit:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Live proof:
https://commitledger-proof-final.onrender.com

Proof JSON:
https://commitledger-proof-final.onrender.com/api/proof

External evidence fixture:
- repo: `Saidur-droid/MergeEarn`;
- open issue: `#69`;
- merged PR: `#73`.

**MergeEarn is only the proof fixture. CommitLedger is the submitted product.**

## Integrity statement

`DEMO_CREDIT` is test value only.

Do not claim:
- fiat transfer;
- Canton Coin transfer;
- MainNet;
- production custody;
- customers/revenue/traction that do not exist;
- organizer endorsement.

AI-assisted tools were used for research, planning, code review, testing, documentation and implementation support. The participant remains responsible for all submitted claims and artifacts.

---

# HackCanton Season 3

## Suggested title

**CommitLedger — Verifiable GitHub Work to Canton Settlement**

## 15-second pitch

CommitLedger turns verified GitHub contribution evidence into a role-authorized Canton workflow and an auditable SettlementReceipt. GitHub proves the work event; Daml controls who may verify and settle it; Canton preserves replay-safe workflow state.

## Problem statement

Open-source and contributor bounty workflows often stop at “the PR merged.” That proves a repository event, but not who is authorized to approve settlement, whether the evidence is bound to the correct issue, or whether the same work can be settled twice.

## Solution

CommitLedger adds an authorization-controlled settlement state machine:
1. maintainer creates a bounty for a canonical issue;
2. contributor claims it;
3. contributor submits exact PR metadata;
4. verifier checks canonical merged-PR evidence;
5. maintainer settles only verified work;
6. Canton creates the final SettlementReceipt.

## Why Canton

Without Canton/Daml, CommitLedger loses:
- explicit party authorization;
- contractual state transitions;
- consumed-contract replay protection;
- inspectable update/contract IDs;
- the final auditable receipt.

## Track candidate

**Real-World Asset & Business Workflows** is the primary candidate because the product implements an end-to-end business workflow with role authorization and audit state. Confirm the exact portal option before selecting it.

## Demo evidence

Show:
- canonical GitHub issue + merged PR;
- Maintainer / Contributor / Verifier roles;
- six ledger transitions;
- SettlementReceipt;
- wrong-issue rejection;
- unauthorized settlement rejection;
- duplicate/replay rejection;
- exact source commit and proof bundle.

## Repository / proof

Repository: use the final judge-accessible CommitLedger repository URL.

Live proof:
https://commitledger-proof-final.onrender.com

Proof JSON:
https://commitledger-proof-final.onrender.com/api/proof

## Work-period disclosure

CommitLedger includes pre-existing repository history/scaffolding. The qualifying HackCanton delivery phase added and hardened the Canton/Daml workflow, GitHub evidence binding, runtime proof automation, negative security proof, judge UI and competition materials. Reconcile the final wording with Git history before submission.

---

# Crypto World's Fair — Colosseum

## Project name

**CommitLedger**

## Public brief description

CommitLedger is verifiable work-to-settlement infrastructure for open-source ecosystems and contributor programs. It binds canonical contribution evidence to role-authorized settlement state, blocks replay/duplicate settlement, and produces an auditable receipt.

## What are you building, and who is it for?

CommitLedger helps open-source maintainers, foundations, ecosystem programs and engineering organizations settle verified contributor work with explicit authorization and an audit trail. GitHub provides canonical issue/PR evidence. A verifier attests the evidence. Canton/Daml controls the allowed state transitions between maintainer, contributor and verifier and produces a replay-safe SettlementReceipt.

## Why build this now?

Contributor programs increasingly coordinate valuable work across public repositories, but the evidence, approval and settlement steps are fragmented across code hosts, spreadsheets, chats and payment tools. CommitLedger focuses on the control layer between “the work merged” and “the work is authorized for settlement,” making the decision inspectable, role-aware and resistant to duplicate settlement.

## Technology

- Daml / Canton for contractual workflow and authorization;
- Canton JSON Ledger API for ledger transitions and active-contract discovery;
- GitHub API for canonical issue and merged-PR evidence;
- Node.js backend/orchestration;
- browser judge UI;
- Render for the current read-only public proof service.

AI-assisted tooling was used for research, planning, review, tests, documentation and implementation support.

## Business model hypothesis

CommitLedger would be sold to organizations operating contributor, bounty or ecosystem programs. A practical model is a SaaS/platform fee for workflow, policy and audit controls, with enterprise pricing for organization-level access, integrations and compliance features. Production asset/payment adapters would be added only after workflow validation.

## Go-to-market

1. Start with one open-source repository and a small maintainer-led bounty pilot.
2. Expand to a foundation/ecosystem contributor campaign.
3. Add organization controls, monitoring and policy integrations.
4. Add approved production settlement adapters after validation.

## Demand validation

Current proof is technical, not commercial traction. The project has a real end-to-end GitHub/Canton evidence fixture and executed runtime/security proof. Do not invent user interviews, pilots, revenue, wallet counts or customer demand. Add real validation only if actually collected before submission.

## Pre-existing-work disclosure

CommitLedger existed before the Crypto World's Fair contest window. The submission must disclose that history. Do not present the entire codebase as newly created during the contest. Identify competition-window work from Git history and describe only what was actually completed between the official start and end dates.

## Presentation video

Use `docs/COLOSSEUM_PITCH_SCRIPT.md`.

## Product demo

Use `docs/COLOSSEUM_DEMO_SCRIPT.md`.

## Repository / links

Repository: final judge-accessible CommitLedger URL.

Live proof:
https://commitledger-proof-final.onrender.com

Proof JSON:
https://commitledger-proof-final.onrender.com/api/proof

## Final receipt fields

Populate after actual portal actions:
- HackCanton submission URL/receipt:
- Colosseum project URL:
- Colosseum submission confirmation:
- Presentation video:
- Demo video:
