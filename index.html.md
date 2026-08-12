# Heliox OS

Heliox OS is an open-source desktop agent that translates user requests into structured plans, executes supported computer actions, and verifies their results. It is an application that runs on Windows, macOS, and Linux; it is not an operating-system kernel.

## Current release

- Version: 0.11.0
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
- Routes tasks across 21 specialist agents and 156 declared action types. Runtime availability depends on the operating system, installed dependencies, credentials, and active security policy.
- Supports background jobs, durable task recovery, user interruption, post-execution verification, and optional proactive suggestions.
- Supports local Ollama models and user-configured cloud providers including Gemini, OpenAI, Claude, and Meta.
- Provides a reviewed plugin marketplace plus locally discovered plugins subject to signature and capability checks.

## What's new in 0.11.0

- Coordinated continuous voice, interruption, suggestions, browser control, and application control.
- Bounded experience learning, temporal memory, strategy evolution, and optional JEPA-style prediction.
- 21 executable specialists with provider coverage for all 156 declared action types.
- Shared gaze, 3D gesture, and cursor control with temporal false-positive rejection.
- Guarded BrainFlow synthetic and recorded EEGBCI research workflows without a live brain-control claim.
- More truthful application launch, browser targeting, approval, cancellation, and final-result behavior.

[Read the complete v0.11.0 release notes](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/releases/v0.11.0.md).

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

## Installation

Download the 0.11.0 installer from the GitHub Releases page:

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
