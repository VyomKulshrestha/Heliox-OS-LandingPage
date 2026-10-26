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

Heliox handles built-in commands right away, without planning: "undo that", "what did you do today", "remind me tomorrow at 9 am to send the report", "set a timer for 10 minutes", "note that the plumber comes Tuesday", "focus for 45 minutes", "save this as my coding setup" and "do that every day at 9". Since v0.16.0 the list also covers "add call the bank to my list", "tell me when Chrome closes", "remind me every hour to stand up", "good morning", "log a workout", "what's 15 percent of 240", "what time is it in Tokyo", "what did I download today" and "why is my computer slow". Press Ctrl+K or say "what can I say?" to see every built-in command with examples. In the 26 October 2026 benchmark all 91 command-guide examples were handled in code, with zero model calls and zero actions executed. Focus sessions hold reminders and the daily brief but never hold approvals, results, errors or answers. Only everyday settings such as the activity timeline, clipboard history and the daily brief change by voice; security, gateway, approval and model settings do not. See [voice control](https://www.helioxos.dev/voice-control.md).

## Can Heliox OS keep a to-do list?

Yes, since v0.16.0. Say "add call the bank to my list", "what's on my list", "mark call the bank as done", "remove call the bank from my list" or "clear finished items". The list is kept on your computer, and open items show in the Today tab, the daily brief and the exported report. "Mark … as done" only answers when you name the list or an open item matches, so "mark this email as done" still goes to the planner. Repeating reminders work the same way: "remind me every hour to stand up" repeats, interval reminders skip 10 PM to 7 AM, and "remind me to submit my timesheet when I open Outlook" waits until that app comes to the front.

## Can Heliox tell me when something happens on my computer?

Yes, since v0.16.0. "Tell me when Chrome closes", "let me know when my download finishes", "tell me when the invoice shows up", "tell me when my battery is full" and "tell me when my computer calms down" each start a watcher. It checks every few seconds, tells you once when it happens and gives up after a day. Watchers only read process, battery, processor and Downloads-folder state; they never close, open or change anything, and a restart forgets them. "What are you watching for" lists them and "stop watching Chrome" ends one.

## Does Heliox keep my clipboard history?

Only if you turn it on ("turn on clipboard history" or Settings → Your data); it is off by default. When on, Heliox remembers the last 25 pieces of text you copied for up to eight hours, in memory only. The history is never written to disk or included in a backup, and a restart or turning it off forgets it. Nothing is kept while a password manager or a private browsing window is in front, and text that looks like a password, API key, token, private key or card number is never kept, saved as a snippet or read aloud. "What did I copy earlier" and "copy the second one back" use it; snippets such as "save that as my signature" are kept on the computer until you clear them.

## Does Heliox store the passwords it generates?

No. "Generate a password" makes one with the operating system's secure random source and puts it on the clipboard and nowhere else. It is not spoken, shown in the reply or chat, written to disk or kept in clipboard history.

## Can Heliox find my files or tell me what I downloaded?

Yes, since v0.16.0. "What did I download today" and "what was the last file I downloaded" list what arrived in your Downloads folder. "Where is my budget spreadsheet" looks through your own folders (Desktop, Documents, Downloads, Pictures, Music, Videos and OneDrive) a few levels deep for at most a few seconds and names the newest matches; it does not search inside code repositories, build output or caches. Heliox reads only folder listings and file dates and opens nothing. "Why is my computer slow", "what's using my memory" and "how much disk space do I have" read the processor, memory, disks and the biggest apps; closing anything is an ordinary request that still asks first.

## How do I see or delete what Heliox keeps?

Settings → Your data lists each personal store Heliox keeps on the computer (activity timeline, task receipts, undo copies, notes, reminders, voice shortcuts, setups, usage nudges, quiet hours, and since v0.16.0 the to-do list, habits, focus history, snippets, app reminders and focus distractions) with its size and a Clear button. Opt-in clipboard history is kept in memory only and never saved. Backups go to the Downloads folder and never include settings, the daemon token, API keys, the receipt signing key or undo copies. See the [privacy policy](https://www.helioxos.dev/privacy.html.md).

## How can I install or contribute?

Use https://github.com/VyomKulshrestha/Heliox-OS/releases for installers. Developers should start with the repository README and CONTRIBUTING guide.
