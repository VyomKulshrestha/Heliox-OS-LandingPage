import assert from "node:assert/strict";
import test from "node:test";

import middleware, {
  acceptsMarkdown,
  config,
  MARKDOWN_CANONICALS,
  MARKDOWN_ROUTES,
} from "../middleware.js";

test("middleware matchers cover every negotiated route", () => {
  assert.deepEqual(
    new Set(config.matcher),
    new Set([
      "/index.html",
      ...MARKDOWN_ROUTES.keys(),
      ...MARKDOWN_CANONICALS.keys(),
    ]),
  );
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
