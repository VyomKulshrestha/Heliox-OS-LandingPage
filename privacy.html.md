# Heliox OS Privacy Policy

Effective August 12, 2026.

## Local-first execution

The Heliox daemon, action execution, permission checks, audit records, settings, learned preferences, and supported local speech or vision components run on the user's device. Heliox does not operate a central prompt or telemetry service.

Local-first does not mean every configured feature is offline. Network actions, integrations, model downloads, and cloud model providers communicate with their respective external services when the user enables or invokes them.

## External model providers

Users can configure providers such as Anthropic Claude, OpenAI, Google Gemini, or Meta. Prompts and the context needed for a requested task are sent directly from the device to the selected provider. Depending on the feature, that context can include user instructions, extracted screen text, screenshots, files, or action results. Heliox does not proxy those requests through a Heliox-operated server. The provider's privacy, retention, account, and billing terms apply.

## Telemetry and local records

The current release contains no first-party analytics or automatic crash-reporting service. Local logs and audit databases exist for inspection and diagnosis and remain on the device unless the user exports or shares them. Operating systems, providers, integrations, registries, and dependencies can have separate telemetry policies outside Heliox's control.

## Credentials and sensors

Credentials are stored through Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. Heliox fails closed when secure credential storage is unavailable.

Camera, microphone, gaze, gesture, screen-supervision, and neural-research features are opt-in. They can create local runtime state or consented recordings as described by their settings. Users should review those controls before enabling always-on sensors.

## Verification

The MIT-licensed source can be inspected at https://github.com/VyomKulshrestha/Heliox-OS. Implementation-specific security and data boundaries are documented in the repository's `SECURITY.md` and `docs/ARCHITECTURE.md` files.
