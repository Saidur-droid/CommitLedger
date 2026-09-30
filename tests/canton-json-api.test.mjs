import test from "node:test";
import assert from "node:assert/strict";
import { eventFormatForParty, extractCreatedEvents, extractTransactionCreatedEvents } from "../src/canton-json-api.mjs";

test("builds a template-scoped Canton active-contract filter", () => {
  const format = eventFormatForParty("Maintainer::1", "#commit-ledger:CommitLedger:Bounty");
  const filter = format.filtersByParty["Maintainer::1"].cumulative[0].identifierFilter.TemplateFilter.value;
  assert.equal(filter.templateId, "#commit-ledger:CommitLedger:Bounty");
  assert.equal(filter.includeCreatedEventBlob, false);
  assert.equal(format.verbose, true);
});

test("extracts active created events from Canton JSON API responses", () => {
  const events = extractCreatedEvents([
    {
      contractEntry: {
        JsActiveContract: {
          createdEvent: {
            contractId: "00abc",
            templateId: "#commit-ledger:CommitLedger:Bounty",
            createArgument: { bountyId: "bounty-5" }
          }
        }
      }
    },
    { contractEntry: { JsIncompleteUnassigned: {} } }
  ]);
  assert.equal(events.length, 1);
  assert.equal(events[0].contractId, "00abc");
  assert.equal(events[0].createArgument.bountyId, "bounty-5");
});


test("extracts created events from submit-and-wait transaction responses", () => {
  const events = extractTransactionCreatedEvents({
    transaction: {
      updateId: "unit-update",
      offset: 1,
      events: [{ CreatedEvent: {
        contractId: "00created",
        templateId: "a".repeat(64) + ":CommitLedger:Bounty",
        createArgument: { bountyId: "bounty-5" }
      } }]
    }
  });
  assert.equal(events.length, 1);
  assert.equal(events[0].contractId, "00created");
  assert.equal(events[0].createArgument.bountyId, "bounty-5");
});
