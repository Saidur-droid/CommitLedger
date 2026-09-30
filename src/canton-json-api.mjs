import { CantonApiError } from "./ledger-errors.mjs";

function requireText(value, name) {
  const text = String(value || "").trim();
  if (!text) throw new Error(`${name} is required`);
  return text;
}

function encodeDamlValue(value) {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Daml numeric values must be finite");
    return String(value);
  }
  if (Array.isArray(value)) return value.map(encodeDamlValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, encodeDamlValue(nested)]));
  }
  return value;
}

function encodeCommandDamlValues(command) {
  if (command?.CreateCommand) {
    return {
      CreateCommand: {
        ...command.CreateCommand,
        createArguments: encodeDamlValue(command.CreateCommand.createArguments)
      }
    };
  }
  if (command?.ExerciseCommand) {
    return {
      ExerciseCommand: {
        ...command.ExerciseCommand,
        choiceArgument: encodeDamlValue(command.ExerciseCommand.choiceArgument)
      }
    };
  }
  return command;
}

function authHeaders(token) {
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  constructor({ baseUrl, token, userId = "", insecureLocal = false }) {
    this.baseUrl = requireText(baseUrl, "Canton base URL").replace(/\/$/, "");
    const url = new URL(this.baseUrl);
    if (insecureLocal && !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) throw new Error("insecure Canton mode requires loopback");
    this.token = insecureLocal ? String(token || "") : requireText(token, "Canton token");
    this.userId = userId;
  }

  async request(path, options = {}) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      signal: options.signal || AbortSignal.timeout(30_000),
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
    if (!response.ok) throw new CantonApiError(response.status, body);
    return body;
  }

  async submitAndWait({ commands, actAs, readAs = [], workflowId, commandId, packageIdSelectionPreference = [] }) {
    return this.request("/v2/commands/submit-and-wait", {
      method: "POST",
      body: JSON.stringify({
        commands: commands.map(encodeCommandDamlValues),
        workflowId,
        userId: this.userId,
        commandId,
        deduplicationPeriod: { Empty: {} },
        actAs,
        readAs,
        submissionId: commandId,
        disclosedContracts: [],
        synchronizerId: "",
        packageIdSelectionPreference
      })
    });
  }

  async activeContracts({ party, templateId, activeAtOffset }) {
    return this.request("/v2/state/active-contracts", {
      method: "POST",
      body: JSON.stringify({
        activeAtOffset: Number(activeAtOffset),
        eventFormat: eventFormatForParty(party, templateId)
      })
    });
  }

  async findActiveContract({ party, templateId, activeAtOffset, predicate = () => true }) {
    const raw = await this.activeContracts({ party, templateId, activeAtOffset });
    const events = extractCreatedEvents(raw);
    const requestedEntity = String(templateId).split(':').slice(-2).join(':');
    const matches = events.filter(candidate => {
      const candidateEntity = String(candidate?.templateId || '').split(':').slice(-2).join(':');
      return candidateEntity === requestedEntity && predicate(candidate?.createArgument || {});
    });
    if (matches.length > 1) throw new Error(`Ambiguous active contracts for template ${templateId}`);
    const event = matches[0];
    if (!event?.contractId) throw new Error(`Active contract not found for template ${templateId} at offset ${activeAtOffset}`);
    return event;
  }
}
