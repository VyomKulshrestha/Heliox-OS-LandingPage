# Heliox OS Frequently Asked Questions

## What is Heliox OS?

Heliox OS is an MIT-licensed desktop automation agent. It converts typed, spoken, or gesture input into structured plans, executes supported actions, and verifies results. Despite its name, it is an application-layer agent rather than an operating-system kernel.

## Is Heliox OS free?

The source code and current releases are available under the MIT license. External model APIs, third-party integrations, network services, or optional hosted products can charge their own fees.

## Which platforms are supported?

Heliox provides Windows, macOS, and Linux release targets. Windows 10/11 is the primary hardware-development platform. CI exercises software paths on all three platforms, but operating-system permissions and camera, microphone, gaze, gesture, or neural features need testing on the target device.

## Does Heliox work completely offline?

It can use local Ollama models and local execution components for supported workflows. Cloud model providers, integrations, web browsing, downloads, and other network actions require connectivity and send the necessary request data to the selected service.

## Can Heliox use DeepSeek through OpenRouter?

Current `main` supports OpenRouter's OpenAI-compatible API and accepts an exact OpenRouter catalog model ID. That lets a user select a currently available DeepSeek model without Heliox hard-coding every catalog entry. Availability, routing, pricing, retention, and model behavior remain governed by OpenRouter and the selected model provider. This source-only support is not part of the published v0.11.1 installer.

## Does Heliox collect telemetry?

The current release contains no first-party analytics or automatic crash-reporting service. It creates local logs and audit records for diagnosis and security. External providers and dependencies can have separate policies.

## Where are API keys stored?

Keys use Windows Credential Manager, macOS Keychain, or a Secret Service-compatible Linux keyring. Heliox fails closed rather than falling back to insecure application storage when a secure credential service is unavailable.

## Can Heliox act autonomously?

Heliox supports background and proactive workflows, but autonomy is bounded by source-scoped permissions, deny lists, validation, approvals, audit records, and verification. The exact available actions depend on the platform, installed dependencies, credentials, and policy.

## Can Heliox control a computer through brain signals?

Not as a validated live product today. The repository contains synthetic BrainFlow and recorded PhysioNet EEGBCI software benchmarks. Those results do not establish live human accuracy, medical benefit, or brain-control reliability. Neural actions remain restricted and require non-neural safety controls.

## Is every action reversible?

No. Snapshots and rollback are used where a supported backend exists, but external messages, browser actions, purchases, deleted remote data, and other irreversible effects may be outside that boundary.

## How can I install or contribute?

Use https://github.com/VyomKulshrestha/Heliox-OS/releases for installers. Developers should start with the repository README and CONTRIBUTING guide.
