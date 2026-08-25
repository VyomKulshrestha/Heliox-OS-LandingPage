import assert from "node:assert/strict";
import test from "node:test";

import statusServer from "../api/v1/status.js";
import { resetRateLimitsForTest } from "../lib/public-api.js";

const request = (method = "GET", ip = "203.0.113.10") =>
  new Request("https://www.helioxos.dev/api/v1/status", {
    method,
    headers: { "x-forwarded-for": ip, accept: "application/json" },
  });

test("versioned status is typed, read-only, and discoverable", async () => {
  resetRateLimitsForTest();
  const response = await statusServer.fetch(request());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("api-version"), "1");
  assert.match(response.headers.get("ratelimit-policy"), /q=120;w=60/);
  assert.ok(response.headers.get("ratelimit"));
  const body = await response.json();
  assert.equal(body.api_version, "v1");
  assert.equal(body.read_only, true);
  assert.equal(body.authentication.api_keys_issued, false);
  assert.equal(body.links.openapi, "https://www.helioxos.dev/openapi.json");
  assert.match(body.claim_boundary, /cannot access/i);
});

test("unsupported status methods return RFC 9457 problem JSON", async () => {
  resetRateLimitsForTest();
  const response = await statusServer.fetch(request("POST", "203.0.113.11"));
  assert.equal(response.status, 405);
  assert.match(response.headers.get("content-type"), /^application\/problem\+json/);
  assert.equal(response.headers.get("allow"), "GET, HEAD, OPTIONS");
  const body = await response.json();
  assert.equal(body.code, "method_not_allowed");
  assert.ok(body.resolution);
});

test("the dynamic API enforces its documented quota", async () => {
  resetRateLimitsForTest();
  const ip = "203.0.113.12";
  for (let index = 0; index < 120; index += 1) {
    const response = await statusServer.fetch(request("GET", ip));
    assert.equal(response.status, 200, `request ${index + 1}`);
  }
  const limited = await statusServer.fetch(request("GET", ip));
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) >= 1);
  assert.equal((await limited.json()).code, "rate_limit_exceeded");
});
