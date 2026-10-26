# Heliox OS

Heliox OS is an open-source desktop agent that translates user requests into structured plans, executes supported computer actions, and verifies their results. It is an application that runs on Windows, macOS, and Linux; it is not an operating-system kernel.

Name disambiguation: Heliox OS is the desktop-agent project at `helioxos.dev` and `VyomKulshrestha/Heliox-OS`. Heliox IDE is a different project; its pages, repositories, features, and limitations do not describe Heliox OS. Heliox OS is also unrelated to heliox helium-oxygen medical gas. See the canonical [Heliox OS identity page](https://www.helioxos.dev/what-is-heliox-os.md).

## Current release

- Version: 0.16.0 (To-dos, Watchers, Habits and Quick Answers, published 26 October 2026)
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
- v0.16.0 routes tasks across 21 specialist agents and 162 declared action types. Runtime availability still depends on the operating system, installed dependencies, credentials, integrations, and active security policy; 22 actions currently have a separate observed post-condition verifier and the other 140 rely on the executor result.
- The [capability explorer](https://www.helioxos.dev/#actions) lets people filter the canonical 162-action catalog by specialist and verification depth; agents can read the same source directly from [capabilities.json](https://www.helioxos.dev/capabilities.json).
- Supports background jobs, durable task recovery, user interruption, post-execution verification, and optional proactive suggestions.
- Keeps what it needs to undo file, clipboard, environment-variable, volume and brightness changes, and leaves a signed receipt for every task that ran actions.
- Answers all 91 built-in commands, such as to-dos, reminders, watchers, habits and quick answers, in code without a model.
- Supports local Ollama plus Gemini, OpenAI, OpenRouter, Claude, and Meta APIs, as well as existing Codex and Claude Code subscriptions through their official CLIs. OpenRouter accepts exact catalog model IDs, including current DeepSeek IDs. Provider-owned availability, quotas, and terms still apply.
- Provides a reviewed plugin marketplace plus locally discovered plugins subject to signature and capability checks.

## What's new in 0.16.0

- To-do list. "Add call the bank to my list", "what's on my list", "mark call the bank as done" and "clear finished items". Open items show in the Today tab, the daily brief and the exported report. "Mark this email as done" still goes to the planner, because "mark … as done" only answers when the list is named or an open item matches.
- Tell me when. "Tell me when Chrome closes", "let me know when my download finishes", "tell me when the invoice shows up", "tell me when my battery is full" and "tell me when my computer calms down". Watchers check every few seconds, say once what happened and give up after a day. They only read process, battery, processor and Downloads-folder state.
- Repeating and app reminders. "Remind me every hour to stand up", "remind me every weekday at 9 to check email" and "stop reminding me to stand up". Interval reminders skip 10 PM to 7 AM. "Remind me to submit my timesheet when I open Outlook" and "every time I open Slack, remind me to set my status" wait for that app to come to the front.
- Good morning and good night. "Good morning" gives the date, today's reminders, your list, habit streaks to keep and a nearly full drive or low battery. "Good night" sums up the day with focus time, finished to-dos and tomorrow's first reminder.
- Habits and focus history. "Log a workout", "I drank a glass of water", "how many workouts this week" and "what's my workout streak". "I did …" only logs habits you already track, so ordinary sentences are left alone. Focus sessions are logged, so "how long did I focus this week" has an answer.
- Quick answers and helpers. "What's 15 percent of 240", "convert 5 miles to km", "how many days until Christmas", "how long until 5 pm" and "what time is it in Tokyo" are worked out exactly; arithmetic is parsed, never run as code. "Generate a password" puts one on the clipboard and nowhere else. Coin flips, dice, random picks and a stopwatch need no model.
- Your files and this computer. "What did I download today", "what was the last file I downloaded" and "where is my budget spreadsheet" search your own folders for at most a few seconds, never inside code repositories. "Why is my computer slow", "what's using my memory" and "how much disk space do I have" read processor, memory, disks and the biggest apps; closing anything still asks first.
- Clipboard history, snippets and focus heads-ups. Opt-in clipboard history is kept in memory only and never keeps passwords, keys or private windows: "what did I copy earlier", "copy the second one back". "Save that as my signature" and "copy my signature" reuse text. "During focus, tell me if I open YouTube" gives one gentle heads-up per session and blocks nothing.

Watchers, the health check, the file finder and focus heads-ups only read. Closing an app, opening a file or anything else that changes the computer is an ordinary request with the usual approvals. Clipboard history stays off until you turn it on. v0.16.0 builds on v0.15.0's per-task undo, signed task receipts, opt-in activity timeline, focus sessions, routines, phone requests and Your data panel.

[Read the complete v0.16.0 release notes](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/releases/v0.16.0.md).

## Safety model

Heliox combines schema validation, a five-tier permission system, source-scoped authority, confirmation gates, critic review for risky plans, simulations, audit records, and snapshots where supported. Overrides can narrow authority but cannot widen the shipped source policy. Learned risk models can interrupt or add caution; they cannot grant permission or suppress deterministic warnings.

Not every effect is reversible. Browser actions, external services, messages, purchases, process changes, and some operating-system actions can have consequences outside Heliox's rollback boundary. Per-task undo restores only what Heliox recorded, re-checks each item right before restoring it, and never covers effects that leave the computer or system changes such as shell commands or package installs; the approval dialog marks each action Can undo or Can't undo. Users should review approval dialogs and keep backups.

## Privacy and models

The Python daemon, action execution, local logs, audit stores, preferences, and supported local models run on the user's machine. Heliox does not operate a central prompt or analytics service. When a cloud model or integration is configured, the context required for that task is sent directly to the selected external provider, whose privacy and retention terms apply.

Credentials are stored in Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. Credential operations fail closed if secure storage is unavailable.

Undo copies, task receipts, the opt-in activity timeline, notes, reminders, voice shortcuts, setups, usage nudges, quiet hours, the to-do list, habits, focus history, snippets and app reminders stay on the user's computer. Settings → Your data shows each store with a Clear button, and backups never include settings, tokens or keys. Opt-in clipboard history is kept in memory only, and a generated password goes to the clipboard and is never stored. See the [privacy policy](https://www.helioxos.dev/privacy.html.md).

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

Download the 0.16.0 installer from the GitHub Releases page:

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

Heliox OS assistance co-adaptation is a desktop-software study, unrelated to heliox medical gas. Its quick suite passed all three policy agency audits across two simulated tuning families. The adaptive engine does not beat the plain interface for every family. See the [simulation table and protocol](https://www.helioxos.dev/proof.md) and [raw local evidence mirror](https://www.helioxos.dev/benchmarks.json).

The 26 October 2026 v0.16.0 evidence bundle reports a 25.234 ms median and 26.930 ms p95 for 100 guarded, non-LLM CPU-status requests; 59/59 curated deterministic-routing cases at 0.026 ms median; 65 concurrent scheduler heartbeats with a 16.618 ms maximum gap during a real one-second CPU monitor; and validation metadata for the bounded learned-risk model. A new built-in command suite handled all 91 command-guide examples in code (91/91) at 1.384 ms median and 14.111 ms p95 per reply across 1,820 replies, with zero model calls and zero actions executed. It measures the control path with stand-ins for the clipboard, speech, the settings file and machine readings, not speech recognition, text-to-speech or end-to-end voice latency. A separate one-account Codex CLI sample passed 3/3 fixed planning-only prompts at 14.708 seconds median with no action execution. A real local Kokoro file-synthesis run measured 21.401 seconds cold and 0.138 seconds warm, retained zero Torch/CUDA modules in the parent, and released its worker after the idle window; it does not establish audible quality or universal latency. These bundles do not establish universal provider, network, browser page-load, UI, microphone, camera, gesture, gaze, EEG, or human accuracy.

- [Human-readable proof center](https://www.helioxos.dev/proof.html)
- [Detailed Markdown methodology](https://www.helioxos.dev/proof.md)
- [Raw v0.16.0 software benchmark bundle](https://raw.githubusercontent.com/VyomKulshrestha/Heliox-OS/main/docs/evidence/software-benchmarks-2026-10-26.json)
- [Raw local TTS process-isolation evidence](https://raw.githubusercontent.com/VyomKulshrestha/Heliox-OS/main/docs/evidence/local-tts-isolation-2026-08-27.json)
- Earlier v0.15.0 snapshot: [24 October 2026](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/evidence/software-benchmarks-2026-10-24.json)
- Earlier v0.14.0 snapshots: [18 October 2026](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/evidence/software-benchmarks-2026-10-18.json) and [16 October 2026](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/evidence/software-benchmarks-2026-10-16.json)
- [Raw subscription-planning evidence](https://raw.githubusercontent.com/VyomKulshrestha/Heliox-OS/main/docs/evidence/subscription-planning-codex-2026-08-16.json)

## Authoritative links

- Product website: https://www.helioxos.dev/
- Developer portal: https://www.helioxos.dev/developers
- Contact and support: https://www.helioxos.dev/contact
- Versioned public API status: https://www.helioxos.dev/api/v1/status
- OpenAPI description: https://www.helioxos.dev/openapi.json
- Identity and name disambiguation: https://www.helioxos.dev/what-is-heliox-os.md
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
