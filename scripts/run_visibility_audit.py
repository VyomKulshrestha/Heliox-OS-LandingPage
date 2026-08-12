"""Audit Heliox source readiness and optional real assistant response captures."""

from __future__ import annotations

import argparse
import json
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
AUTHORITATIVE = ("llms.txt", "capabilities.json", "proof.md", "cost.md", "releases.json")


def load_jsonl(path: Path | None) -> list[dict]:
    if path is None:
        return []
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8-sig").splitlines()
        if line.strip()
    ]


def evaluate(prompt: dict, capture: dict) -> dict:
    response = str(capture.get("response", ""))
    lower = response.lower()
    expected = [term for term in prompt["expected"] if term.lower() in lower]
    forbidden = [term for term in prompt["forbidden"] if term.lower() in lower]
    citations = [str(url) for url in capture.get("citations", [])]
    heliox_citations = [url for url in citations if urlparse(url).netloc in {"www.helioxos.dev", "helioxos.dev", "github.com"}]
    return {
        "assistant": capture["assistant"],
        "prompt_id": prompt["id"],
        "captured_at": capture.get("captured_at"),
        "expected_term_coverage": round(len(expected) / max(len(prompt["expected"]), 1), 3),
        "expected_terms_found": expected,
        "forbidden_terms_found": forbidden,
        "citation_count": len(citations),
        "heliox_citation_count": len(heliox_citations),
        "competitors_shown": capture.get("competitors_shown", []),
        "needs_human_review": bool(forbidden) or len(expected) < len(prompt["expected"]),
    }


def audit(captures: list[dict]) -> dict:
    prompt_pack = json.loads((ROOT / "visibility-prompts.json").read_text(encoding="utf-8"))
    prompts = {item["id"]: item for item in prompt_pack["prompts"]}
    source_checks = []
    for name in AUTHORITATIVE:
        path = ROOT / name
        source_checks.append({"path": name, "exists": path.is_file(), "bytes": path.stat().st_size if path.is_file() else 0})
    evaluations = []
    for capture in captures:
        prompt = prompts.get(capture.get("prompt_id"))
        if prompt is None or not capture.get("assistant") or not capture.get("response"):
            raise SystemExit(f"invalid capture record: {capture}")
        evaluations.append(evaluate(prompt, capture))
    assistants = sorted({item["assistant"] for item in evaluations})
    return {
        "schema_version": 1,
        "audit_date": date.today().isoformat(),
        "prompt_count": len(prompts),
        "source_readiness": {"passed": all(item["exists"] and item["bytes"] > 0 for item in source_checks), "checks": source_checks},
        "assistant_sampling": {
            "status": "evaluated" if evaluations else "pending-real-responses",
            "assistants": assistants,
            "capture_count": len(evaluations),
            "evaluations": evaluations,
        },
        "interpretation": "Keyword scoring is a triage signal, not a factual judgment. Every flagged or high-impact answer requires human review.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--responses", type=Path, help="JSONL with assistant, prompt_id, response, citations, and competitors_shown")
    parser.add_argument("--output", type=Path, default=ROOT / "visibility-report.json")
    args = parser.parse_args()
    report = audit(load_jsonl(args.responses))
    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    print(f"Audited {report['prompt_count']} prompts; real response captures: {report['assistant_sampling']['capture_count']}")


if __name__ == "__main__":
    main()
