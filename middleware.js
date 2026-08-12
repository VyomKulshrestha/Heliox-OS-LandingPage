import { next, rewrite } from "@vercel/functions";

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
  const destination = MARKDOWN_ROUTES.get(url.pathname);

  if (destination && acceptsMarkdown(request.headers.get("accept") ?? "")) {
    url.pathname = destination;
    return rewrite(url);
  }

  return next();
}

// Keep this literal so Vercel can statically extract the middleware matchers.
export const config = {
  matcher: [
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
  ],
};
