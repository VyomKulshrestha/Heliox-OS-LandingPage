import { next, rewrite } from "@vercel/functions";

const CANONICAL_ORIGIN = "https://www.helioxos.dev";

export const MARKDOWN_ROUTES = new Map([
  ["/", "/index.html.md"],
  ["/privacy.html", "/privacy.html.md"],
  ["/whitepaper.html", "/whitepaper.html.md"],
  ["/voice-control.html", "/voice-control.md"],
  ["/browser-app-control.html", "/browser-app-control.md"],
  ["/accessibility-hands-free.html", "/accessibility-hands-free.md"],
  ["/gesture-gaze-control.html", "/gesture-gaze-control.md"],
  ["/autonomous-workflows.html", "/autonomous-workflows.md"],
  ["/plugin-marketplace.html", "/plugin-marketplace.md"],
  ["/neural-research.html", "/neural-research.md"],
  ["/heliox-vs-windows-copilot.html", "/heliox-vs-windows-copilot.md"],
  ["/heliox-vs-open-interpreter.html", "/heliox-vs-open-interpreter.md"],
  [
    "/heliox-vs-traditional-automation.html",
    "/heliox-vs-traditional-automation.md",
  ],
  ["/cost.html", "/cost.md"],
  ["/proof.html", "/proof.md"],
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

  const headers = discoveryHeaders(url);
  const destination = MARKDOWN_ROUTES.get(url.pathname);

  if (destination && acceptsMarkdown(request.headers.get("accept") ?? "")) {
    url.pathname = destination;
    const rewrittenHeaders = discoveryHeaders(url, destination);
    for (const [key, value] of headers) rewrittenHeaders.set(key, value);
    return rewrite(url, { headers: rewrittenHeaders });
  }

  return next({ headers });
}

// Keep this literal so Vercel can statically extract the middleware matchers.
export const config = {
  matcher: [
    "/index.html",
    "/",
    "/privacy.html",
    "/whitepaper.html",
    "/voice-control.html",
    "/browser-app-control.html",
    "/accessibility-hands-free.html",
    "/gesture-gaze-control.html",
    "/autonomous-workflows.html",
    "/plugin-marketplace.html",
    "/neural-research.html",
    "/heliox-vs-windows-copilot.html",
    "/heliox-vs-open-interpreter.html",
    "/heliox-vs-traditional-automation.html",
    "/cost.html",
    "/proof.html",
    "/index.html.md",
    "/privacy.html.md",
    "/whitepaper.html.md",
    "/voice-control.md",
    "/browser-app-control.md",
    "/accessibility-hands-free.md",
    "/gesture-gaze-control.md",
    "/autonomous-workflows.md",
    "/plugin-marketplace.md",
    "/neural-research.md",
    "/heliox-vs-windows-copilot.md",
    "/heliox-vs-open-interpreter.md",
    "/heliox-vs-traditional-automation.md",
    "/cost.md",
    "/proof.md",
  ],
};
