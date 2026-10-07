# CommitLedger — HackCanton Season 4 Locked Winning Plan

**Status: APPROVED / LOCKED — 7 October 2026**

## Goal

Turn the already strong Canton-native CommitLedger core into a finalist-quality, judge-first product without rewriting the architecture.

## Scope lock

**Keep approximately 85–90% of the proven core unchanged.**

Do not rewrite:
- Daml authorization model;
- canonical GitHub verifier;
- six-step lifecycle;
- SettlementReceipt semantics;
- replay/duplicate protection;
- wrong-evidence rejection;
- unauthorized-settlement rejection.

Season 4 work is intentionally concentrated in the judge-visible 10–15%.

## Six locked upgrades

### 1. Judge Mode
One screen tells the complete story:
**real work → independent evidence → authorized settlement → receipt**.

A judge should understand the product before opening a terminal.

### 2. Rejection Moment
After a successful settlement, surface the same-run duplicate settlement rejection as the dramatic proof that consumed-contract semantics matter.

Never fake a rejection. A network failure is not authorization proof.

### 3. Authenticated DevNet Proof
Keep the reproducible local proof, then capture a new authenticated DevNet proof if organizer credentials/environment are available.

Do not label a run DevNet unless it was actually executed there.

### 4. Business-First Story
Primary sentence:

> A foundation pays contributors only after independently verified work, with no duplicate settlement and an auditable receipt.

Technical details support the story; they do not lead it.

### 5. Evidence Passport
Create a compact machine-readable and judge-readable proof summary tying:
**GitHub work → roles → Canton receipt → attack rejections → source commit**.

### 6. Real Validation
Collect 3–5 real conversations with maintainers, foundations, ecosystem operators, or developer-program owners.

No invented quotes, users, pilots, or demand.

## Winning demo story

> A contribution merged. That is evidence, not permission to pay.
>
> CommitLedger verifies the exact work, separates Maintainer / Contributor / Verifier authority, settles only after the proof is valid, creates a Canton receipt, and then rejects the same settlement when we try it again.
>
> GitHub proves what happened. Canton controls what is allowed to happen next.

## Definition of done

- Judge Mode works without terminal dependency.
- Evidence Passport endpoint/card is inspectable.
- Fresh lifecycle can run when a real ledger is connected.
- Duplicate settlement rejection is visible from the same proof run.
- Season 4 business brief + pilot plan map directly to the RWA/Business Workflow expected outputs.
- DevNet proof is either VERIFIED with evidence or explicitly PENDING.
- At least 3 real validation responses are recorded, or validation remains honestly pending.
- Demo and submission contain no unsupported claim.

## Feature rule

No new feature is allowed unless it improves:
1. rule compliance;
2. judge comprehension;
3. proof strength;
4. business credibility;
5. demo reliability.

Everything else is scope creep.
