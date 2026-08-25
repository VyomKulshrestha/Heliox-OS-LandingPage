# Heliox OS developer portal

Heliox OS publishes a small, unauthenticated, read-only public metadata API and a read-only documentation MCP server. These surfaces help agents and developers inspect product documentation, releases, capability declarations, permission tiers, approval requirements, and verification depth. They **cannot** reach a user's local Heliox daemon, read credentials or files, or execute computer-control actions.

## Quickstart

No API key is required or issued for the public metadata API.

```bash
curl -sS https://www.helioxos.dev/api/v1/status
curl -sS https://www.helioxos.dev/capabilities.json
curl -sS https://www.helioxos.dev/releases.json
```

The live read-only sandbox is `GET /api/v1/status`. It returns service links and boundaries without accepting writes or user data. The complete machine contract is [openapi.json](https://www.helioxos.dev/openapi.json).

## Public API

| Resource | Purpose | Authentication |
| --- | --- | --- |
| `GET /api/v1/status` | Versioned API status and discovery links | None |
| `GET /capabilities.json` | Generated actions, permissions, providers, platforms, and verification | None |
| `GET /releases.json` | Structured public release records | None |
| `POST /api/mcp` | Read-only documentation tools over MCP Streamable HTTP | None |

API errors use [RFC 9457 Problem Details](https://www.rfc-editor.org/rfc/rfc9457.html) with the `application/problem+json` media type plus `type`, `title`, `status`, `detail`, `instance`, a stable `code`, and a `resolution` hint. MCP transport and JSON-RPC errors keep the JSON-RPC envelope and include machine-readable error data.

## Versioning and deprecation

Function APIs use URL-major versioning, beginning with `/api/v1/`. Additive response fields may appear within a major version; clients must ignore unknown fields. A breaking change receives a new major path such as `/api/v2/`. Heliox will publish a deprecation notice for at least 90 days when practical, using the `Deprecation` response header defined by RFC 9745, a `Sunset` header with the retirement time, and a `Link` header to migration guidance. Static metadata files carry their own `schema_version` fields. MCP versions are negotiated during initialization.

## Rate limits

Dynamic public endpoints enforce 120 requests per 60 seconds per client and runtime instance. Responses expose current `RateLimit-Policy` and `RateLimit` fields plus widely recognized limit, remaining, and reset compatibility fields. A rejected request returns HTTP 429, RFC 9457 JSON, and `Retry-After`. Cache the static catalogs instead of polling them.

## MCP

- Discovery: [/.well-known/mcp.json](https://www.helioxos.dev/.well-known/mcp.json)
- Endpoint: `https://www.helioxos.dev/api/mcp`
- Stable protocol: `2025-11-25`
- Transport: Streamable HTTP, stateless JSON responses to POST. A standalone GET SSE stream is not offered and therefore returns HTTP 405 as required by the transport specification.

```bash
curl -sS https://www.helioxos.dev/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"example","version":"1.0"}}}'
```

The six public tools search Heliox documentation, list capabilities, inspect one action's safety metadata, return the latest release, return installation guidance, and return bounded benchmark evidence. Every tool is read-only.

## Local development and CLI boundary

The source package declares `pilot-daemon`, `pilot-neurod`, and `heliox-mcp` console commands after a source installation from the repository. The public website does not claim an npm, PyPI, or Homebrew distribution that has not been published. Local daemon RPC and local MCP remain governed by the desktop application's identity, permission, confirmation, and audit boundaries; the public metadata API is not a remote-control bridge.

```bash
python -m pip install "git+https://github.com/VyomKulshrestha/Heliox-OS.git#subdirectory=daemon"
heliox-mcp --help
pilot-daemon --help
```

- [Source setup](https://github.com/VyomKulshrestha/Heliox-OS#readme)
- [Contributing guide](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/CONTRIBUTING.md)
- [Agent development guide](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/AGENT_DEVELOPMENT_GUIDE.md)
- [IPC message formats](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/IPC_MESSAGE_FORMATS.md)
- [Contact and support](https://www.helioxos.dev/contact)
