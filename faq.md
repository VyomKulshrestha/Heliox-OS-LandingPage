# Heliox OS Frequently Asked Questions

## What is Heliox OS?

Heliox OS is an MIT-licensed desktop automation agent. It converts typed, spoken, or gesture input into structured plans, executes supported actions, and verifies results. Despite its name, it is an application-layer agent rather than an operating-system kernel.

## Is Heliox OS the same product as Heliox IDE?

No. Heliox OS is the desktop automation agent published at `helioxos.dev` and `VyomKulshrestha/Heliox-OS`. Heliox IDE is a different project; its pages, repositories, features, platform support, and limitations do not describe Heliox OS. Heliox OS is also unrelated to heliox helium-oxygen medical gas. The [Heliox OS identity page](https://www.helioxos.dev/what-is-heliox-os.md) records the canonical identifiers. This is an identity boundary, not a product ranking.

## What does Heliox OS assistance co-adaptation do?

Heliox OS assistance co-adaptation is a desktop-software feature, unrelated to heliox medical gas or respiratory therapy. Since v0.14.0, an opt-in study inside Heliox OS's window tries presentation changes such as larger targets, a confirmation step, or a clarifying question within preferences the person sets. It requires purpose-specific consent and never approves or executes actions. The current evidence uses simulated tuning families, and does not establish an improvement for real people. See the [study documentation](https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/COADAPTATION.md) and [benchmark evidence](https://www.helioxos.dev/proof.html#coadaptation).

## Is Heliox OS free?

The source code and current releases are available under the MIT license. External model APIs, third-party integrations, network services, or optional hosted products can charge their own fees.

## Which platforms are supported?

Heliox provides Windows, macOS, and Linux release targets. Windows 10/11 is the primary hardware-development platform. CI exercises software paths on all three platforms, but operating-system permissions and camera, microphone, gaze, gesture, or neural features need testing on the target device.

## What are the most important current Heliox OS limitations?

Hardware-dependent input and output features require validation on the user's device. Operating-system permissions, packaging, and action availability can differ by platform. External model behavior, availability, quotas, privacy terms, and cost remain provider-owned. Software benchmarks do not establish universal hardware, provider, network, browser, UI, or human accuracy.

## Does Heliox work completely offline?

It can use local Ollama models and local execution components for supported workflows. Cloud model providers, integrations, web browsing, downloads, and other network actions require connectivity and send the necessary request data to the selected service.

## Can Heliox use DeepSeek through OpenRouter?

v0.12.0 and later support OpenRouter's OpenAI-compatible API and accept an exact OpenRouter catalog model ID. That lets a user select a currently available DeepSeek model without Heliox hard-coding every catalog entry. Availability, routing, pricing, retention, and model behavior remain governed by OpenRouter and the selected model provider.

## Can Heliox use my existing Codex or Claude Code subscription?

Yes, in v0.12.0 and later. Install and sign in through the official provider CLI, then select Existing AI subscription in Heliox. Heliox does not copy OAuth files and does not convert the plan into unlimited API access. Models, quotas, availability, and terms remain provider-owned; Heliox retains schema validation, policy, approvals, execution, and verification.

## Does Heliox collect telemetry?

The current release contains no first-party analytics or automatic crash-reporting service. It creates local logs and audit records for diagnosis and security. External providers and dependencies can have separate policies.

## Where are API keys stored?

Keys use Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. Heliox fails closed rather than falling back to insecure application storage when a secure credential service is unavailable.

## Can Heliox act autonomously?

Heliox supports background and proactive workflows, but autonomy is bounded by source-scoped permissions, deny lists, validation, approvals, audit records, and verification. The exact available actions depend on the platform, installed dependencies, credentials, and policy.

## Can Heliox control a computer through brain signals?

Not as a validated live product today. The repository contains synthetic BrainFlow and recorded PhysioNet EEGBCI software benchmarks. Those results do not establish live human accuracy, medical benefit, or brain-control reliability. Neural actions remain restricted and require non-neural safety controls.

## Is every action reversible?

No. Snapshots and rollback are used where a supported backend exists, and since v0.15.0 per-task undo can put back file, clipboard, environment-variable, volume and brightness changes that Heliox recorded. Emails, web form submissions, remote commands, MCP tool calls, shell commands, package changes and other system changes are never undoable. The approval dialog marks each action Can undo or Can't undo before it runs.

## How does undo work in Heliox OS?

Before Heliox writes, moves, copies or deletes a file, replaces the clipboard, sets an environment variable or changes the volume or brightness, it keeps what it needs to reverse that change. Each finished task shows Undo. The preview lists what will be put back, what you changed since (left alone, never overwritten) and what can never be undone, and Show what changed gives a line-by-line diff of each file. Undo is computed in code, never by a model, needs your click on the preview you saw, and is refused while a task runs. Saying "undo that" only opens the preview. Copies stay on your computer and are pruned after 7 days by default; clipboard text and earlier environment values are kept in memory only.

## What is a signed task receipt?

After every task that ran at least one action, Heliox writes a receipt of the request, each action and its target, whether you approved it, whether it ran and succeeded, and the outcome. Parameters and outputs appear only as SHA-256 hashes. Receipts are signed with an Ed25519 key that belongs to the computer and carry the hash of the previous receipt, so editing or removing one breaks the chain. Anyone can check an exported receipt with `python -m pilot.workflows.task_receipts verify receipt.json`. A receipt describes what happened; it never grants, approves or runs anything. When no signing key can be stored, receipts are written unsigned and say so.

## Does Heliox record what I do on my computer?

Only if you turn on the activity timeline, which is off by default. It records which app and window title were in front and when, never pixels or screen text, and it skips password managers and private or incognito windows. No model sees it: questions such as "what was I working on yesterday afternoon?" are answered in code. Data is deleted after 7 days by default, recording can be paused, and "forget my activity from the last hour" removes that stretch. The daily brief and usage nudges that build on it are also off by default.

## Can my phone run tasks on my computer?

Only if you turn on phone requests for a paired Air Handoff phone; they are off by default. The phone can send a short encrypted, signed request that waits on the computer until you press Run. If you also allow status checks to start right away, only a fixed read-only list (system status, file names and sizes, calendar events and git status) can start without you. The phone receives the short result and can never approve or deny anything.

## What can I say to Heliox OS besides tasks?

Since v0.15.0, Heliox handles built-in commands right away, without planning: "undo that", "what did you do today", "remind me tomorrow at 9 am to send the report", "set a timer for 10 minutes", "note that the plumber comes Tuesday", "focus for 45 minutes", "start a pomodoro", "save this as my coding setup" and "do that every day at 9". Press Ctrl+K or say "what can I say?" to see every built-in command with examples; a test runs each example as written. Focus sessions hold reminders and the daily brief but never hold approvals, results, errors or answers. Only everyday settings such as the activity timeline and the daily brief change by voice; security, gateway, approval and model settings do not. See [voice control](https://www.helioxos.dev/voice-control.md).

## How do I see or delete what Heliox keeps?

Settings → Your data lists each personal store Heliox keeps on the computer (activity timeline, task receipts, undo copies, notes, reminders, voice shortcuts, setups, usage nudges and quiet hours) with its size and a Clear button. Backups go to the Downloads folder and never include settings, the daemon token, API keys, the receipt signing key or undo copies. See the [privacy policy](https://www.helioxos.dev/privacy.html.md).

## How can I install or contribute?

Use https://github.com/VyomKulshrestha/Heliox-OS/releases for installers. Developers should start with the repository README and CONTRIBUTING guide.
