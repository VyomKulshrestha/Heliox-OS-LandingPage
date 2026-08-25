import assert from "node:assert/strict";
import test from "node:test";

import middleware, {
  acceptsMarkdown,
  config,
  MARKDOWN_CANONICALS,
  MARKDOWN_ROUTES,
} from "../middleware.js";

test("middleware matchers cover every negotiated route", () => {
  assert.deepEqual(config.matcher, ["/:path*"]);
});

test("clean developer and contact routes rewrite to HTML or Markdown", () => {
  const browserResponse = middleware(
    new Request("https://www.helioxos.dev/developers", { headers: { accept: "text/html" } }),
  );
  assert.equal(
    browserResponse.headers.get("x-middleware-rewrite"),
    "https://www.helioxos.dev/developers.html",
  );
  assert.match(browserResponse.headers.get("link"), /developers\.md/);

  const agentResponse = middleware(
    new Request("https://www.helioxos.dev/contact", { headers: { accept: "text/markdown" } }),
  );
  assert.equal(
    agentResponse.headers.get("x-middleware-rewrite"),
    "https://www.helioxos.dev/contact.md",
  );
});

test("unknown pages return a recoverable Markdown 404", async () => {
  const response = middleware(
    new Request("https://www.helioxos.dev/this-resource-does-not-exist"),
  );
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /^text\/markdown/);
  const body = await response.text();
  assert.match(body, /Developer portal/);
  assert.match(body, /llms\.txt/);
  assert.match(body, /sitemap\.xml/);
});

test("unknown API routes return RFC 9457 JSON", async () => {
  const response = middleware(
    new Request("https://www.helioxos.dev/api/v1/missing"),
  );
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /^application\/problem\+json/);
  const body = await response.json();
  assert.equal(body.code, "resource_not_found");
  assert.match(body.resolution, /openapi\.json/);
});

test("known static assets and API endpoints continue to routing", () => {
  for (const path of ["/assets/tailwind.generated.css", "/openapi.json", "/api/mcp", "/api/v1/status"]) {
    const response = middleware(new Request(`https://www.helioxos.dev${path}`));
    assert.equal(response.headers.get("x-middleware-next"), "1", path);
  }
});

test("Accept parsing recognizes usable Markdown media ranges", () => {
  assert.equal(acceptsMarkdown("text/markdown"), true);
  assert.equal(acceptsMarkdown("text/html, Text/Markdown; q=0.8"), true);
  assert.equal(acceptsMarkdown("text/markdown;q=0"), false);
  assert.equal(acceptsMarkdown("text/html, */*"), false);
});

test("Markdown requests rewrite before the static filesystem", () => {
  const response = middleware(
    new Request("https://www.helioxos.dev/cost.html?source=agent", {
      headers: { accept: "text/markdown, text/html;q=0.5" },
    }),
  );
  assert.equal(
    response.headers.get("x-middleware-rewrite"),
    "https://www.helioxos.dev/cost.md?source=agent",
  );
  assert.match(
    response.headers.get("link"),
    /<https:\/\/www\.helioxos\.dev\/cost\.html>; rel="canonical"/,
  );
});

test("ordinary browser requests continue to the HTML file", () => {
  const response = middleware(
    new Request("https://www.helioxos.dev/cost.html", {
      headers: { accept: "text/html" },
    }),
  );
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.equal(response.headers.has("x-middleware-rewrite"), false);
});

test("direct Markdown resources declare their HTML canonical", () => {
  const response = middleware(
    new Request("https://www.helioxos.dev/proof.md"),
  );
  assert.equal(response.headers.get("x-middleware-next"), "1");
  assert.match(
    response.headers.get("link"),
    /<https:\/\/www\.helioxos\.dev\/proof\.html>; rel="canonical"/,
  );
});

test("duplicate HTML and apex hosts redirect permanently", () => {
  const indexResponse = middleware(
    new Request("https://www.helioxos.dev/index.html?source=old"),
  );
  assert.equal(indexResponse.status, 308);
  assert.equal(
    indexResponse.headers.get("location"),
    "https://www.helioxos.dev/?source=old",
  );

  const apexResponse = middleware(
    new Request("https://helioxos.dev/proof.html?source=old"),
  );
  assert.equal(apexResponse.status, 308);
  assert.equal(
    apexResponse.headers.get("location"),
    "https://www.helioxos.dev/proof.html?source=old",
  );
});

test("Vercel deployment aliases cannot enter the search index", () => {
  const response = middleware(
    new Request("https://cursor-os-landing.vercel.app/proof.html"),
  );
  assert.equal(response.headers.get("x-robots-tag"), "noindex, follow");
});
