# Heliox OS Privacy Policy

Effective October 24, 2026.

## Local-first execution

The Heliox daemon, action execution, permission checks, audit records, settings, learned preferences, and supported local speech or vision components run on the user's device. Heliox does not operate a central prompt or telemetry service.

Local-first does not mean every configured feature is offline. Network actions, integrations, model downloads, and cloud model providers communicate with their respective external services when the user enables or invokes them.

## External model providers

Users can configure providers such as Anthropic Claude, OpenAI, Google Gemini, OpenRouter, or Meta. OpenRouter can route a request to the exact catalog model ID the user selects, including current DeepSeek IDs. Prompts and the context needed for a requested task are sent directly from the device to the selected provider. Depending on the feature, that context can include user instructions, extracted screen text, screenshots, files, or action results. Heliox does not proxy those requests through a Heliox-operated server. The provider's privacy, retention, account, routing, and billing terms apply.

Heliox can also invoke an officially authenticated Codex or Claude Code CLI as a text-only planning helper. Heliox checks CLI status but does not read or copy provider OAuth files. Prompt context is still sent to the selected provider under that provider's account, retention, model-access, quota, and privacy terms. Provider tools are disabled or rejected; Heliox retains plan validation, policy, approvals, execution, and verification.

## Telemetry and local records

The current release contains no first-party analytics or automatic crash-reporting service. Local logs and audit databases exist for inspection and diagnosis and remain on the device unless the user exports or shares them. Operating systems, providers, integrations, registries, and dependencies can have separate telemetry policies outside Heliox's control.

## Credentials and sensors

Credentials are stored through Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. Heliox fails closed when secure credential storage is unavailable.

Camera, microphone, gaze, gesture, screen-supervision, and neural-research features are opt-in. They can create local runtime state or consented recordings as described by their settings. Users should review those controls before enabling always-on sensors.

## Undo copies, task receipts, and your day

Since v0.15.0, Heliox keeps the following personal stores on the user's computer. None of them is sent to a Heliox server, and no model reads the activity timeline, task receipts, or undo history to answer questions about your day.

- Undo copies: before Heliox writes, moves, copies or deletes a file, replaces the clipboard, sets an environment variable, or changes the volume or brightness, it keeps what it needs to reverse that change. Copies are pruned after 7 days by default and when they pass 2048 MB. Clipboard text and earlier environment-variable values are kept in memory only and are gone after a restart.
- Task receipts: an Ed25519-signed, hash-chained record of each task that ran actions. Parameters and outputs are stored only as SHA-256 hashes. The signing key is kept in the operating-system credential store, or in Heliox's private configuration folder where no credential store exists.
- Activity timeline (off by default): which app and window title were in front, and when. It never stores pixels or screen text, and it skips password managers and private or incognito windows. Data is deleted after 7 days by default. The daily brief and usage nudges, also off by default, read from it.
- Notes, reminders, voice shortcuts, saved app setups (app names only, without window titles or file names), usage nudges, and quiet hours.

Undo copies, receipts, and the timeline live in folders that Heliox actions may not read or change. Settings → Your data shows each store with its size and a Clear button, and "forget my activity from the last hour" removes that stretch of the timeline. Backups go to the Downloads folder and never include settings, the daemon token, API keys, the receipt signing key, or undo copies; the timeline is included only when the user ticks it.

Requests from a paired Air Handoff phone are off by default. A request waits on the computer for Run, the phone receives only the task's short encrypted result, and the phone can never approve or deny anything.

## Verification

The MIT-licensed source can be inspected at https://github.com/VyomKulshrestha/Heliox-OS. Implementation-specific security and data boundaries are documented in the repository's `SECURITY.md` and `docs/ARCHITECTURE.md` files.
