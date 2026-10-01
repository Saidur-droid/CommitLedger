# CommitLedger — Dual-Program Submission Master Draft

**Active targets**
1. Crypto World's Fair — Colosseum
2. Ideathon Bangladesh 2026

See [COMPETITION_TARGETS.md](COMPETITION_TARGETS.md) for the canonical plan and eligibility-first rule.

## Shared one-line description

CommitLedger turns verified contribution work into an authorization-controlled settlement workflow with an auditable receipt.

## Shared problem

A code host can prove that an issue exists and a pull request merged, but that evidence alone does not define who is authorized to verify a claim, who may settle it, or how duplicate settlement is prevented.

## Shared solution

CommitLedger binds canonical contribution evidence to an authorization-controlled workflow:

Issue -> Bounty -> Claim -> Pull Request -> Merge Verification -> Settlement -> SettlementReceipt.

The verifier checks repository identity, issue binding, contributor policy, base branch, merged state, head SHA, merge commit SHA, and evidence integrity before the workflow advances.

## Technical differentiation

Canton/Daml currently provides:
- role-separated Maintainer, Contributor and Verifier authority;
- explicit allowed contract transitions;
- inspectable contract/update identifiers;
- replay protection through contract consumption;
- auditable SettlementReceipt generation.

GitHub remains the external work-evidence source.

## Verified technical evidence

Use the frozen proven technical commit:

`26bd992787401f6458f6685d2ab76aacd05eab4e`

Live proof:

https://commitledger-proof-final.onrender.com

Proof JSON:

https://commitledger-proof-final.onrender.com/api/proof

External demo evidence fixture:
- repository: `Saidur-droid/MergeEarn`;
- open issue: `#69`;
- merged PR: `#73`;
- contributor: `Saidur-droid`;
- base branch: `main`.

**The MergeEarn repository is only a proof fixture. The submitted product is CommitLedger.**

## Integrity

`DEMO_CREDIT` is test value only.

Do not claim:
- fiat transfer;
- Canton Coin transfer;
- MainNet;
- production custody;
- real financial settlement;
- paying customers;
- revenue;
- organizer endorsement.

AI-assisted tools were used for research, planning, code review, testing, documentation, and implementation support. The participant remains responsible for all submitted claims and artifacts.

---

# Colosseum version

## Positioning

CommitLedger is **verifiable work-to-settlement infrastructure for open-source ecosystems and contributor programs**.

## Colosseum story

Emphasize:
- founder/market insight;
- why contributor settlement is still operationally fragmented;
- why evidence-linked authorization matters;
- product execution and security proof;
- target user;
- market opportunity;
- demand validation;
- go-to-market;
- startup viability.

Avoid presenting CommitLedger merely as a hackathon technical demo.

## Work still needed

- official live-rule recheck;
- registration confirmation;
- competition-window/pre-existing-work disclosure;
- user/demand validation;
- final GTM;
- presentation video;
- product demo;
- final portal fields;
- submission receipt.

---

# Ideathon Bangladesh 2026 version

## Positioning

CommitLedger is an auditable work-verification and settlement-control product for organizations coordinating distributed contributor work.

## Ideathon story

Emphasize:
- business problem;
- target customers;
- operational trust/audit value;
- remote software-work and ecosystem-program use cases;
- Bangladesh-relevant opportunity only where evidence supports it;
- business model hypothesis;
- adoption path;
- team execution;
- technical credibility from the verified MVP.

Do not invent local customers or traction.

## Work still needed

- official live-rule recheck;
- registration/application confirmation;
- application fields;
- business model;
- market sizing;
- validation evidence;
- pitch materials;
- final submission;
- submission receipt.

## Final links

Populate only after each program's rules are re-verified:
- Repository:
- Live product/proof: https://commitledger-proof-final.onrender.com
- Proof JSON: https://commitledger-proof-final.onrender.com/api/proof
- Colosseum presentation:
- Colosseum demo:
- Colosseum submission receipt:
- Ideathon pitch/application:
- Ideathon submission receipt:
