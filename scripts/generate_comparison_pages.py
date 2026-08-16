"""Generate dated, source-linked Heliox comparison pages."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.helioxos.dev"
VERIFIED = "2026-08-16"

PAGES = [
    {
        "slug": "heliox-vs-windows-copilot",
        "other": "Copilot on Windows",
        "title": "Heliox OS vs Copilot on Windows",
        "lede": "Both accept conversational input, but they solve different problems: Heliox is an open-source execution system for registered desktop actions; Copilot on Windows is Microsoft's assistant with Windows-specific chat, vision, file, web, and settings-help experiences.",
        "rows": [
            ("Primary role", "Execute and verify registered desktop, browser, integration, and workflow actions.", "Answer, inspect, search, view, and guide through Windows and Copilot experiences."),
            ("System changes", "Can perform supported changes subject to Heliox permission tiers and approvals.", "Microsoft documents PC Insights as informational: it cannot fix issues, make system changes, or run troubleshooting automatically."),
            ("Background operation", "Supports bounded background jobs, durable recovery, monitoring, and user interruption.", "Microsoft documents PC Insights as request-driven and says it does not monitor the device in the background."),
            ("Platforms", "Windows, macOS, and Linux, with platform-specific action availability.", "The compared Copilot app features are documented for Windows."),
            ("Source and license", "Heliox core is public under the MIT license.", "A Microsoft product and service; this comparison does not claim its implementation is open source."),
            ("Models and data path", "Supports local Ollama or user-configured cloud providers; cloud use sends task context to that provider.", "Uses Microsoft's Copilot service and account/privacy controls; individual data behavior depends on feature and settings."),
            ("Best fit", "Users who want inspectable, extensible, cross-platform computer execution with explicit action policy.", "Windows users who want an integrated Microsoft assistant for chat, voice, vision, files, web content, and guided settings help."),
        ],
        "verdict": "Choose Heliox when the goal is auditable execution across supported local actions and platforms. Choose Copilot on Windows when the goal is a Microsoft-integrated assistant and guidance experience. They can coexist; neither product's name implies universal computer control.",
        "sources": [
            ("Microsoft: Getting started with Copilot on Windows", "https://support.microsoft.com/en-US/microsoft-copilot/getting-started-with-copilot-on-windows"),
            ("Microsoft: PC Insights capabilities and limits", "https://support.microsoft.com/en-us/microsoft-copilot/pc-insights"),
            ("Heliox capability catalog", f"{SITE}/capabilities.json"),
            ("Heliox evidence and limitations", f"{SITE}/proof.md"),
        ],
    },
    {
        "slug": "heliox-vs-open-interpreter",
        "other": "Open Interpreter",
        "title": "Heliox OS vs Open Interpreter",
        "lede": "Both are open-source agents that can act on a computer. Current Open Interpreter emphasizes a coding-agent harness for low-cost models; Heliox emphasizes a multimodal desktop companion, a declared action registry, specialist routing, and policy-gated system automation.",
        "rows": [
            ("Primary role", "Published v0.12.0 desktop and browser automation through 157 declared action types and 21 executable specialists; only 11 actions currently have a separate observed post-condition verifier.", "A coding agent optimized for low-cost models, harness switching, exec, tools, and editor/client compatibility."),
            ("Execution shape", "Typed actions with declared permission tiers, approval requirements, provider ownership, and verification metadata.", "Commands inside native sandboxing plus MCP, skills, hooks, permissions, and computer-use QA tools."),
            ("Interaction modes", "Text, continuous voice, hand gestures, coarse gaze fusion, narration, and bounded proactive suggestions.", "The current official README centers its terminal/agent interfaces and computer-use QA skill; this page makes no claim about every external client."),
            ("Extensibility", "Specialist agents and reviewed plugin marketplace with manifest capabilities and verified package files.", "Shared AGENTS.md, .agents/skills, MCP, ACP, Codex exec protocol, and selectable harnesses."),
            ("Platforms", "Windows, macOS, and Linux; physical feature quality is device-specific.", "Officially documents native sandboxed commands on macOS, Linux, and Windows."),
            ("License", "MIT.", "Apache-2.0 in the current official repository."),
            ("Best fit", "A visual desktop companion with multiple input modes, explicit action policy, and user-facing workflow controls.", "Developers who want a portable coding-agent runtime, low-cost model harnesses, and terminal/editor integration."),
        ],
        "verdict": "Heliox is not presented as a replacement for a focused coding agent, and Open Interpreter is not reduced to its historical Python version. Pick the execution model and interface that match the job—or connect tools through shared protocols where practical.",
        "sources": [
            ("Open Interpreter: current official README", "https://github.com/openinterpreter/openinterpreter"),
            ("Heliox capability catalog", f"{SITE}/capabilities.json"),
            ("Heliox architecture", "https://github.com/VyomKulshrestha/Heliox-OS/blob/main/docs/ARCHITECTURE.md"),
            ("Heliox evidence and limitations", f"{SITE}/proof.md"),
        ],
    },
    {
        "slug": "heliox-vs-traditional-automation",
        "other": "Traditional automation",
        "title": "Heliox OS vs scripts, macros, and RPA",
        "lede": "Traditional automation is often the right answer. Heliox adds language-driven planning and cross-tool coordination when a fixed script is too rigid, but it also adds model uncertainty that deterministic automation avoids.",
        "rows": [
            ("Input", "Natural-language goals plus optional voice, gesture, gaze, and contextual follow-up.", "Explicit code, selectors, rules, macros, or recorded steps."),
            ("Behavior", "Selects from registered actions and adapts a plan to available context.", "Repeats a predefined procedure; behavior is predictable when inputs and environment stay stable."),
            ("Failure mode", "Can misunderstand intent, select a poor plan, or hit model/provider latency in addition to ordinary tool failures.", "Usually fails at a known step because an input, selector, dependency, or environment changed."),
            ("Verification", "Uses executor results and, for covered actions, independent postcondition verifiers; coverage is published.", "Uses whatever assertions, exit codes, tests, or human review the author designed."),
            ("Governance", "Central action registry, permission tiers, approvals, source policy, audit records, and bounded autonomy.", "Governance varies from a personal script to enterprise RPA controls and change management."),
            ("Maintenance", "Registry and integrations still require maintenance; language may absorb some variation but cannot eliminate drift.", "Selectors, APIs, dependencies, and business rules must be updated explicitly."),
            ("Best fit", "Variable, multi-application work where intent is easier to state than every step and supervision is acceptable.", "High-volume, stable, well-specified processes where repeatability and low variance matter most."),
        ],
        "verdict": "Use deterministic automation for stable high-volume procedures. Use Heliox for variable tasks that benefit from planning, explanation, and human interruption. A strong system often lets Heliox choose and supervise a proven script instead of regenerating every step.",
        "sources": [
            ("Heliox capability catalog", f"{SITE}/capabilities.json"),
            ("Heliox evidence and limitations", f"{SITE}/proof.md"),
            ("Heliox security overview", f"{SITE}/whitepaper.html.md"),
        ],
    },
]


def markdown_table(rows: list[tuple[str, str, str]], other: str) -> str:
    lines = [f"| Criterion | Heliox OS | {other} |", "| --- | --- | --- |"]
    lines.extend(f"| {criterion} | {heliox} | {competitor} |" for criterion, heliox, competitor in rows)
    return "\n".join(lines)


def render_markdown(page: dict[str, object]) -> str:
    sources = "\n".join(f"- [{label}]({url})" for label, url in page["sources"])
    return f"""# {page['title']}

