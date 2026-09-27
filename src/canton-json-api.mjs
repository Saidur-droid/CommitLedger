export class CantonJsonApi {
  constructor({ baseUrl, token, applicationId = "commit-ledger" }) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
    this.applicationId = applicationId;
  }

  async submitAndWait({ commands, actAs, readAs = [], workflowId, commandId }) {
    const response = await fetch(`${this.baseUrl}/v2/commands/submit-and-wait`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        commands,
        workflowId,
        applicationId: this.applicationId,
        commandId,
        actAs,
        readAs,
        submissionId: commandId,
        disclosedContracts: [],
        domainId: "",
        packageIdSelectionPreference: []
      })
    });

    const body = await response.text();
    if (!response.ok) {
      throw new Error(`Canton JSON Ledger API failed: ${response.status} ${body}`);
    }
    return body ? JSON.parse(body) : {};
  }

  createCommand(templateId, createArguments) {
    return { CreateCommand: { templateId, createArguments } };
  }

  exerciseCommand(templateId, contractId, choice, choiceArgument = {}) {
    return { ExerciseCommand: { templateId, contractId, choice, choiceArgument } };
  }
}
