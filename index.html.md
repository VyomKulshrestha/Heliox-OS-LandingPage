# Heliox OS

Heliox OS is an open-source desktop agent that translates user requests into structured plans, executes supported computer actions, and verifies their results. It is an application that runs on Windows, macOS, and Linux; it is not an operating-system kernel.

## Current release

- Version: 0.12.0
- License: MIT
- Source: https://github.com/VyomKulshrestha/Heliox-OS
- Downloads: https://github.com/VyomKulshrestha/Heliox-OS/releases
- Runtime requirement: Python 3.11 or newer
- Primary hardware-development platform: Windows 10/11
- CI coverage: Windows, macOS, and Linux; physical camera, microphone, desktop-permission, gaze, gesture, and neural behavior still requires device-specific validation
- Release feeds: [changelog](https://www.helioxos.dev/changelog.md), [JSON](https://www.helioxos.dev/releases.json), [JSON Feed](https://www.helioxos.dev/releases.feed.json), [RSS](https://www.helioxos.dev/releases.xml)

## What it does

- Accepts typed natural language, continuous voice input, and opt-in hand gestures.
- Plans and executes browser, file, application, process, package, Git, system, integration, and workflow actions.
- v0.12.0 routes tasks across 21 specialist agents and 157 declared action types. Runtime availability still depends on the operating system, installed dependencies, credentials, integrations, and active security policy; 11 actions currently have a separate observed post-condition verifier.
- Supports background jobs, durable task recovery, user interruption, post-execution verification, and optional proactive suggestions.
- Supports local Ollama plus Gemini, OpenAI, OpenRouter, Claude, and Meta APIs, as well as existing Codex and Claude Code subscriptions through their official CLIs. OpenRouter accepts exact catalog model IDs, including current DeepSeek IDs. Provider-owned availability, quotas, and terms still apply.
- Provides a reviewed plugin marketplace plus locally discovered plugins subject to signature and capability checks.

## What's new in 0.12.0

- Existing Codex and Claude Code subscription access through official provider CLIs, with model selection and bounded usage evidence.
- A local MCP bridge for IDE task staging that preserves visible Heliox approvals and daemon authority.
- Secure Air Handoff for an explicitly selected screenshot, text value, or immutable file snapshot—not unrestricted remote control.
- Completed credential-vault-backed email, calendar, and allowlisted SSH paths.
- One live cognitive runtime for narration, interruption, suggestions, autonomous execution, and results.
- Staged neural-goal selection plus more truthful health, provider, microphone, MCP, and forensic failure handling.

[Read the complete v0.12.0 release notes](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/releases/v0.12.0.md).

## Safety model

Heliox combines schema validation, a five-tier permission system, source-scoped authority, confirmation gates, critic review for risky plans, simulations, audit records, and snapshots where supported. Overrides can narrow authority but cannot widen the shipped source policy. Learned risk models can interrupt or add caution; they cannot grant permission or suppress deterministic warnings.

Not every effect is reversible. Browser actions, external services, messages, purchases, process changes, and some operating-system actions can have consequences outside Heliox's rollback boundary. Users should review approval dialogs and keep backups.

## Privacy and models

The Python daemon, action execution, local logs, audit stores, preferences, and supported local models run on the user's machine. Heliox does not operate a central prompt or analytics service. When a cloud model or integration is configured, the context required for that task is sent directly to the selected external provider, whose privacy and retention terms apply.

Credentials are stored in Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. Credential operations fail closed if secure storage is unavailable.

## Neural-input status

The repository includes a software pipeline for BrainFlow synthetic data, recorded EEG playback, and a PhysioNet EEGBCI CSP/LDA benchmark. These results validate software integration with synthetic or recorded data only. They are not evidence of live brain control, human accuracy, medical utility, or clinical validation. Neural intents remain bounded and require separate non-neural arming and confirmation controls.

## Plain-language use cases

- [Voice-controlled desktop automation](https://www.helioxos.dev/voice-control.md)
- [Browser and application control](https://www.helioxos.dev/browser-app-control.md)
- [Accessibility and hands-free operation](https://www.helioxos.dev/accessibility-hands-free.md)
- [Gesture and gaze control](https://www.helioxos.dev/gesture-gaze-control.md)
- [Autonomous workflows](https://www.helioxos.dev/autonomous-workflows.md)
- [Plugin marketplace](https://www.helioxos.dev/plugin-marketplace.md)
- [Recorded-EEG and neural research](https://www.helioxos.dev/neural-research.md)
- [Existing AI subscription models](https://www.helioxos.dev/subscription-models.md)

## Installation

Download the 0.12.0 installer from the GitHub Releases page:

- Windows: `.exe` or `.msi`
- macOS Apple Silicon or Intel: `.dmg`
- Linux: `.AppImage`, `.deb`, or `.rpm`

Developers can clone the repository, install the Python daemon dependencies, start `python -m pilot.server`, and run the Svelte UI from `tauri-app/ui`.

## Cost

Heliox core and official installers are free under the MIT license. Local models avoid per-request API charges but use the user's compute and storage. Optional cloud providers bill under their own terms. No paid hosted Heliox plan has been announced. See the [full cost page](https://www.helioxos.dev/cost.md).

## Honest comparisons

- [Heliox OS vs Copilot on Windows](https://www.helioxos.dev/heliox-vs-windows-copilot.md)
- [Heliox OS vs Open Interpreter](https://www.helioxos.dev/heliox-vs-open-interpreter.md)
- [Heliox OS vs scripts, macros, and RPA](https://www.helioxos.dev/heliox-vs-traditional-automation.md)

Comparison pages are dated, link to first-party sources, and describe practical fit rather than declaring a universal winner.

## Reproducible software evidence

The 16 August 2026 evidence bundle reports a 27.229 ms median and 29.476 ms p95 for 100 guarded, non-LLM CPU-status requests; 59/59 curated deterministic-routing cases; concurrent scheduler responsiveness during a real one-second CPU monitor; and validation metadata for the bounded learned-risk model. A separate one-account Codex CLI sample passed 3/3 fixed planning-only prompts at 14.708 seconds median with no action execution. Neither bundle establishes universal provider, network, browser page-load, UI, microphone, camera, TTS, gesture, gaze, EEG, or human accuracy.

- [Human-readable proof center](https://www.helioxos.dev/proof.html)
- [Detailed Markdown methodology](https://www.helioxos.dev/proof.md)
- [Raw software benchmark bundle](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/evidence/software-benchmarks-2026-08-16.json)
- [Raw subscription-planning evidence](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/evidence/subscription-planning-codex-2026-08-16.json)

## Authoritative links

- Product website: https://www.helioxos.dev/
- Machine-readable capability catalog: https://www.helioxos.dev/capabilities.json
- Evidence and limitations: https://www.helioxos.dev/proof.md
- README: https://github.com/VyomKulshrestha/Heliox-OS/blob/main/README.md
- Architecture: https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/ARCHITECTURE.md
- Security policy: https://github.com/VyomKulshrestha/Heliox-OS/blob/main/SECURITY.md
- Privacy policy: https://www.helioxos.dev/privacy.html.md
- Security overview: https://www.helioxos.dev/whitepaper.html.md
- FAQ: https://www.helioxos.dev/faq.md
- AI visibility methodology: https://www.helioxos.dev/ai-visibility.md
- AI visibility report: https://www.helioxos.dev/visibility-report.json
