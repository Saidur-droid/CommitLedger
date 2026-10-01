# Competition Targets — 1 October 2026

**This is the canonical competition plan for CommitLedger.**

## Active submission targets

CommitLedger will now be prepared for exactly these two programs:

1. **Crypto World's Fair — Colosseum**
2. **Ideathon Bangladesh 2026**

These are the active targets. If a future session asks, “Which programs are we participating in?”, answer with these two unless this file is deliberately updated after a fresh rules/eligibility review.

## Retired target

HackCanton Season 3 is **not an active submission target anymore** because the required AppsFactory account-registration/activity gates were not completed in time.

Do not spend more time on HackCanton submission work.

The Canton/Daml implementation and verified proof created during that effort remain valuable technical evidence and are preserved. Do not delete or rewrite that history.

## Frozen technical proof

The last fully executed, source-bound technical proof is frozen at:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Canonical proof service:

https://commitledger-proof-final.onrender.com

Proof endpoint:

https://commitledger-proof-final.onrender.com/api/proof

That proof includes:
- Node 86/86 PASS;
- DPM 3.5.12;
- Daml build and Daml Script PASS;
- a fresh Canton sandbox;
- six real ledger transitions;
- SettlementReceipt;
- wrong-issue rejection;
- unauthorized-settlement rejection;
- duplicate/replay rejection;
- exact source-commit binding.

Documentation-only commits made after the frozen proof do **not** become runtime-proven commits automatically. If executable code changes later, rerun the full proof on the new exact code commit.

## Global rule before any new competition work

**Eligibility first. Build second.**

Before changing code for any event, verify and record:
1. registration is still open;
2. the owner is eligible by age/country/team rules;
3. participation and submission do not require a paid product/service;
4. pre-existing projects/code are allowed or can be disclosed;
5. required build window and judging scope;
6. required chain/stack/track;
7. submission deadline and mandatory deliverables.

If any mandatory gate is unknown, do not start engineering until it is resolved.

**Owner constraint:** use free options only. Do not introduce paid tools/services unless the owner explicitly changes this rule.

---

# Target 1 — Crypto World's Fair — Colosseum

## Current plan

Treat CommitLedger as a startup/product submission, not as a HackCanton project.

Core product thesis:

> CommitLedger is verifiable work-to-settlement infrastructure for open-source ecosystems and contributor programs. It turns canonical contribution evidence into an authorization-controlled settlement workflow with replay protection and an auditable receipt.

## What should stay

Keep the proven product core:
- GitHub evidence verification;
- role-separated authorization;
- Canton/Daml state machine;
- replay protection;
- SettlementReceipt;
- structured negative/security proof;
- public read-only proof page.

Do **not** rewrite the core merely to look different for Colosseum.

## What should improve for Colosseum

Primary work should be submission/business quality:
- founder/market framing;
- target-user clarity;
- credible market size;
- demand/user validation;
- go-to-market plan;
- concise presentation video;
- concise product demo;
- transparent pre-existing-work disclosure;
- clear explanation of what was built during the competition window.

Any competition-specific code change must be made on a separate branch and only after official rules are re-verified.

## Current deadline note

Current research recorded a submission deadline of **12 October 2026**.

Before registration or final submission, re-open the official Colosseum rules and verify the live deadline, eligibility, deliverables, and pre-existing-code rules again. Do not rely on this repository note as a substitute for the live rules.

---

# Target 2 — Ideathon Bangladesh 2026

## Current plan

Use the same CommitLedger core, but position it around business value and a credible adoption path.

Suggested business framing:
- auditable contributor/work settlement;
- open-source and ecosystem bounty operations;
- remote software-work verification;
- organizations that need evidence-linked authorization before settlement.

Do not fabricate Bangladeshi customers, revenue, pilots, or adoption.

## What should stay

No core-code rewrite is currently planned.

Use the existing technical proof as product credibility, then strengthen:
- problem statement;
- customer segment;
- Bangladesh-relevant business use cases where justified;
- go-to-market;
- pricing/business model hypothesis;
- validation interviews/feedback;
- pitch clarity.

## Current deadline note

Current research recorded a Round 1 deadline of **20 October 2026 at 11:59 PM Bangladesh time**.

Before applying or submitting, re-verify the official live rules, deadline, team/eligibility requirements, and application fields.

---

# Next-session order

When work resumes:

1. Read this file first.
2. Re-verify **Colosseum** live rules and registration status.
3. Register/apply first and retain confirmation evidence.
4. Re-verify **Ideathon Bangladesh 2026** live rules and registration status.
5. Register/apply first and retain confirmation evidence.
6. Freeze the competition-specific requirements in repo docs.
7. Build the Colosseum submission package.
8. Build the Ideathon submission package.
9. Only make product/code changes if a verified competition requirement or concrete product defect requires them.
10. Never claim a submission is complete until the relevant portal provides confirmation/receipt.

## Not doing today

No product engineering, video production, portal submission, or competition-specific feature work is required on 1 October 2026 after this planning update.
