import server from "../api/mcp.js";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const rawEvidence = readFileSync(new URL("../benchmarks.json", import.meta.url));
const evidence = JSON.parse(rawEvidence);

const call = async (method, params = {}, headers = {}) => {
  const request = new Request("https://www.helioxos.dev/api/mcp", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": "2025-11-25",
      ...headers,
    },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const response = await server.fetch(request);
  return { response, body: response.status === 202 ? null : await response.json() };
};

const discover = await call("server/discover");
if (discover.body.result.supportedVersions[0] !== "2025-11-25" || !discover.body.result.instructions.includes("Read-only")) throw new Error("stateless discovery failed");
const initialize = await call("initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "test", version: "1" } });
if (initialize.body.result.protocolVersion !== "2025-11-25") throw new Error("legacy initialization failed");
const listed = await call("tools/list");
if (listed.body.result.tools.length !== 6) throw new Error("wrong public tool count");
if (listed.body.result.tools.some((tool) => /execute|control computer|credential/i.test(tool.name))) throw new Error("unsafe tool exposed");
if (listed.body.result.tools.some((tool) => !tool.annotations?.readOnlyHint || tool.annotations?.destructiveHint)) throw new Error("MCP tool lacks enforced read-only hints");
const searched = await call("tools/call", { name: "search_heliox_docs", arguments: { query: "neural" } });
if (!searched.body.result.structuredContent.matches.some((match) => match.url.endsWith("neural-research.md"))) throw new Error("documentation search failed");
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  const path = new URL(url).pathname;
  if (path === "/capabilities.json") return Response.json({ actions: [{ action_type: "browser_navigate", permission: { tier: "user_write", approval_required: false }, provider: "web" }] });
  if (path === "/releases.json") return Response.json({ current_version: "0.14.0", releases: [{ version: "0.14.0", title: "Co-Adaptive Assistance and Governed Desktop Agency" }] });
  return new Response("not found", { status: 404 });
};
const capabilities = await call("tools/call", { name: "list_capabilities", arguments: { query: "browser", limit: 10 } });
if (capabilities.body.result.structuredContent.actions[0].action_type !== "browser_navigate") throw new Error("capability lookup failed");
const safety = await call("tools/call", { name: "get_action_safety", arguments: { action_type: "browser_navigate" } });
if (safety.body.result.structuredContent.permission.tier !== "user_write") throw new Error("action safety lookup failed");
const release = await call("tools/call", { name: "get_latest_release", arguments: {} });
if (release.body.result.structuredContent.current_version !== "0.14.0") throw new Error("release lookup failed");
const benchmark = await call("tools/call", { name: "get_benchmark_evidence", arguments: {} });
const measured = benchmark.body.result.structuredContent;
if (measured.source_commit !== evidence.source_commit) throw new Error("benchmark source commit drifted");
if (measured.source_sha256 !== createHash("sha256").update(rawEvidence.toString("utf8").replace(/\r\n/g, "\n")).digest("hex")) throw new Error("benchmark source hash drifted");
if (measured.guarded_local_request.median_ms !== evidence.guarded_cpu_request.steady_state.median_ms) throw new Error("benchmark lookup failed");
if (measured.event_loop_responsiveness.heartbeat_ticks !== evidence.event_loop_responsiveness.heartbeat_ticks) throw new Error("benchmark responsiveness lookup failed");
if (measured.learned_risk_world_model.median_inference_ms !== evidence.learned_risk_world_model.inference.median_ms) throw new Error("benchmark world-model inference drifted");
for (const field of ["evidence_kind", "claim_boundary", "in_sample", "split", "promoted_to_runtime", "protocol_sha256"]) {
  if (measured.coadaptation_simulated_users[field] !== evidence.coadaptation_simulated_users[field]) throw new Error(`simulation evidence drifted: ${field}`);
}
for (const [policy, audit] of Object.entries(evidence.coadaptation_simulated_users.agency_audit)) {
  if (measured.coadaptation_simulated_users.agency_audits[policy] !== audit.passed) throw new Error(`simulation audit drifted: ${policy}`);
}
if (benchmark.body.result.structuredContent.local_tts_isolation.parent_heavy_modules !== 0) throw new Error("benchmark TTS isolation evidence drifted");
if (!benchmark.body.result.structuredContent.claim_boundary.includes("excludes")) throw new Error("benchmark boundary missing");
globalThis.fetch = originalFetch;
const badOrigin = await call("tools/list", {}, { origin: "https://attacker.example" });
if (badOrigin.response.status !== 403) throw new Error("Origin validation failed");
const getResponse = await server.fetch(new Request("https://www.helioxos.dev/api/mcp"));
if (getResponse.status !== 405 || getResponse.headers.get("allow") !== "POST, OPTIONS") throw new Error("standalone MCP GET must decline SSE with 405");
if ((await getResponse.json()).code !== "mcp_sse_not_available") throw new Error("MCP GET lacks a typed recovery hint");
const badAccept = await call("ping", {}, { accept: "application/json" });
if (badAccept.response.status !== 406 || badAccept.body.code !== "invalid_accept_header") throw new Error("MCP Accept contract is not enforced");
const badProtocol = await call("ping", {}, { "mcp-protocol-version": "1900-01-01" });
if (badProtocol.response.status !== 400 || !badProtocol.body.error.data.resolution) throw new Error("unsupported MCP protocol lacks typed recovery");
if (!listed.response.headers.get("ratelimit-policy") || !listed.response.headers.get("ratelimit")) throw new Error("MCP rate limit headers missing");
console.log("Validated stable MCP handshake, six read-only tools, transport errors, rate headers, Origin rejection, and evidence lookups.");
