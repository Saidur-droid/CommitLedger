# Colosseum Crypto World's Fair 2026 — Competition Compliance Gate

_Last reviewed: 2026-10-07._

This file separates **verified requirements**, **submission actions**, and **internal quality standards**. If the live Colosseum portal conflicts with this file, the portal and official rules win.

## Official sources

- Competition page: https://colosseum.com/worldsfair
- Hackathon FAQ: https://colosseum.com/hackathon?year=fall2026
- Official rules PDF: https://colosseum.com/legal/Crypto%20World%27s%20Fair%20Hackathon%20Rules.pdf

## Verified eligibility and timing

- Contest period: September 14, 2026 at 6:00 AM PT through **October 12, 2026 at 11:59 PM PT**.
- Each team member must register on Colosseum before the deadline.
- A participant may be on only one team and a team may submit only one project.
- Solo founders are allowed.
- Products may use any blockchain ecosystem; dedicated tracks are separate prize pools.
- Builders may use pre-existing code, but relevant development history must be disclosed.
- All submitted content must be in English.

## Verified submission materials

The Colosseum FAQ says the portal requests or expects:

- product name and brief description;
- blockchains and tools integrated;
- teammate backgrounds and previous experience;
- team location;
- product logo or graphic;
- GitHub repository link;
- 2–3 minute presentation video;
- technical demo video of no more than 3 minutes;
- go-to-market strategy;
- demand validation and distribution plans;
- any other context needed to understand the product and business.

Open-source repositories are encouraged. A private repository is allowed only if review access is granted to `hackathon@colosseum.com`.

## Judging

The official rulebook evaluates:
- functionality / code quality;
- potential impact;
- novelty;
- UX;
- open-source / composability;
- business plan and team execution.

The platform FAQ also emphasizes:
- founder + market fit;
- insight;
- product + execution;
- potential market size;
- founder communication;
- viability;
- traction, when it exists.

CommitLedger must therefore be presented as a **startup**, not only as a technical demo.

## CommitLedger status

| Requirement | Status | Action |
|---|---|---|
| Eligible blockchain ecosystem | VERIFIED | General-pool entry; do not claim a Canton-specific track |
| English content | VERIFIED | Repository and submission docs are English |
| Development during hackathon window | STRONG EVIDENCE | Current Git history shows major implementation work during the contest period; disclose any earlier work truthfully |
| Product GitHub repository | READY | Repository exists and is judgeable |
| Repository review access | ACTION REQUIRED | Make public or grant `hackathon@colosseum.com` access before submission |
| Product description / stack | READY | See `docs/COLOSSEUM_SUBMISSION.md` |
| Pitch script | READY TO RECORD | See `docs/PITCH_SCRIPT.md` |
| Technical demo script | READY TO RECORD | See `docs/DEMO_SCRIPT.md` |
| GTM / business plan | DRAFTED | See `docs/COLOSSEUM_SUBMISSION.md`; add only real validation evidence |
| Logo / graphic | ACTION REQUIRED | Upload an original CommitLedger product graphic |
| Founder background / location | ACTION REQUIRED | Fill with accurate founder information in portal |
| Node tests | MUST RE-RUN | Capture current `npm test` output |
| Daml build/tests | MUST VERIFY | Capture real DPM build/test output |
| Canton lifecycle | MUST VERIFY | Run `npm run demo:full` against a real configured Canton environment |
| Demo video | ACTION REQUIRED | Record from real runtime evidence; do not mock ledger success |
| Presentation video | ACTION REQUIRED | Record from pitch script |
| Final portal submission | ACTION REQUIRED | Submit before October 12, 2026 11:59 PM PT |

## Evidence integrity

- Never fabricate users, testimonials, transactions, adoption, revenue, or judging feedback.
- Never describe `DEMO_CREDIT` as real money.
- Never claim MainNet use unless independently verifiable.
- Never claim runtime success from source code alone.
- If there is no external traction yet, say so and present a concrete validation plan instead.

## Final gate

CommitLedger is **not fully submission-ready** until all ACTION REQUIRED and MUST VERIFY items above are completed with real evidence.
