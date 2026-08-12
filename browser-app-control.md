# From intent to visible action.

> Heliox can open websites and installed applications, inspect supported browser interfaces, choose a likely target, act, and report what actually happened instead of declaring success after dispatch alone.

Status: **Implemented with platform limits**

## What Heliox does

- Opens URLs, navigates pages, and performs supported element-level browser actions.
- Resolves installed applications using platform-aware discovery rather than assuming an executable name.
- Uses the active task and visible context to disambiguate commands such as ‘click Launch’.
- Returns an explicit failure when the target is missing or the observed result does not match the plan.

## Typical flow

1. Describe the outcome, not an implementation detail.
2. Heliox selects a registered browser or application action.
3. Risky or consequential actions pause for approval.
4. A verifier or executor result determines the final status.

## Safety boundary

Sending messages, making purchases, changing accounts, and other external effects can be irreversible. Heliox keeps these actions inside permission and approval gates.

## Known limitations

Heliox does not understand every third-party interface. Dynamic pages, anti-bot controls, inaccessible elements, missing credentials, and unsupported applications can block execution.

## Verify the implementation

- [Machine-readable capability catalog](https://www.helioxos.dev/capabilities.json)
- [Evidence and limitations](https://www.helioxos.dev/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
