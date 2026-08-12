import assert from "node:assert/strict";
import test from "node:test";

import middleware, {
  acceptsMarkdown,
  config,
  MARKDOWN_ROUTES,
} from "../middleware.js";

test("middleware matchers cover every negotiated route", () => {
  assert.deepEqual(new Set(config.matcher), new Set(MARKDOWN_ROUTES.keys()));
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
