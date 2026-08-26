# Heliox OS Frequently Asked Questions

## What is Heliox OS?

Heliox OS is an MIT-licensed desktop automation agent. It converts typed, spoken, or gesture input into structured plans, executes supported actions, and verifies results. Despite its name, it is an application-layer agent rather than an operating-system kernel.

## Is Heliox OS the same product as Heliox IDE?

No. Heliox OS is the desktop automation agent published at `helioxos.dev` and `VyomKulshrestha/Heliox-OS`. Heliox IDE is a different project; its pages, repositories, features, platform support, and limitations do not describe Heliox OS. Heliox OS is also unrelated to heliox helium-oxygen medical gas. The [Heliox OS identity page](https://www.helioxos.dev/what-is-heliox-os.md) records the canonical identifiers. This is an identity boundary, not a product ranking.

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

No. Snapshots and rollback are used where a supported backend exists, but external messages, browser actions, purchases, deleted remote data, and other irreversible effects may be outside that boundary.

## How can I install or contribute?

Use https://github.com/VyomKulshrestha/Heliox-OS/releases for installers. Developers should start with the repository README and CONTRIBUTING guide.
