"""Validate middleware-driven Markdown negotiation and cache separation."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EXPECTED = {
    "/": "/index.html.md",
    "/privacy.html": "/privacy.html.md",
    "/whitepaper.html": "/whitepaper.html.md",
    "/voice-control.html": "/voice-control.md",
    "/browser-app-control.html": "/browser-app-control.md",
    "/accessibility-hands-free.html": "/accessibility-hands-free.md",
    "/gesture-gaze-control.html": "/gesture-gaze-control.md",
    "/autonomous-workflows.html": "/autonomous-workflows.md",
    "/plugin-marketplace.html": "/plugin-marketplace.md",
    "/neural-research.html": "/neural-research.md",
    "/subscription-models.html": "/subscription-models.md",
    "/heliox-vs-windows-copilot.html": "/heliox-vs-windows-copilot.md",
    "/heliox-vs-open-interpreter.html": "/heliox-vs-open-interpreter.md",
    "/heliox-vs-traditional-automation.html": "/heliox-vs-traditional-automation.md",
    "/cost.html": "/cost.md",
    "/proof.html": "/proof.md",
}


def main() -> None:
    config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    if config.get("rewrites"):
        raise SystemExit("Markdown negotiation must run before filesystem routing")
    redirects = config.get("redirects", [])
    if not any(
        item.get("source") == "/index.html"
        and item.get("destination") == "/"
        and item.get("permanent") is True
        for item in redirects
    ):
        raise SystemExit("duplicate /index.html URL lacks a permanent canonical redirect")
    if not any(
        item.get("destination") == "https://www.helioxos.dev/:path*"
        and item.get("permanent") is True
        and {"type": "host", "value": "helioxos.dev"} in item.get("has", [])
        for item in redirects
    ):
        raise SystemExit("apex host lacks a permanent redirect to the canonical www host")

    middleware = (ROOT / "middleware.js").read_text(encoding="utf-8")
    route_pattern = re.compile(r'\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,?\s*\]')
    actual = dict(route_pattern.findall(middleware))
    if actual != EXPECTED:
        raise SystemExit(f"negotiated route map drifted: {actual.keys() ^ EXPECTED.keys()}")
    for source, destination in EXPECTED.items():
        target = ROOT / destination.lstrip("/")
        if not target.is_file():
            raise SystemExit(f"missing Markdown representation: {target.name}")

    if 'request.headers.get("accept")' not in middleware:
        raise SystemExit("middleware does not inspect the Accept header")
    if "return rewrite(url, { headers: rewrittenHeaders })" not in middleware:
        raise SystemExit("middleware does not rewrite Markdown requests")
    if 'headers.set("Link", link)' not in middleware:
        raise SystemExit("Markdown representations lack HTTP canonical links")
    if 'headers.set("X-Robots-Tag", "noindex, follow")' not in middleware:
        raise SystemExit("Vercel deployment aliases are not excluded from indexing")

    header_rules = config.get("headers", [])
    root_headers = next(rule["headers"] for rule in header_rules if rule["source"] == "/")
    html_headers = next(rule["headers"] for rule in header_rules if rule["source"] == "/(.*).html")
    vary = {"key": "Vary", "value": "Accept"}
    if vary not in root_headers or vary not in html_headers:
        raise SystemExit("negotiated routes must emit Vary: Accept")
    markdown_headers = next(rule["headers"] for rule in header_rules if rule["source"] == "/(.*).md")
    if {"key": "Content-Type", "value": "text/markdown; charset=utf-8"} not in markdown_headers:
        raise SystemExit("Markdown responses lack the correct content type")
    print(f"Validated content negotiation for {len(EXPECTED)} HTML routes.")


if __name__ == "__main__":
    main()
