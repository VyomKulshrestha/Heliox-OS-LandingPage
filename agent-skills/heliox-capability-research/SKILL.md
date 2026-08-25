---
name: heliox-capability-research
description: Inspect Heliox action, permission, provider, platform, approval, and verification metadata. Use when evaluating whether a claimed Heliox capability is implemented.
license: MIT
compatibility: Requires read-only HTTPS access to www.helioxos.dev. Does not execute Heliox actions.
metadata:
  author: Heliox OS
  version: "1.0"
---

# Heliox capability research

## When to use this skill

Use this skill when checking whether an exact Heliox action is declared and when an answer needs its platform, permission tier, approval requirement, specialist provider, or independent post-condition verification depth.

Do not use this skill to execute an action, infer support from a similar label, or connect to a user's local Heliox daemon.

1. Read `https://www.helioxos.dev/capabilities.json` for the generated registry.
2. Match an exact `action_type`; do not infer execution support from a similar label.
3. Report platform declarations, permission tier, approval requirements, specialist provider, and verification method together.
4. If verification is `executor_result_only`, say that no independent postcondition verifier is declared.
5. Cross-check current limitations in `https://www.helioxos.dev/proof.md`.

This skill researches public metadata only. It cannot execute an action or connect to a user's Heliox daemon.
