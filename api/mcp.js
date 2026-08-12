const PROTOCOLS = ["2026-07-28", "2025-11-25", "2025-06-18"];
const SERVER = { name: "heliox-docs", title: "Heliox OS Documentation", version: "1.0.0" };
const SITE = "https://www.helioxos.dev";

const DOCUMENTS = [
  ["Product overview", "/index.html.md", "Installation, architecture, capability, privacy, and release overview."],
  ["Capability catalog", "/capabilities.json", "Generated action types, permissions, providers, platforms, and verification coverage."],
  ["Evidence and limitations", "/proof.md", "Measured latency, CI links, hardware boundaries, and closed regressions."],
  ["Changelog", "/changelog.md", "Versioned release milestones generated from the daemon changelog."],
  ["Cost", "/cost.md", "Free-core status, optional provider charges, local resource costs, and hardware."],
  ["Security overview", "/whitepaper.html.md", "Permission tiers, approvals, audit, rollback, and limits."],
  ["Privacy", "/privacy.html.md", "Local records, providers, credentials, sensors, and telemetry boundaries."],
  ["Voice control", "/voice-control.md", "Continuous listening, speech, approvals, and device limits."],
  ["Browser and applications", "/browser-app-control.md", "Target resolution, execution, verification, and failure boundaries."],
  ["Gesture and gaze", "/gesture-gaze-control.md", "On-device signals, temporal checks, calibration, and camera limits."],
  ["Autonomous workflows", "/autonomous-workflows.md", "Durable jobs, bounded parallelism, interruptions, and supervision."],
  ["Plugin marketplace", "/plugin-marketplace.md", "Moderation, package integrity, declared capabilities, and runtime limits."],
  ["Neural research", "/neural-research.md", "Synthetic and recorded EEG without a live brain-control claim."],
];

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true };

const TOOLS = [
  { name: "search_heliox_docs", description: "Search the public Heliox documentation index. Read-only; returns links and summaries, never desktop control.", inputSchema: { type: "object", properties: { query: { type: "string", minLength: 1 } }, required: ["query"], additionalProperties: false }, annotations: READ_ONLY },
  { name: "list_capabilities", description: "List generated Heliox action capabilities, optionally filtered by text or permission tier.", inputSchema: { type: "object", properties: { query: { type: "string" }, permission_tier: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 100, default: 25 } }, additionalProperties: false }, annotations: READ_ONLY },
  { name: "get_action_safety", description: "Get permission, approval, platform, provider, and verification metadata for one exact action type.", inputSchema: { type: "object", properties: { action_type: { type: "string", minLength: 1 } }, required: ["action_type"], additionalProperties: false }, annotations: READ_ONLY },
  { name: "get_latest_release", description: "Return the current public Heliox release record and release links.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: READ_ONLY },
  { name: "get_installation_steps", description: "Return installation documentation for a supported platform.", inputSchema: { type: "object", properties: { platform: { type: "string", enum: ["windows", "macos", "linux", "developer"] } }, required: ["platform"], additionalProperties: false }, annotations: READ_ONLY },
];

const json = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": SITE } });
const result = (id, value) => json({ jsonrpc: "2.0", id, result: value });
const error = (id, code, message, status = 200) => json({ jsonrpc: "2.0", id: id ?? null, error: { code, message } }, status);
const textResult = (value) => ({ content: [{ type: "text", text: JSON.stringify(value, null, 2) }], structuredContent: value, isError: false });

function validOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const requestHost = new URL(request.url).host;
    const originUrl = new URL(origin);
    return originUrl.host === requestHost || originUrl.origin === SITE || originUrl.origin === "https://helioxos.dev";
  } catch { return false; }
}

async function siteJson(request, path) {
  const url = new URL(path, request.url);
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`Documentation source unavailable: ${path}`);
  return response.json();
}

