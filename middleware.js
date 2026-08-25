import { next, rewrite } from "@vercel/functions";

const CANONICAL_ORIGIN = "https://www.helioxos.dev";

export const MARKDOWN_ROUTES = new Map([
  ["/", "/index.html.md"],
  ["/developers", "/developers.md"],
  ["/contact", "/contact.md"],
  ["/privacy.html", "/privacy.html.md"],
  ["/whitepaper.html", "/whitepaper.html.md"],
  ["/voice-control.html", "/voice-control.md"],
  ["/browser-app-control.html", "/browser-app-control.md"],
  ["/accessibility-hands-free.html", "/accessibility-hands-free.md"],
  ["/gesture-gaze-control.html", "/gesture-gaze-control.md"],
  ["/autonomous-workflows.html", "/autonomous-workflows.md"],
  ["/plugin-marketplace.html", "/plugin-marketplace.md"],
  ["/neural-research.html", "/neural-research.md"],
  ["/subscription-models.html", "/subscription-models.md"],
  ["/heliox-vs-windows-copilot.html", "/heliox-vs-windows-copilot.md"],
  ["/heliox-vs-open-interpreter.html", "/heliox-vs-open-interpreter.md"],
  [
    "/heliox-vs-traditional-automation.html",
    "/heliox-vs-traditional-automation.md",
  ],
  ["/cost.html", "/cost.md"],
  ["/proof.html", "/proof.md"],
  ["/what-is-heliox-os.html", "/what-is-heliox-os.md"],
]);

const CLEAN_HTML_ROUTES = new Map([
  ["/developers", "/developers.html"],
  ["/contact", "/contact.html"],
]);

const CLEAN_REDIRECTS = new Map([
  ["/developers.html", "/developers"],
  ["/contact.html", "/contact"],
  ["/docs", "/developers"],
  ["/api", "/developers#public-api"],
]);

const PUBLIC_FILES = new Set([
  ...MARKDOWN_ROUTES.keys(),
  ...MARKDOWN_ROUTES.values(),
  "/index.html",
  "/privacy.html.md",
  "/whitepaper.html.md",
  "/faq.md",
  "/ai-visibility.md",
  "/ai-content-policy.md",
  "/changelog.md",
  "/capabilities.json",
  "/releases.json",
  "/releases.feed.json",
  "/releases.xml",
  "/openapi.json",
  "/visibility-prompts.json",
  "/visibility-report.json",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/e1bbf98753024b0c88eee0260a8d8401.txt",
  "/image.png",
  "/logo.png",
  "/script.js",
  "/style.css",
  "/content-page.css",
  "/scroll-world.js",
  "/scroll-world-bootstrap.js",
  "/scroll-world-init.js",
  "/.well-known/mcp.json",
  "/.well-known/api-catalog",
  "/.well-known/agent-skills/index.json",
  "/agent-skills/heliox-docs/SKILL.md",
  "/agent-skills/heliox-capability-research/SKILL.md",
  "/api/mcp",
  "/api/v1/status",
]);

export const MARKDOWN_CANONICALS = new Map(
  [...MARKDOWN_ROUTES].map(([htmlPath, markdownPath]) => [
    markdownPath,
    htmlPath,
  ]),
);

function canonicalLink(pathname) {
  const canonicalPath = MARKDOWN_CANONICALS.get(pathname);
  if (!canonicalPath) return null;
  return `<${new URL(canonicalPath, CANONICAL_ORIGIN)}>; rel="canonical", </llms.txt>; rel="describedby"`;
}

function discoveryHeaders(url, pathname = url.pathname) {
  const headers = new Headers();
  const link = canonicalLink(pathname);
  if (link) headers.set("Link", link);
  if (url.hostname.endsWith(".vercel.app")) {
    headers.set("X-Robots-Tag", "noindex, follow");
  }
  return headers;
}

export function acceptsMarkdown(acceptHeader = "") {
  return acceptHeader.split(",").some((range) => {
    const [mediaType, ...parameters] = range.split(";");
    if (mediaType.trim().toLowerCase() !== "text/markdown") return false;

    const quality = parameters
      .map((parameter) => parameter.trim().toLowerCase())
      .find((parameter) => parameter.startsWith("q="));
    return quality === undefined || Number.parseFloat(quality.slice(2)) > 0;
  });
}

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.hostname === "helioxos.dev") {
    return Response.redirect(
      new URL(`${url.pathname}${url.search}`, CANONICAL_ORIGIN),
      308,
    );
  }

  if (url.pathname === "/index.html") {
    return Response.redirect(new URL(`/${url.search}`, CANONICAL_ORIGIN), 308);
  }

  const cleanRedirect = CLEAN_REDIRECTS.get(url.pathname);
  if (cleanRedirect) {
    return Response.redirect(new URL(cleanRedirect, CANONICAL_ORIGIN), 308);
  }

  const headers = discoveryHeaders(url);
  const destination = MARKDOWN_ROUTES.get(url.pathname);

  if (destination && acceptsMarkdown(request.headers.get("accept") ?? "")) {
    url.pathname = destination;
    const rewrittenHeaders = discoveryHeaders(url, destination);
    for (const [key, value] of headers) rewrittenHeaders.set(key, value);
    return rewrite(url, { headers: rewrittenHeaders });
  }

  const htmlDestination = CLEAN_HTML_ROUTES.get(url.pathname);
  if (htmlDestination) {
    headers.set("Link", `<${new URL(MARKDOWN_ROUTES.get(url.pathname), CANONICAL_ORIGIN)}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`);
    headers.set("Vary", "Accept");
    url.pathname = htmlDestination;
    return rewrite(url, { headers });
  }

  const knownPath = PUBLIC_FILES.has(url.pathname) || url.pathname.startsWith("/assets/");
  if (!knownPath) {
    if (url.pathname.startsWith("/api/")) {
      const problem = {
        type: "https://www.helioxos.dev/developers#problem-resource_not_found",
        title: "API resource not found",
        status: 404,
        detail: "The requested Heliox OS public API route does not exist.",
        instance: url.pathname,
        code: "resource_not_found",
        resolution: "Use /api/v1/status, /api/mcp, or inspect /openapi.json and /developers.",
      };
      return new Response(request.method === "HEAD" ? null : JSON.stringify(problem), {
        status: 404,
        headers: {
          "Content-Type": "application/problem+json; charset=utf-8",
          Link: '</developers>; rel="help", </openapi.json>; rel="service-desc"',
          "Cache-Control": "no-store",
        },
      });
    }

    const body = `# 404 - Heliox OS resource not found\n\nThe requested path does not exist. Agents can recover through:\n\n- [Developer portal](/developers)\n- [Agent index](/llms.txt)\n- [OpenAPI description](/openapi.json)\n- [XML sitemap](/sitemap.xml)\n- [Product overview](/index.html.md)\n`;
    return new Response(request.method === "HEAD" ? null : body, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        Link: '</sitemap.xml>; rel="sitemap", </llms.txt>; rel="describedby", </developers>; rel="help"',
        "Cache-Control": "public, max-age=60",
      },
    });
  }

  return next({ headers });
}

// Keep this literal so Vercel can statically extract the middleware matchers.
export const config = {
  matcher: ["/:path*"],
};
