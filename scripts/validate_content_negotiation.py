"""Validate Vercel Accept-driven Markdown rewrites and cache separation."""

from __future__ import annotations

import json
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
    "/heliox-vs-windows-copilot.html": "/heliox-vs-windows-copilot.md",
    "/heliox-vs-open-interpreter.html": "/heliox-vs-open-interpreter.md",
    "/heliox-vs-traditional-automation.html": "/heliox-vs-traditional-automation.md",
    "/cost.html": "/cost.md",
}


def main() -> None:
    config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    rewrites = config.get("rewrites", [])
    actual = {item["source"]: item for item in rewrites}
    if set(actual) != set(EXPECTED):
        raise SystemExit(f"negotiated route set drifted: {set(actual) ^ set(EXPECTED)}")
    for source, destination in EXPECTED.items():
        item = actual[source]
        if item.get("destination") != destination:
            raise SystemExit(f"wrong Markdown destination for {source}")
        if item.get("has") != [
            {"type": "header", "key": "accept", "value": ".*text/markdown.*"}
        ]:
            raise SystemExit(f"{source} does not require Accept: text/markdown")
        target = ROOT / destination.lstrip("/")
        if not target.is_file():
            raise SystemExit(f"missing Markdown representation: {target.name}")

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
