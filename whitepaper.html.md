# Heliox OS Security Overview

Version 1.1, August 2026.

## Credential storage

Heliox stores API credentials through Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. It does not fall back to a machine-derived application vault when secure credential storage is unavailable. Secrets are redacted from application logs, but users remain responsible for their operating-system account and third-party providers.

## Execution controls

- Actions are classified from read-only through root-level risk.
- Higher-risk operations require confirmation.
- Interactive, autonomous, voice, gesture, background, and specialist sources have enforceable permission floors and deny lists.
- Per-task overrides can narrow but cannot widen source authority.
- Plans are schema-validated, and risky plans can receive critic review, simulation, learned-risk warnings, and explicit confirmation.
- Snapshots are used where a supported backend exists; a required snapshot fails closed when unavailable.

## External communication

When a user configures an external model or integration, the desktop daemon connects directly to that provider over its HTTPS API rather than through a Heliox-operated prompt proxy. The selected provider also governs transport, retention, authentication, regional processing, and availability. Local-only Ollama operation is available for supported models and tasks.

## Auditing

Heliox maintains local execution records and separate HMAC-SHA256 hash-chained audit stores for security-sensitive gateway and permission decisions. These records improve tamper detection but cannot make a compromised computer trustworthy.

## Known boundaries

Heliox is security-sensitive automation software, not a formally verified security boundary. Platform protections differ. The optional syscall guard is Linux-specific, desktop permissions require operating-system consent, external effects can be irreversible, and hardware-dependent features require testing on the user's device. Learned models can add caution but cannot remove deterministic warnings or grant authority.

## Reporting

Report vulnerabilities privately at https://github.com/VyomKulshrestha/Heliox-OS/security/advisories/new. Do not disclose an unpatched vulnerability in a public issue.
