# Use your existing AI subscription—without handing Heliox your login.

> Heliox can ask an officially authenticated Codex or Claude Code CLI to produce a text-only plan while keeping credentials, tools, approvals, execution, and verification inside their proper trust boundaries.

Status: **Released in v0.12.0; provider-dependent**

## What Heliox does

- Checks provider CLI availability and login status without reading or copying OAuth files.
- Lets the user choose a provider-owned model or keep the official CLI default.
- Runs the CLI as a text-only model helper in a sterile temporary directory with provider tools disabled or rejected.
- Shows Heliox prompt estimates and provider-reported input, cached input, uncached input, and output separately from metered API spend.

## Typical flow

1. Install the official Codex or Claude Code CLI and sign in with the provider.
2. Choose Existing AI subscription in Heliox Settings or first-run setup.
3. Select an available model or leave the provider default.
4. Submit a task; Heliox validates the returned plan and retains every policy, approval, execution, and verification gate.

## Safety boundary

A subscription is model access, not action authority. Heliox does not import provider credentials, rejects provider tool activity, and never lets a model approve or execute its own proposal.

## Known limitations

Availability, eligible plans, models, latency, and quotas are provider-owned. The published benchmark covers one Codex CLI account and three fixed planning-only prompts; it does not establish Claude behavior, action execution, or unlimited use.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
