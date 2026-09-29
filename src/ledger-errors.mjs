/** Fail closed: connectivity, authentication and unknown errors are not security proof. */
export class CantonApiError extends Error {
  constructor(status, body) {
    const code = typeof body?.code === "string" ? body.code : "UNKNOWN_CANTON_ERROR";
    const cause = typeof body?.cause === "string" ? body.cause : "Unrecognized Canton error response";
    super(`Canton JSON Ledger API failed: ${status} ${code}: ${cause}`);
    this.name = "CantonApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

export async function expectLedgerFailure(name, action, expected) {
  try {
    await action();
  } catch (error) {
    const codeMatches = error instanceof CantonApiError && expected.codes.includes(error.code);
    const statusMatches = error?.status >= 400 && error.status < 500 && ![401, 403, 408, 429].includes(error.status);
    const detailMatches = !expected.contains || JSON.stringify(error?.body || {}).includes(expected.contains);
    if (!codeMatches || !statusMatches || !detailMatches) {
      throw new Error(`Unproven ledger rejection (${name}): ${error?.message || String(error)}`, { cause: error });
    }
    return { name, rejected: true, code: error.code, httpStatus: error.status, response: error.body };
  }
  throw new Error(`Expected Canton rejection did not occur: ${name}`);
}
