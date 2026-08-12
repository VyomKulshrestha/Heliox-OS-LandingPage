"""Validate public agent discovery manifests and their safety boundary."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def load(path: str):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def main() -> None:
    mcp = load(".well-known/mcp.json")
    catalog = load(".well-known/api-catalog")
    skills = load(".well-known/agent-skills/index.json")
    openapi = load("openapi.json")
    if mcp["endpoint"] != "https://www.helioxos.dev/api/mcp" or not mcp["safety"]["read_only"]:
        raise SystemExit("MCP discovery does not preserve the public read-only boundary")
    if catalog["openapi"] != "https://www.helioxos.dev/openapi.json" or catalog["safety"]["computer_control"]:
        raise SystemExit("API catalog is missing or claims computer control")
    if len(skills["skills"]) != 2:
        raise SystemExit("agent skill discovery count drifted")
    for skill in skills["skills"]:
        skill_path = ROOT / skill["url"].removeprefix("https://www.helioxos.dev/")
        content = skill_path.read_text(encoding="utf-8")
        if f"name: {skill['name']}" not in content or "cannot" not in content.lower():
            raise SystemExit(f"invalid or unbounded public skill: {skill['name']}")
    if set(openapi["paths"]) != {"/capabilities.json", "/releases.json", "/api/mcp"}:
        raise SystemExit("OpenAPI path surface drifted")
    serialized = json.dumps([mcp, catalog, skills, openapi]).lower()
    for forbidden in ("localhost", "127.0.0.1", "credential_write", "execute_action"):
        if forbidden in serialized:
            raise SystemExit(f"public discovery leaks forbidden surface: {forbidden}")
    print("Validated MCP, API, OpenAPI, and two read-only Agent Skill discovery records.")


if __name__ == "__main__":
    main()
