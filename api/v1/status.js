import {
  PUBLIC_RATE_LIMIT,
  jsonResponse,
  problemResponse,
  takeRateLimit,
} from "../../lib/public-api.js";

const SITE = "https://www.helioxos.dev";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const rate = takeRateLimit(request);
    const commonHeaders = {
      ...rate.headers,
      "API-Version": "1",
      "Access-Control-Allow-Origin": SITE,
      Vary: "Accept, Origin",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...commonHeaders,
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "accept, content-type",
        },
      });
    }

    if (!rate.allowed) {
      return problemResponse({
        status: 429,
        code: "rate_limit_exceeded",
        title: "Public metadata rate limit exceeded",
        detail: "This runtime accepted 120 requests for this client during the current 60-second window.",
        instance: url.pathname,
        resolution: `Retry after ${rate.reset} seconds or use the cacheable static metadata files linked from the developer portal.`,
        headers: { ...commonHeaders, "Retry-After": String(rate.reset) },
      });
    }

    if (!new Set(["GET", "HEAD"]).has(request.method)) {
      return problemResponse({
        status: 405,
        code: "method_not_allowed",
        title: "Method not allowed",
        detail: "The public status endpoint is read-only.",
        instance: url.pathname,
        resolution: "Use GET or HEAD. See https://www.helioxos.dev/developers for examples.",
        headers: { ...commonHeaders, Allow: "GET, HEAD, OPTIONS" },
      });
    }

    const body = {
      name: "Heliox OS Public Metadata API",
      api_version: "v1",
      status: "ok",
      read_only: true,
      authentication: { required: false, api_keys_issued: false },
      rate_limit: PUBLIC_RATE_LIMIT,
      links: {
        developer_portal: `${SITE}/developers`,
        openapi: `${SITE}/openapi.json`,
        mcp_manifest: `${SITE}/.well-known/mcp.json`,
        mcp_endpoint: `${SITE}/api/mcp`,
        capabilities: `${SITE}/capabilities.json`,
        releases: `${SITE}/releases.json`,
      },
      claim_boundary:
        "Public endpoints expose documentation and product metadata only. They cannot access a user's local daemon, credentials, files, or computer-control actions.",
    };
    if (request.method === "HEAD") {
      return new Response(null, {
        status: 200,
        headers: { ...commonHeaders, "content-type": "application/json; charset=utf-8" },
      });
    }
    return jsonResponse(body, { headers: commonHeaders });
  },
};
