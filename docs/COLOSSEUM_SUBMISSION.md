# Colosseum Submission Copy — CommitLedger

_Last updated: 2026-10-07._

Use this as the base copy for the Crypto World's Fair portal. Keep every claim consistent with the actual runtime evidence and final videos.

## Product name

**CommitLedger**

## One-line description

CommitLedger turns verified GitHub work into a role-authorized, auditable settlement lifecycle on Canton.

## Short description

Open-source bounty payments still depend on manual trust between maintainers and contributors. CommitLedger connects a real GitHub issue and merged pull request to a Daml state machine on Canton. GitHub proves that the work event occurred; role-separated Daml choices define who can claim, verify and settle; Canton records the final evidence-bound receipt and prevents replay.

## Blockchains and tools

- Canton Network / Canton JSON Ledger API
- Daml smart contracts
- GitHub API
- Node.js 22
- Local-first web UI

CommitLedger is a general-pool entry and does not claim a dedicated ecosystem track.

## Problem

Crypto protocols and open-source projects often use GitHub issues, grants and bounties to coordinate work. The work record is public, but the settlement decision is usually handled off-chain through spreadsheets, multisigs, manual reviews or centralized marketplaces.

That creates a trust gap: a merged pull request proves that code landed, but it does not itself prove who was authorized to approve the bounty, whether the exact issue was satisfied, or whether the same work was paid twice.

## Insight

The useful blockchain primitive is not “put GitHub on-chain.” The useful primitive is **separating evidence from authorization**.

GitHub remains the source of truth for the software event. A verifier converts canonical provider state into a compact evidence hash. Daml controls which party may advance each state. Canton records the authorized state transitions and final receipt.

## Product

The current flow is:

`GitHub Issue -> Bounty -> Claim -> Pull Request -> Merge Verification -> Verified Bounty -> SettlementReceipt`

The demo includes:
- a real GitHub issue;
- a real merged PR linked to that issue;
- server-side canonical verification;
- three distinct Canton roles;
- unauthorized-action rejection;
- duplicate-settlement rejection;
- final evidence-bound settlement receipt.

## Why blockchain is necessary

Without Canton/Daml, the application server could unilaterally declare a bounty verified or settled. In CommitLedger, the ledger is the authorization and provenance boundary. Removing it removes the multi-party control model, replay-resistant settlement transition and auditable final receipt.

## Market

Initial customers are crypto protocols, open-source foundations, grant programs and developer-relations teams that pay contributors for verifiable GitHub work.

Longer term, the same evidence-to-settlement pattern can support audits, grants, milestone-based contributor programs and other workflows where external work evidence must be converted into controlled payment authorization.

## Business model

A production version can charge:
- a per-settlement fee for completed bounties;
- organization subscriptions for policy controls, analytics and integrations;
- enterprise integration fees for custom treasury/payment rails.

The competition build does **not** claim revenue.

## Go-to-market

1. Start with crypto teams already running GitHub bounties or contributor grants.
2. Offer a lightweight GitHub-native workflow that requires minimal process change.
3. Use successful bounty settlement proofs as case studies.
4. Partner with ecosystem grant programs, foundations and developer communities.
5. Expand from individual bounties to organization-level contributor operations.

## Demand validation

Current evidence is **technical and workflow validation**, not market traction: CommitLedger uses a real issue/PR fixture and independently verifies canonical GitHub state.

Before final submission, add only genuine demand evidence such as founder interviews, maintainer feedback, a real pilot, waitlist signups or revenue. If none exists by the deadline, state that clearly instead of inventing traction.

## Competition execution

The repository shows substantial implementation activity during the Crypto World's Fair contest period. In the portal, disclose any concept, code or related work that existed before September 14, 2026.

## Founder + market fit

**Fill with accurate founder background before submission.** Focus on:
- experience building developer tools, crypto products or automation;
- why open-source work settlement is personally understood;
- evidence of fast product execution during the hackathon.

Do not invent credentials.

## Team location

**Fill accurately in the Colosseum portal.**

## Repository

https://github.com/Saidur-droid/CommitLedger

If the repository remains private, grant review access to `hackathon@colosseum.com` before submission.

## Demo fixture

- Issue: https://github.com/Saidur-droid/CommitLedger/issues/5
- PR: https://github.com/Saidur-droid/CommitLedger/pull/6

## Final proof to attach

Before submission, attach or show:
- current Node test output;
- Daml build/test output;
- real Canton lifecycle output;
- final `SettlementReceipt`;
- authorization failure;
- duplicate-settlement failure;
- pitch video;
- technical demo video.
