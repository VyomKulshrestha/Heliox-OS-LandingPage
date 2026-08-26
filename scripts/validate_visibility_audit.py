"""Validate the recurring AI visibility prompt pack and honest baseline report."""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    pack = json.loads((ROOT / "visibility-prompts.json").read_text(encoding="utf-8"))
    report = json.loads((ROOT / "visibility-report.json").read_text(encoding="utf-8"))
    authority = report.get("authority", {})
    if authority.get("current_release") != "0.13.0":
        raise SystemExit("visibility report lacks the current release authority")
    if authority.get("canonical_site") != "https://www.helioxos.dev/":
        raise SystemExit("visibility report lacks the canonical website authority")
    prompts = pack["prompts"]
    if len(prompts) != 40 or len({item["id"] for item in prompts}) != 40:
        raise SystemExit("visibility prompt pack must contain 40 unique prompts")
    benchmark_prompts = [item for item in prompts if item["category"] == "benchmarks"]
    if len(benchmark_prompts) != 6:
        raise SystemExit("visibility prompt pack must contain six benchmark prompts")
    prompts_by_id = {item["id"]: item for item in prompts}
    for prompt_id in ("platform-01", "limits-01"):
        if "Heliox IDE" not in prompts_by_id[prompt_id]["forbidden"]:
            raise SystemExit(f"{prompt_id} does not flag the known Heliox IDE collision")
    if (
        report["prompt_count"] != len(prompts)
        or not report["source_readiness"]["passed"]
    ):
        raise SystemExit("visibility report is stale or source readiness failed")
    sampling = report["assistant_sampling"]
    readiness_paths = {item["path"] for item in report["source_readiness"]["checks"]}
    if "what-is-heliox-os.md" not in readiness_paths:
        raise SystemExit("visibility report omits the canonical identity surface")
    if (
        sampling["capture_count"] == 0
        and sampling["status"] != "pending-real-responses"
    ):
        raise SystemExit("empty assistant sampling must remain explicitly pending")
    if sampling["capture_count"] != len(sampling["evaluations"]):
        raise SystemExit("assistant capture count drifted")
    completed = sum(item["status"] == "completed" for item in sampling["evaluations"])
    if sampling.get("completed_count", 0) != completed:
        raise SystemExit("completed assistant count drifted")
    if sampling.get("incomplete_count", 0) != sampling["capture_count"] - completed:
        raise SystemExit("incomplete assistant count drifted")

    capture_paths = sorted(
        (ROOT / "visibility-captures").glob(f"{report['audit_date']}*.jsonl")
    )
    if capture_paths:
        captures = [
            json.loads(line)
            for path in capture_paths
            for line in path.read_text(encoding="utf-8-sig").splitlines()
            if line.strip()
        ]
        if len(captures) != sampling["capture_count"]:
            raise SystemExit("dated raw captures do not match the generated report")
        prompt_text = {item["id"]: item["prompt"] for item in prompts}
        capture_keys = [
            (
                item.get("assistant"),
                item.get("prompt_id"),
                item.get("status", "completed"),
            )
            for item in captures
        ]
        if len(capture_keys) != len({key[:2] for key in capture_keys}):
            raise SystemExit(
                "dated raw captures contain duplicate assistant/prompt pairs"
            )
        for item in captures:
            prompt_id = item.get("prompt_id")
            if (
                prompt_id not in prompt_text
                or item.get("prompt") != prompt_text[prompt_id]
            ):
                raise SystemExit("dated raw capture does not match the prompt pack")
            if item.get("status", "completed") == "completed" and not item.get(
                "response"
            ):
                raise SystemExit("completed dated raw capture has no response")
        report_keys = [
            (
                item.get("assistant"),
                item.get("prompt_id"),
                item.get("status", "completed"),
            )
            for item in sampling["evaluations"]
        ]
        if Counter(capture_keys) != Counter(report_keys):
            raise SystemExit(
                "dated raw capture statuses drifted from the generated report"
            )
        if len(captures) >= len(prompts):
            assistant_counts = Counter(item["assistant"] for item in captures)
            if any(count != len(prompts) for count in assistant_counts.values()):
                raise SystemExit(
                    "full-pack sampling must include every prompt per assistant"
                )
    print(
        f"Validated {len(prompts)} visibility prompts and honest sampling status: {sampling['status']}."
    )


if __name__ == "__main__":
    main()
