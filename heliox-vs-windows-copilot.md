# Heliox OS vs Copilot on Windows

> Both accept conversational input, but they solve different problems: Heliox is an open-source execution system for registered desktop actions; Copilot on Windows is Microsoft's assistant with Windows-specific chat, vision, file, web, and settings-help experiences.

Last fact-checked: **2026-08-12**. Product capabilities and availability change; follow the linked first-party sources for current details.

## Side-by-side

| Criterion | Heliox OS | Copilot on Windows |
| --- | --- | --- |
| Primary role | Execute and verify registered desktop, browser, integration, and workflow actions. | Answer, inspect, search, view, and guide through Windows and Copilot experiences. |
| System changes | Can perform supported changes subject to Heliox permission tiers and approvals. | Microsoft documents PC Insights as informational: it cannot fix issues, make system changes, or run troubleshooting automatically. |
| Background operation | Supports bounded background jobs, durable recovery, monitoring, and user interruption. | Microsoft documents PC Insights as request-driven and says it does not monitor the device in the background. |
| Platforms | Windows, macOS, and Linux, with platform-specific action availability. | The compared Copilot app features are documented for Windows. |
| Source and license | Heliox core is public under the MIT license. | A Microsoft product and service; this comparison does not claim its implementation is open source. |
| Models and data path | Supports local Ollama or user-configured cloud providers; cloud use sends task context to that provider. | Uses Microsoft's Copilot service and account/privacy controls; individual data behavior depends on feature and settings. |
| Best fit | Users who want inspectable, extensible, cross-platform computer execution with explicit action policy. | Windows users who want an integrated Microsoft assistant for chat, voice, vision, files, web content, and guided settings help. |

## Practical choice

Choose Heliox when the goal is auditable execution across supported local actions and platforms. Choose Copilot on Windows when the goal is a Microsoft-integrated assistant and guidance experience. They can coexist; neither product's name implies universal computer control.

## Sources

- [Microsoft: Getting started with Copilot on Windows](https://support.microsoft.com/en-US/microsoft-copilot/getting-started-with-copilot-on-windows)
- [Microsoft: PC Insights capabilities and limits](https://support.microsoft.com/en-us/microsoft-copilot/pc-insights)
- [Heliox capability catalog](https://www.helioxos.dev/capabilities.json)
- [Heliox evidence and limitations](https://www.helioxos.dev/proof.md)

This page compares documented product scope, not every possible configuration, extension, preview, or future feature. Corrections can be proposed in the [Heliox repository](https://github.com/VyomKulshrestha/Heliox-OS).
