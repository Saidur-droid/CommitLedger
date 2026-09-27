import test from "node:test";
import assert from "node:assert/strict";
import { eventFormatForParty, extractCreatedEvents } from "../src/canton-json-api.mjs";

test("builds a template-scoped Canton active-contract filter", () => {
  const format = eventFormatForParty("Maintainer::1", "pkg:CommitLedger:Bounty");
  const filter = format.filtersByParty["Maintainer::1"].cumulative[0].identifierFilter.TemplateFilter.value;
  assert.equal(filter.templateId, "pkg:CommitLedger:Bounty");
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
            templateId: "pkg:CommitLedger:Bounty",
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
