# CommitLedger — Colosseum Crypto World's Fair Final Package

_Last updated: 2026-10-07._

This is the canonical paste-ready submission package. Replace only fields explicitly marked **MANUAL** with truthful account/profile/video information.

## Product name

**CommitLedger**

## One-line pitch

**CommitLedger turns independently verified GitHub work into role-authorized settlement and a replay-resistant audit receipt on Canton.**

## Short product description

Open-source bounty and contributor programs can prove that work merged, but they still rely on manual trust to decide who may verify the work, who may authorize settlement, and whether the same contribution has already been settled.

CommitLedger separates evidence from authority. GitHub is the canonical source of the work event. A verifier binds the exact issue, pull request, branch and merge evidence. Daml defines which party may advance each state. Canton records the authorized workflow and final `SettlementReceipt`, while consumed contracts block duplicate settlement.

## Problem

Contributor settlement is fragmented across GitHub, spreadsheets, chat approvals and treasury tools. A merged pull request proves a repository event, but it does not prove:
- that the work matches the intended bounty;
- that the approver is authorized;
- that the verifier is independent from the contributor;
- that settlement cannot be replayed;
- that the final decision has a durable audit record.

## Solution

CommitLedger implements:

`Issue -> Bounty -> Claim -> Pull Request -> Merge Verification -> Settlement -> SettlementReceipt`

Three distinct roles are explicit:
- **Maintainer / Foundation:** creates, accepts and settles;
- **Contributor:** claims and submits work;
- **Independent Verifier:** attests canonical GitHub merge evidence.

## Why blockchain / why Canton

The ledger is not cosmetic storage.

Without Canton/Daml, the application server could unilaterally move workflow state. With CommitLedger:
- Daml controls allowed state transitions;
- party authorization is explicit;
- contract consumption prevents settlement replay;
- contract/update identifiers make state transitions inspectable;
- the final receipt is bound to verified external evidence.

GitHub proves the work event. Daml defines who may act. Canton records the authorized settlement proof.

## Technology

- Canton / Canton JSON Ledger API
- Daml
- GitHub API
- Node.js 22
- browser judge UI
- Render for the public read-only proof service

## Current verified technical proof

Canonical provider-verified source commit:

`d582f3a008a5d0eb658b1c4bb0a4dd5007de6705`

Connected Render evidence on 2026-10-07 confirms:
- deployment status: **live**;
- Node tests: **88/88 PASS**;
- DPM SDK 3.5.12 installed;
- Daml tests: PASS;
- fresh Canton proof completed;
- six-step workflow completed;
- final `SettlementReceipt` captured;
- unauthorized-settlement rejection captured;
- duplicate/replay-settlement rejection captured;
- build ended with `SUCCESS: VERIFIED EVIDENCE`.

Public judge proof:
https://commitledger-proof-final.onrender.com

Proof JSON:
https://commitledger-proof-final.onrender.com/api/proof

## Real external evidence fixture

- Repository: `Saidur-droid/MergeEarn`
- Issue: `#69`
- Merged pull request: `#73`

This is a technical evidence fixture, not a traction claim.

## Target customer

Initial ICP:
- crypto foundations;
- open-source foundations;
- protocol teams;
- ecosystem/grant programs;
- developer-relations teams that pay contributors for GitHub work.

## Market wedge

Start with one concrete workflow: **verified contributor bounties**.

The product does not need to replace GitHub or become a generalized freelancing marketplace. It sits between the work event and authorized settlement.

Expansion paths:
- grant milestones;
- contributor programs;
- audit/compliance workflows;
- organization policy;
- treasury/payment adapters after workflow validation.

## Business model hypothesis

A production version can monetize through:
- per-settlement fees;
- organization subscriptions for workflow/policy/audit controls;
- enterprise integration fees for treasury and payment rails.

**No current revenue claim is made.**

## Go-to-market

1. Recruit maintainers/foundations already paying contributors through GitHub-based programs.
2. Pilot with one repository and a small bounty campaign.
3. Use verified settlement receipts as the audit artifact.
4. Expand to organization-level policy, analytics and contributor operations.
5. Add production settlement adapters only after workflow demand is validated.

## Demand validation

Current evidence is **technical validation, not commercial traction**.

Before submission, add only real external validation. Preferred minimum:
- 3–5 maintainer/open-source operator conversations;
- question: “Would you use this?”
- question: “Where does settlement break today?”
- question: “What would make you pilot it?”

If no interviews are completed before submission, state clearly:

> “We have validated the technical workflow but have not yet claimed customer traction. Our next validation step is a small maintainer-led bounty pilot.”

Do not invent users, pilots, revenue, logos or testimonials.

## Pre-existing work disclosure

CommitLedger includes work that predates the Crypto World's Fair contest window.

The submission must not imply the entire project was created during the event. The repository history should be used to describe truthfully what was built or improved during the eligible period.

Suggested wording:

> “CommitLedger builds on pre-existing product work. During the competition period we continued product hardening, proof automation, judge-facing evidence packaging, competition-specific business framing and submission preparation. Git history is available for review.”

Adjust only if the final Git history supports a more precise statement.

## Founder + market fit

**MANUAL — add truthful founder background.**

Recommended structure:
- what you have built before;
- why developer/open-source workflows are familiar to you;
- why you can execute this product;
- why this problem matters to you.

Do not invent credentials.

## Team location

**MANUAL — enter the exact location required by the Colosseum profile/project form.**

## Repository

https://github.com/Saidur-droid/CommitLedger

Repository is currently private. Before final submission:
- make it public if desired and safe; **or**
- grant the organizer the required private-repository review access.

## Presentation video

Use:
`docs/COLOSSEUM_PITCH_SCRIPT.md`

Target: 2–3 minutes.

**MANUAL — record, upload and paste final video URL.**

## Technical demo video

Use:
`docs/COLOSSEUM_DEMO_SCRIPT.md`

Target: <=3 minutes.

Must show:
1. real GitHub evidence;
2. six-step workflow;
3. SettlementReceipt;
4. unauthorized settlement rejection;
5. duplicate/replay rejection;
6. why Canton is required.

**MANUAL — record, upload and paste final video URL.**

## Product graphic / logo

**MANUAL — upload an original CommitLedger graphic/logo.**

Recommended graphic concept:
“GitHub work evidence -> verified authorization -> Canton receipt”, with the three roles visible.

## Final links checklist

- Repository: https://github.com/Saidur-droid/CommitLedger
- Live proof: https://commitledger-proof-final.onrender.com
- Proof JSON: https://commitledger-proof-final.onrender.com/api/proof
- Presentation video: **MANUAL**
- Demo video: **MANUAL**
- Colosseum project URL: **MANUAL**
- Submission confirmation: **MANUAL**

## Final truth gate

Do not press Submit until:
- account/team/project registration is confirmed;
- founder/location fields are accurate;
- repository review access is confirmed;
- video links work;
- graphic is uploaded;
- any demand-validation claim is real;
- pre-existing work is disclosed;
- final portal preview contains no unsupported claim.

After successful submission, preserve the confirmation/receipt and record the exact submitted commit.
