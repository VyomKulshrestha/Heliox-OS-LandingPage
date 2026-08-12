"""Validate the explicit search/grounding/training content policy."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SIGNAL = "search=yes, ai-input=yes, ai-train=no, use=reference"


def main() -> None:
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    policy = (ROOT / "ai-content-policy.md").read_text(encoding="utf-8")
    if f"Content-Signal: {SIGNAL}" not in robots or SIGNAL not in policy:
        raise SystemExit("robots and human policy do not share the same Content-Signal")
    if "does not revoke or modify the MIT license" not in policy:
        raise SystemExit("AI content policy lost the source-code license boundary")
    config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    global_rule = next(rule for rule in config["headers"] if rule["source"] == "/(.*)")
    if {"key": "Content-Signal", "value": SIGNAL} not in global_rule["headers"]:
        raise SystemExit("HTTP responses do not emit the declared Content-Signal")
    if "ai-content-policy.md" not in (ROOT / "llms.txt").read_text(encoding="utf-8"):
        raise SystemExit("agent index does not discover the content policy")
    print("Validated search and grounding opt-in, training opt-out, reference use, and MIT boundary.")


if __name__ == "__main__":
    main()
