"""Audit Heliox source readiness and optional real assistant response captures."""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
AUTHORITATIVE = ("llms.txt", "capabilities.json", "proof.md", "cost.md", "releases.json")


def normalize(text: str) -> str:
    """Make punctuation and hyphenation irrelevant to simple term coverage."""
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def load_jsonl(path: Path | None) -> list[dict]:
    if path is None:
        return []
    return [
        json.loads(line)
        for line in path.read_text(encoding="utf-8-sig").splitlines()
        if line.strip()
    ]


def citation_url(citation: object) -> str:
    """Return a URL from either legacy strings or structured capture records."""
    if isinstance(citation, str):
        return citation
    if isinstance(citation, dict):
        return str(citation.get("url", ""))
    return ""


def evaluate(prompt: dict, capture: dict) -> dict:
    status = str(capture.get("status", "completed"))
    if status != "completed":
        return {
            "assistant": capture["assistant"],
            "prompt_id": prompt["id"],
            "captured_at": capture.get("captured_at"),
            "status": status,
            "elapsed_seconds": capture.get("elapsed_seconds"),
            "error": capture.get("error"),
            "needs_human_review": True,
        }
    response = str(capture.get("response", ""))
    normalized = normalize(response)
    expected = [term for term in prompt["expected"] if normalize(term) in normalized]
    forbidden = [term for term in prompt["forbidden"] if normalize(term) in normalized]
    citations = [
        url for citation in capture.get("citations", []) if (url := citation_url(citation))
    ]
    heliox_citations = [url for url in citations if urlparse(url).netloc in {"www.helioxos.dev", "helioxos.dev", "github.com"}]
    return {
        "assistant": capture["assistant"],
        "prompt_id": prompt["id"],
        "captured_at": capture.get("captured_at"),
        "status": "completed",
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
        if prompt is None or not capture.get("assistant"):
            raise SystemExit(f"invalid capture record: {capture}")
        if capture.get("status", "completed") == "completed" and not capture.get("response"):
            raise SystemExit(f"completed capture has no response: {capture}")
        evaluations.append(evaluate(prompt, capture))
    assistants = sorted({item["assistant"] for item in evaluations})
    completed = [item for item in evaluations if item["status"] == "completed"]
    return {
        "schema_version": 2,
        "audit_date": date.today().isoformat(),
        "authority": {
            "current_release": json.loads(
                (ROOT / "releases.json").read_text(encoding="utf-8")
            )["latest_published_version"],
            "canonical_site": "https://www.helioxos.dev/",
            "note": (
                "Assistant evaluations below are dated observations, not current product facts. "
                "Resolve conflicts against releases.json, capabilities.json, and proof.md."
            ),
        },
        "prompt_count": len(prompts),
        "source_readiness": {"passed": all(item["exists"] and item["bytes"] > 0 for item in source_checks), "checks": source_checks},
        "assistant_sampling": {
            "status": "evaluated" if evaluations else "pending-real-responses",
            "assistants": assistants,
            "capture_count": len(evaluations),
            "completed_count": len(completed),
            "incomplete_count": len(evaluations) - len(completed),
            "evaluations": evaluations,
        },
        "interpretation": "Keyword scoring is a triage signal, not a factual judgment. Every flagged or high-impact answer requires human review.",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--responses",
        type=Path,
        nargs="+",
        help="One or more JSONL files with assistant, prompt_id, response, citations, and competitors_shown",
    )
    parser.add_argument("--output", type=Path, default=ROOT / "visibility-report.json")
    args = parser.parse_args()
    captures = [
        capture
        for path in (args.responses or [])
        for capture in load_jsonl(path)
    ]
    report = audit(captures)
    args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")
    print(f"Audited {report['prompt_count']} prompts; real response captures: {report['assistant_sampling']['capture_count']}")


if __name__ == "__main__":
    main()
