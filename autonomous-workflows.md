# Long-running work without unlimited authority.

> Heliox can plan multi-step work, run independent actions, recover durable tasks, and offer a next step—while keeping high-risk or irreversible effects behind supervision.

Status: **Implemented with bounded autonomy**

## What Heliox does

- Breaks a goal into registered actions and routes them to specialist agents.
- Runs independent work concurrently within configured resource and agent limits.
- Stores durable job state so supported tasks can recover after interruption.
- Uses narration, proactive suggestions, and learned risk as advisory companion signals.

## Typical flow

1. State an outcome and relevant constraints.
2. Inspect the plan when supervision is required.
3. Approve only the gated action—not a blanket future authority.
4. Review verified outputs and optional next-step suggestions.

## Safety boundary

Autonomy is bounded by source policy, credentials, permission tiers, approvals, timeouts, and stop controls. Learned models may increase caution but cannot grant permission.

## Known limitations

Not every task can recover cleanly, and not every external effect is reversible. Model quality, provider latency, application support, and missing context can still cause a plan to fail.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
