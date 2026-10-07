# Crypto World's Fair — Final Submission Checklist

Deadline: **October 12, 2026 at 11:59 PM PT**.

## Automated / repository work

- [x] Product code exists and is judgeable.
- [x] Real GitHub issue / merged PR fixture exists.
- [x] Daml role-separated state machine exists.
- [x] Canonical GitHub verifier exists.
- [x] Duplicate settlement and unauthorized-action logic exists.
- [x] Colosseum-specific rules snapshot added.
- [x] Colosseum submission copy drafted.
- [x] 2–3 minute pitch script drafted.
- [x] <=3 minute technical demo script drafted.
- [x] UI competition branding updated.

## Must verify before submission

- [ ] Run `npm test` on the final commit and save output.
- [ ] Run `bash scripts/bootstrap-dpm.sh`.
- [ ] Run `bash scripts/verify-all.sh` and save Daml build/test output.
- [ ] Configure a real Canton dev/local environment.
- [ ] Run `npm run demo:full`.
- [ ] Save the evidence bundle using `COMMITLEDGER_EVIDENCE_FILE`.
- [ ] Confirm wrong-issue rejection.
- [ ] Confirm unauthorized-settlement rejection.
- [ ] Confirm duplicate-settlement rejection.
- [ ] Confirm the final active `SettlementReceipt`.

## Colosseum account / portal

- [ ] Every team member is registered for Crypto World's Fair.
- [ ] Team leader has the correct team configured.
- [ ] Founder/team background is filled accurately.
- [ ] Team location is filled accurately.
- [ ] Any pre-September-14 development is disclosed.
- [ ] Repository is public **or** `hackathon@colosseum.com` has private-repo review access.
- [ ] Original product logo / graphic is uploaded.
- [ ] Product name and short description are final.
- [ ] Canton / Daml / GitHub stack is listed accurately.
- [ ] GTM and distribution plan are pasted from the submission draft and edited for accuracy.
- [ ] Demand validation includes only real evidence.

## Videos

- [ ] Record 2–3 minute presentation video.
- [ ] Record technical demo <=3 minutes.
- [ ] Videos show the final build, not an outdated branch.
- [ ] Technical demo shows real Canton runtime evidence.
- [ ] Audio and screen text are readable.
- [ ] Links are accessible to judges.

## Final 20-minute check

- [ ] Open repository link in a logged-out/incognito window if public.
- [ ] If private, confirm Colosseum reviewer access.
- [ ] Re-open the official rules and FAQ for last-minute changes.
- [ ] Confirm every portal field is in English.
- [ ] Confirm no fake traction, production or real-money claims.
- [ ] Submit before the deadline and save the confirmation.
