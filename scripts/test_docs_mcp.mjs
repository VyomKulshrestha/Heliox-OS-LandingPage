import server from "../api/mcp.js";

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
  if (path === "/releases.json") return Response.json({ current_version: "0.13.0", releases: [{ version: "0.13.0", title: "Verified Autonomy and Runtime Hardening" }] });
  return new Response("not found", { status: 404 });
};
const capabilities = await call("tools/call", { name: "list_capabilities", arguments: { query: "browser", limit: 10 } });
if (capabilities.body.result.structuredContent.actions[0].action_type !== "browser_navigate") throw new Error("capability lookup failed");
const safety = await call("tools/call", { name: "get_action_safety", arguments: { action_type: "browser_navigate" } });
if (safety.body.result.structuredContent.permission.tier !== "user_write") throw new Error("action safety lookup failed");
const release = await call("tools/call", { name: "get_latest_release", arguments: {} });
if (release.body.result.structuredContent.current_version !== "0.13.0") throw new Error("release lookup failed");
const benchmark = await call("tools/call", { name: "get_benchmark_evidence", arguments: {} });
if (benchmark.body.result.structuredContent.source_commit !== "00682b5e168b84ff68e921e813a53f9e979c7e14") throw new Error("benchmark source commit drifted");
if (benchmark.body.result.structuredContent.guarded_local_request.median_ms !== 26.476) throw new Error("benchmark lookup failed");
if (benchmark.body.result.structuredContent.event_loop_responsiveness.heartbeat_ticks !== 66) throw new Error("benchmark responsiveness lookup failed");
if (benchmark.body.result.structuredContent.learned_risk_world_model.median_inference_ms !== 0.030) throw new Error("benchmark world-model inference drifted");
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
