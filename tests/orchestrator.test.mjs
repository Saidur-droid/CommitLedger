import test from "node:test";
import assert from "node:assert/strict";
import { runtimeConfigFromEnv } from "../src/orchestrator.mjs";

test("runtime config requires three distinct Canton parties", () => {
  assert.throws(() => runtimeConfigFromEnv({
    CANTON_JSON_API_URL: "http://localhost:3975",
    CANTON_PACKAGE_ID: "pkg",
    CANTON_TOKEN: "token",
    CANTON_MAINTAINER_PARTY: "Alice::1",
    CANTON_CONTRIBUTOR_PARTY: "Alice::1",
    CANTON_VERIFIER_PARTY: "Verifier::1"
  }), /distinct Canton parties/);
});

test("runtime config supports one local token or role-specific tokens", () => {
  const config = runtimeConfigFromEnv({
    CANTON_JSON_API_URL: "http://localhost:3975",
    CANTON_PACKAGE_ID: "pkg",
    CANTON_TOKEN: "local-admin-token",
    CANTON_MAINTAINER_PARTY: "Maintainer::1",
    CANTON_CONTRIBUTOR_PARTY: "Contributor::1",
    CANTON_VERIFIER_PARTY: "Verifier::1"
  });
  assert.equal(config.packageName, "commit-ledger");
  assert.equal(config.tokens.maintainer, "local-admin-token");
  assert.equal(config.tokens.contributor, "local-admin-token");
  assert.equal(config.tokens.verifier, "local-admin-token");
});

test("runtime config carries explicit proof environment label", () => {
  const config = runtimeConfigFromEnv({
    CANTON_JSON_API_URL: "https://devnet.example",
    CANTON_PACKAGE_ID: "pkg",
    CANTON_TOKEN: "token",
    CANTON_MAINTAINER_PARTY: "Maintainer::1",
    CANTON_CONTRIBUTOR_PARTY: "Contributor::1",
    CANTON_VERIFIER_PARTY: "Verifier::1",
    CANTON_ENVIRONMENT_LABEL: "authenticated-devnet"
  });
  assert.equal(config.environmentLabel, "authenticated-devnet");
});
