# CommitLedger - submission draft

**Status: draft; do not submit until FINAL_CHECKLIST.md is complete.** Final portal fields and length limits must be confirmed by the registered participant.

## One-line description

CommitLedger binds verified GitHub work to a role-authorized bounty workflow and an auditable settlement receipt on Canton.

## Problem and approach

Open-source bounty participants need a consistent way to connect accepted work with an inspectable settlement decision. CommitLedger reads a real GitHub issue and pull request server-side, validates the repository, issue reference, contributor policy, target branch and merged commit, and binds that evidence to a Daml lifecycle.

The implemented flow is Issue -> Bounty -> ClaimRequest -> ClaimedBounty -> SubmittedBounty -> VerifiedBounty -> SettlementReceipt. The maintainer, contributor and verifier have different choices. The verifier remains a trusted external oracle: Daml does not independently call GitHub. Hashing makes the evidence identifiable; it does not eliminate trust in that oracle.

## Why Canton and Daml

The intended demonstrated value is authorized state progression, inspectable contract/update references, and prevention of re-exercising the same consumed verified contract. That last property is per-contract replay protection, not a claim that an issue can never receive multiple separately created bounties. Demo runs intentionally have distinct identifiers.

## Technical implementation

Node.js backend and local judge UI; canonical GitHub API adapter; Daml contracts; Canton JSON Ledger API v2; proof export; automated Node/Daml verification and local proof scripts. The project has no application-package dependency on a paid hosting provider or external payment rail.

## Evidence currently established

The original Node test suite passed 16/16 locally. The expanded delivery suite passed 65/65 locally, including failure classification, canonical GitHub validation, local HTTP-server checks and simulated lifecycle transport. These transport tests do not establish live Canton deployment or settlement.

## Runtime evidence to insert only after a successful run

Insert the exact tested commit, DAR package ID, Canton environment, retained build/test logs, final receipt contract/update IDs, evidence JSON artifact, negative rejection responses, judge-accessible demo and video links. These artifacts are not yet claimed in this draft. No placeholder IDs or fabricated testimonials are supplied.

## Scope and integrity

DEMO_CREDIT is non-production test value. This build does not claim fiat, Canton Coin or MainNet transfer; external users; production custody; financial returns; organizer endorsement; or guaranteed competition performance. The source fixture is the project's own real issue #5 and PR #6, not user adoption.

## Limitations and next production work

Production identity/key separation, authenticated multi-organization operation, custody/payment integration, dispute handling, comprehensive adversarial contract review, monitoring, and audited deployment are outside this local demo. The current delivery's Daml/runtime compatibility remains to be proven on an executable Canton environment.
