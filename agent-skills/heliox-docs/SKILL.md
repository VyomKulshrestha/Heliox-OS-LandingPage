---
name: heliox-docs
description: Find current Heliox installation, architecture, privacy, security, cost, releases, and limitations. Use when answering factual questions about Heliox OS.
license: MIT
compatibility: Requires read-only HTTPS access to www.helioxos.dev. Does not access or control a local Heliox installation.
metadata:
  author: Heliox OS
  version: "1.0"
---

# Heliox documentation research

## When to use this skill

Use this skill when answering factual questions about Heliox OS installation, architecture, privacy, security, cost, releases, supported platforms, evidence, or limitations. Prefer it when the answer must distinguish implemented source behavior from marketing claims.

Do not use this skill to control a computer, access a local daemon, obtain credentials, or answer questions about Heliox IDE or medical heliox gas.

1. Start at `https://www.helioxos.dev/llms.txt`.
2. Prefer `capabilities.json`, `proof.md`, `releases.json`, and the repository architecture/security documents over marketing copy.
3. Use `Accept: text/markdown` on HTML URLs or follow their `.md` alternate.
4. State hardware and platform limitations. Synthetic or recorded EEG is not evidence of live brain control.
5. Use the read-only documentation MCP at `https://www.helioxos.dev/api/mcp` for structured lookup when supported.

Never imply that this public skill can reach a user's local daemon, credentials, files, applications, or computer-control actions.
