# Competition Targets — 7 October 2026

**Canonical plan for the current CommitLedger sprint.**

The owner's 7 October instruction supersedes the 1 October planning note that had retired HackCanton.

## Active targets

1. **HackCanton Season 3**
2. **Crypto World's Fair — Colosseum**

Ideathon Bangladesh 2026 is not part of this immediate CommitLedger submission sprint.

## Frozen technical baseline

Last fully executed, source-bound technical proof:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Canonical proof service:

https://commitledger-proof-final.onrender.com

Proof endpoint:

https://commitledger-proof-final.onrender.com/api/proof

Verified on the frozen code commit:
- Node 86/86 PASS;
- DPM 3.5.12 PASS;
- Daml build PASS;
- Daml Script tests PASS;
- fresh Canton sandbox;
- six ledger transitions;
- SettlementReceipt;
- wrong-evidence rejection;
- unauthorized-settlement rejection;
- duplicate/replay rejection;
- exact source-commit binding.

Planning/documentation commits after the frozen proof are not automatically runtime-proven. If executable code changes, rerun the full proof.

---

# Target 1 — HackCanton Season 3

## Live-verified timing

Current public schedule:
- build phase: 18 Sep–9 Oct 2026;
- submission deadline: **9 Oct 2026, 23:59 UTC**;
- Bangladesh equivalent: **10 Oct 2026, 05:59**;
- judging: 10–18 Oct;
- finalists: 19 Oct;
- Grand Final: 21 Oct, 14:00 UTC.

Primary sources/recheck pointers:
- https://appsfactory.cc/hackathons
- https://forum.canton.network/
- current ecosystem schedule/article notes captured in `RULES_RECHECK_20261007.md`.

## Fit

CommitLedger is a strong Canton-native business-workflow submission because Daml/Canton controls the core authorization and settlement state:

`Issue -> Bounty -> Claim -> PR -> Verify -> Settle -> SettlementReceipt`

Primary track candidate: **Real-World Asset & Business Workflows** because the product is an end-to-end role-authorized business workflow. Verify the actual portal track names before final selection.

## Technical status

**GREEN.** Product engineering and runtime proof are complete at the frozen proof commit.

## Submission-side status

Ready now:
- product;
- runtime proof;
- security/negative proof;
- architecture/business brief;
- pitch text;
- demo storyboard;
- AI disclosure;
- hackathon-work disclosure draft.

Still external/manual:
- AppsFactory login/registration state;
- team/project profile state;
- actual portal-required track and fields;
- recorded final video;
- repository judge access/public visibility;
- final portal submission;
- submission receipt.

### Historical AppsFactory gate warning

This repository previously modeled external gates named:
- `mana1000`;
- `activity10Days`;
- `journalNonEmpty`;
- `projectProfileComplete`;
- `track1Selected`.

These are **not being promoted here as universal public rules** because the live public site does not expose the full private participant checklist. Inspect the logged-in AppsFactory portal immediately. If any of these are mandatory and already unmet, do not misrepresent eligibility.

---

# Target 2 — Crypto World's Fair — Colosseum

## Official timing

Official rules state:
- contest starts: **14 Sep 2026, 6:00 AM PT**;
- contest ends / registration + submission cutoff: **12 Oct 2026, 11:59 PM PT**;
- Bangladesh equivalent: **13 Oct 2026, 12:59**;
- winners announced by 5 Dec 2026.

Official page:
https://colosseum.com/worldsfair

Official rules:
https://colosseum.com/legal/Crypto%20World%27s%20Fair%20Hackathon%20Rules.pdf

## Eligibility/rules currently verified

- no purchase necessary;
- age of majority in country/residence or at least 18, whichever is older;
- Bangladesh is not in the current listed excluded jurisdictions;
- every member must register before the cutoff;
- one entrant may be on only one team;
- a team may submit one project at a time;
- all submitted content must be in English;
- judging includes functionality, potential impact, novelty, UX, open-source/composability, and business plan.

Current Colosseum FAQ also states:
- pre-existing code is allowed;
- previous development must be disclosed;
- judging focuses on work completed during the contest;
- repository link is required (private allowed if review access is granted);
- presentation video is requested;
- product demo video is requested;
- GTM, demand validation and distribution plan are requested.

## Fit

Submit CommitLedger as **verifiable work-to-settlement infrastructure for open-source ecosystems and contributor programs**.

Do not force an ecosystem-track claim unless CommitLedger genuinely integrates the required chain. The general competition remains available across ecosystems.

## Technical status

**GREEN.** Reuse the frozen proven product; do not rewrite core code just to make it look new.

## Competition-specific work still needed

- Colosseum account/join confirmation;
- project record in portal;
- transparent pre-existing-work disclosure;
- concise founder/market narrative;
- demand validation that is real, not invented;
- GTM/business model;
- 2–3 minute presentation video;
- <=3 minute product demo video;
- repository review access;
- final submission + receipt.

---

# Execution order — 7 October

1. **HackCanton portal check first** because its hard deadline is earlier.
2. Resolve registration/profile/eligibility gates.
3. Record and upload HackCanton final video.
4. Ensure judge-accessible repo + proof links.
5. Submit HackCanton and save receipt.
6. Then complete Colosseum registration/project fields.
7. Record Colosseum presentation + demo videos.
8. Finalize pre-existing-work disclosure, GTM, validation and business model.
9. Submit Colosseum and save receipt.

Owner constraint: use free tools/services unless explicitly changed.
