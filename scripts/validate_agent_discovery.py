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
    if (
        mcp["endpoint"] != "https://www.helioxos.dev/api/mcp"
        or not mcp["safety"]["read_only"]
        or mcp["protocol_version"] != "2025-11-25"
        or mcp["supported_protocol_versions"][0] != "2025-11-25"
        or "Accept: application/json, text/event-stream" not in mcp["instructions"]
    ):
        raise SystemExit("MCP discovery does not preserve the public read-only boundary")
    if (
        catalog["openapi"] != "https://www.helioxos.dev/openapi.json"
        or catalog["developer_portal"] != "https://www.helioxos.dev/developers"
        or catalog["safety"]["computer_control"]
    ):
        raise SystemExit("API catalog is missing or claims computer control")
    if len(skills["skills"]) != 2:
        raise SystemExit("agent skill discovery count drifted")
    for skill in skills["skills"]:
        skill_path = ROOT / skill["url"].removeprefix("https://www.helioxos.dev/")
        content = skill_path.read_text(encoding="utf-8")
        boundary = content.lower()
        if f"name: {skill['name']}" not in content or not (
            "cannot" in boundary or "never imply" in boundary
        ):
            raise SystemExit(f"invalid or unbounded public skill: {skill['name']}")
        if "## when to use this skill" not in boundary or "do not use" not in boundary:
            raise SystemExit(f"public skill lacks explicit when-to-use guidance: {skill['name']}")
    if set(openapi["paths"]) != {
        "/api/v1/status",
        "/capabilities.json",
        "/releases.json",
        "/api/mcp",
    }:
        raise SystemExit("OpenAPI path surface drifted")
    if openapi.get("x-versioning", {}).get("current_major") != "v1":
        raise SystemExit("OpenAPI does not declare the public versioning policy")
    problem = openapi["components"]["schemas"]["ProblemDetails"]
    required_problem_fields = {
        "type", "title", "status", "detail", "instance", "code", "resolution"
    }
    if not required_problem_fields.issubset(problem["required"]):
        raise SystemExit("RFC 9457 error schema lacks machine recovery fields")
    operation_ids = []
    for path, path_item in openapi["paths"].items():
        for method, operation in path_item.items():
            if method not in {"get", "post", "put", "patch", "delete"}:
                continue
            operation_id = operation.get("operationId")
            if not operation_id:
                raise SystemExit(f"OpenAPI operation lacks operationId: {method.upper()} {path}")
            operation_ids.append(operation_id)
            for status, response in operation.get("responses", {}).items():
                if status == "202":
                    continue
                if "$ref" not in response and not response.get("content"):
                    raise SystemExit(
                        f"OpenAPI response lacks a typed schema: {method.upper()} {path} {status}"
                    )
    if len(operation_ids) != len(set(operation_ids)):
        raise SystemExit("OpenAPI operationIds must be unique")
    developers = (ROOT / "developers.md").read_text(encoding="utf-8").lower()
    llms = (ROOT / "llms.txt").read_text(encoding="utf-8").lower()
    for requirement in (
        "## quickstart",
        "## versioning and deprecation",
        "## rate limits",
        "## mcp",
        "## local development and cli boundary",
        "application/problem+json",
    ):
        if requirement not in developers:
            raise SystemExit(f"developer portal is incomplete: {requirement}")
    if "## when to use heliox os" not in llms or "do not use" not in llms:
        raise SystemExit("llms.txt lacks explicit when-to-use guidance")
    serialized = json.dumps([mcp, catalog, skills, openapi]).lower()
    for forbidden in ("localhost", "127.0.0.1", "credential_write", "execute_action"):
        if forbidden in serialized:
            raise SystemExit(f"public discovery leaks forbidden surface: {forbidden}")
    print(f"Validated MCP, versioned API, typed OpenAPI, {len(operation_ids)} function-compatible operations, and two read-only Agent Skills.")


if __name__ == "__main__":
    main()
