function requireText(value, name) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${name} is required`);
  return text;
}

function authHeaders(token) {
  return {
    Authorization: `Bearer ${requireText(token, "Canton token")}`,
    "Content-Type": "application/json"
  };
}

export function eventFormatForParty(party, templateId) {
  return {
    filtersByParty: {
      [requireText(party, "party")]: {
        cumulative: [{
          identifierFilter: {
            TemplateFilter: {
              value: {
                templateId: requireText(templateId, "templateId"),
                includeCreatedEventBlob: false
              }
            }
          }
        }]
      }
    },
    verbose: true
  };
}

export function extractCreatedEvents(activeContractsResponse) {
  if (!Array.isArray(activeContractsResponse)) return [];
  return activeContractsResponse
    .map(entry => entry?.contractEntry)
    .filter(entry => entry && "JsActiveContract" in entry)
    .map(entry => entry.JsActiveContract?.createdEvent)
    .filter(Boolean);
}

export class CantonJsonApi {
  constructor({ baseUrl, token, applicationId = "commit-ledger" }) {
    this.baseUrl = requireText(baseUrl, "Canton base URL").replace(/\/$/, "");
    this.token = requireText(token, "Canton token");
    this.applicationId = applicationId;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        ...authHeaders(this.token),
        ...(options.headers || {})
      }
    });
    const text = await response.text();
    let body = {};
    if (text) {
      try { body = JSON.parse(text); } catch { body = { raw: text }; }
    }
    if (!response.ok) throw new Error(`Canton JSON Ledger API failed: ${response.status} ${text}`);
    return body;
  }

  async submitAndWait({ commands, actAs, readAs = [], workflowId, commandId }) {
    return this.request("/v2/commands/submit-and-wait", {
      method: "POST",
      body: JSON.stringify({
        commands,
        workflowId,
        applicationId: this.applicationId,
        commandId,
        deduplicationPeriod: { Empty: {} },
        actAs,
        readAs,
        submissionId: commandId,
        disclosedContracts: [],
        domainId: "",
        packageIdSelectionPreference: []
      })
    });
  }

  async activeContracts({ party, templateId, activeAtOffset }) {
    return this.request("/v2/state/active-contracts", {
      method: "POST",
      body: JSON.stringify({
        activeAtOffset,
        eventFormat: eventFormatForParty(party, templateId)
      })
    });
  }

  async findActiveContract({ party, templateId, activeAtOffset, predicate = () => true }) {
    const raw = await this.activeContracts({ party, templateId, activeAtOffset });
    const events = extractCreatedEvents(raw);
    const event = events.find(candidate => predicate(candidate?.createArgument || {}));
    if (!event) throw new Error(`Active contract not found for template ${templateId} at offset ${activeAtOffset}`);
    return event;
  }
}