> {page['lede']}

Last fact-checked: **{VERIFIED}**. Product capabilities and availability change; follow the linked first-party sources for current details.

## Side-by-side

{markdown_table(page['rows'], str(page['other']))}

## Practical choice

{page['verdict']}

## Sources

{sources}

This page compares documented product scope, not every possible configuration, extension, preview, or future feature. Corrections can be proposed in the [Heliox repository](https://github.com/VyomKulshrestha/Heliox-OS).
"""


def render_html(page: dict[str, object]) -> str:
    esc = lambda value: html.escape(str(value), quote=True)
    slug = esc(page["slug"])
    rows = "".join(
        f"<tr><th scope=\"row\">{esc(criterion)}</th><td>{esc(heliox)}</td><td>{esc(competitor)}</td></tr>"
        for criterion, heliox, competitor in page["rows"]
    )
    sources = "".join(f'<li><a href="{esc(url)}">{esc(label)}</a></li>' for label, url in page["sources"])
    structured = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page["title"],
            "description": page["lede"],
            "dateModified": VERIFIED,
            "url": f"{SITE}/{slug}.html",
            "isPartOf": {"@type": "WebSite", "name": "Heliox OS", "url": f"{SITE}/"},
        }
    ).replace("</", "<\\/")
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(page['title'])} | Honest comparison</title>
  <meta name="description" content="{esc(page['lede'])}"><meta name="robots" content="index, follow">
  <link rel="canonical" href="{SITE}/{slug}.html"><link rel="alternate" type="text/markdown" href="{SITE}/{slug}.md">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500;700&amp;display=swap"><link rel="stylesheet" href="content-page.css">
  <script type="application/ld+json">{structured}</script>
</head>
<body>
  <nav class="site-nav"><div class="shell nav-inner"><a class="brand" href="/"><span>HELIOX</span> OS</a><div class="nav-links"><a href="/capabilities.json">Capabilities</a><a href="/proof.md">Evidence</a><a href="https://github.com/VyomKulshrestha/Heliox-OS">GitHub</a><a class="sponsor" href="https://github.com/sponsors/VyomKulshrestha">Sponsor</a></div></div></nav>
  <main class="shell">
    <div class="breadcrumb"><a href="/">Heliox OS</a> / Comparisons / {esc(page['other'])}</div>
    <header class="hero"><div class="eyebrow">Honest comparison · verified {VERIFIED}</div><h1>{esc(page['title'])}</h1><p class="lede">{esc(page['lede'])}</p><div class="truth-strip"><span>First-party sources</span><span>Known differences</span><span>No universal-winner claim</span></div></header>
    <section class="grid">
      <article class="card wide"><h2>Side-by-side</h2><p>Scope and defaults matter more than feature-count marketing.</p><div class="table-wrap"><table><thead><tr><th>Criterion</th><th>Heliox OS</th><th>{esc(page['other'])}</th></tr></thead><tbody>{rows}</tbody></table></div></article>
      <article class="card wide"><div class="status">Practical choice</div><h2>Which one should you use?</h2><p>{esc(page['verdict'])}</p></article>
      <article class="card wide limit"><div class="status">Source boundary</div><h2>Verify the claims</h2><p>Products and previews change. These first-party links define the comparison:</p><ul class="source-list">{sources}</ul></article>
    </section>
  </main>
  <footer><div class="shell footer-inner"><span>Heliox OS · MIT licensed</span><span><a href="/{slug}.md">Markdown version</a> · <a href="/llms.txt">Agent index</a></span></div></footer>
</body></html>
"""


def main() -> None:
    for page in PAGES:
        slug = str(page["slug"])
        (ROOT / f"{slug}.html").write_text(render_html(page), encoding="utf-8", newline="\n")
        (ROOT / f"{slug}.md").write_text(render_markdown(page), encoding="utf-8", newline="\n")
    print(f"Generated {len(PAGES)} paired comparison pages.")


if __name__ == "__main__":
    main()