async function callTool(request, name, args) {
  if (name === "search_heliox_docs") {
    const query = String(args.query || "").trim().toLowerCase();
    if (!query) throw new Error("query is required");
    const matches = DOCUMENTS.filter((entry) => entry.join(" ").toLowerCase().includes(query)).map(([title, path, description]) => ({ title, url: `${SITE}${path}`, description }));
    return { query, matches };
  }
  if (name === "list_capabilities") {
    const catalog = await siteJson(request, "/capabilities.json");
    const query = String(args.query || "").toLowerCase();
    const tier = String(args.permission_tier || "").toLowerCase();
    const limit = Math.min(Math.max(Number(args.limit) || 25, 1), 100);
    const actions = catalog.actions.filter((action) => (!query || JSON.stringify(action).toLowerCase().includes(query)) && (!tier || String(action.permission?.tier || action.permission_tier || "").toLowerCase() === tier));
    return { total_matches: actions.length, returned: Math.min(actions.length, limit), actions: actions.slice(0, limit) };
  }
  if (name === "get_action_safety") {
    const catalog = await siteJson(request, "/capabilities.json");
    const action = catalog.actions.find((item) => item.action_type === args.action_type || item.name === args.action_type);
    if (!action) throw new Error(`Unknown action type: ${args.action_type}`);
    return action;
  }
  if (name === "get_latest_release") {
    const data = await siteJson(request, "/releases.json");
    return { current_version: data.current_version, release: data.releases[0], feeds: { changelog: `${SITE}/changelog.md`, json: `${SITE}/releases.json`, json_feed: `${SITE}/releases.feed.json`, rss: `${SITE}/releases.xml` } };
  }
  if (name === "get_installation_steps") {
    const platform = String(args.platform || "");
    const artifacts = { windows: ".exe or .msi", macos: ".dmg for Apple Silicon or Intel", linux: ".AppImage, .deb, or .rpm", developer: "Python 3.11+ daemon and Svelte/Tauri UI" };
    if (!artifacts[platform]) throw new Error("platform must be windows, macos, linux, or developer");
    return { platform, artifact: artifacts[platform], releases: "https://github.com/VyomKulshrestha/Heliox-OS/releases", instructions: `${SITE}/index.html.md#installation` };
  }
  throw new Error(`Unknown tool: ${name}`);
}

async function handle(request, payload) {
  const { id, method, params = {} } = payload || {};
  if (method === "server/discover") return result(id, { resultType: "complete", supportedVersions: PROTOCOLS, capabilities: { tools: {} }, serverInfo: SERVER, instructions: "Read-only public Heliox documentation. No local daemon, user data, credentials, or computer-control actions are exposed." });
  if (method === "initialize") {
    const requested = params.protocolVersion;
    const protocolVersion = PROTOCOLS.includes(requested) ? requested : "2025-11-25";
    return result(id, { protocolVersion, capabilities: { tools: {} }, serverInfo: SERVER, instructions: "Read-only public Heliox documentation; no computer control." });
  }
  if (method === "ping") return result(id, {});
  if (method === "notifications/initialized") return new Response(null, { status: 202 });
  if (method === "tools/list") return result(id, { tools: TOOLS });
  if (method === "tools/call") {
    const tool = TOOLS.find((item) => item.name === params.name);
    if (!tool) return error(id, -32602, `Unknown tool: ${params.name}`);
    try { return result(id, textResult(await callTool(request, params.name, params.arguments || {}))); }
    catch (cause) { return result(id, { content: [{ type: "text", text: cause instanceof Error ? cause.message : "Tool failed" }], isError: true }); }
  }
  return error(id, -32601, `Method not found: ${method}`);
}

export default {
  async fetch(request) {
    if (!validOrigin(request)) return error(null, -32000, "Invalid Origin", 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": SITE, "access-control-allow-methods": "GET, POST, OPTIONS", "access-control-allow-headers": "content-type, mcp-protocol-version, mcp-method, mcp-name" } });
    if (request.method === "GET") return json({ name: SERVER.name, title: SERVER.title, endpoint: `${SITE}/api/mcp`, transport: "streamable-http", protocols: PROTOCOLS, read_only: true, tools: TOOLS.map(({ name, description }) => ({ name, description })) });
    if (request.method !== "POST") return error(null, -32600, "Use GET or POST", 405);
    let payload;
    try { payload = await request.json(); } catch { return error(null, -32700, "Parse error", 400); }
    return handle(request, payload);
  },
};
