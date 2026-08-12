"""Validate the recurring AI visibility prompt pack and honest baseline report."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    pack = json.loads((ROOT / "visibility-prompts.json").read_text(encoding="utf-8"))
    report = json.loads((ROOT / "visibility-report.json").read_text(encoding="utf-8"))
    prompts = pack["prompts"]
    if len(prompts) != 30 or len({item["id"] for item in prompts}) != 30:
        raise SystemExit("visibility prompt pack must contain 30 unique prompts")
    if report["prompt_count"] != len(prompts) or not report["source_readiness"]["passed"]:
        raise SystemExit("visibility report is stale or source readiness failed")
    sampling = report["assistant_sampling"]
    if sampling["capture_count"] == 0 and sampling["status"] != "pending-real-responses":
        raise SystemExit("empty assistant sampling must remain explicitly pending")
    if sampling["capture_count"] != len(sampling["evaluations"]):
        raise SystemExit("assistant capture count drifted")
    print(f"Validated {len(prompts)} visibility prompts and honest sampling status: {sampling['status']}.")


if __name__ == "__main__":
    main()
