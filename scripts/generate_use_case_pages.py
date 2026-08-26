"""Generate paired HTML and Markdown use-case pages for Heliox OS."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://www.helioxos.dev"

PAGES = [
    {
        "slug": "voice-control",
        "eyebrow": "Voice-controlled desktop automation",
        "title": "Speak a task. Keep control.",
        "lede": "Heliox can turn opt-in voice input into the same typed, permission-checked action flow used by the desktop app—so speaking does not bypass planning, approvals, or verification.",
        "facts": ["Opt-in microphone", "Continuous listening available", "Same approval policy as text"],
        "does": [
            "Recognizes a wake phrase or an explicit listening session and converts speech to a command.",
            "Routes the command through Heliox's declared action registry and specialist agents.",
            "Keeps listening after a completed command when continuous mode remains enabled.",
            "Can speak status, interruption prompts, and results through the configured local or operating-system voice.",
            "Runs Pocket or Kokoro inference in a bounded worker process that is reused for a short speech burst, then exits so heavy model libraries are not retained by the control daemon.",
        ],
        "flow": ["Enable voice and select a microphone.", "Say the wake phrase and a concrete request.", "Review any required approval.", "Hear and read the verified result."],
        "safety": "Voice is an input channel, not extra authority. A spoken request cannot elevate permissions, accept its own approval, or remove a deterministic safety warning.",
        "limits": "Recognition quality and response time depend on the microphone, room, platform speech service, selected model, and requested action. Neural voice cold-start time depends on the host; the worker temporarily uses model memory while active. Physical capture and audible output must be tested on each device.",
        "status": "Implemented; hardware-dependent",
    },
    {
        "slug": "browser-app-control",
        "eyebrow": "Browser and application control",
        "title": "From intent to visible action.",
        "lede": "Heliox can open websites and installed applications, inspect supported browser interfaces, choose a likely target, act, and report what actually happened instead of declaring success after dispatch alone.",
        "facts": ["Browser + desktop actions", "Target resolution", "Postcondition checks"],
        "does": [
            "Opens URLs, navigates pages, and performs supported element-level browser actions.",
            "Resolves installed applications using platform-aware discovery rather than assuming an executable name.",
            "Uses the active task and visible context to disambiguate commands such as ‘click Launch’.",
            "Returns an explicit failure when the target is missing or the observed result does not match the plan.",
        ],
        "flow": ["Describe the outcome, not an implementation detail.", "Heliox selects a registered browser or application action.", "Risky or consequential actions pause for approval.", "A verifier or executor result determines the final status."],
        "safety": "Sending messages, making purchases, changing accounts, and other external effects can be irreversible. Heliox keeps these actions inside permission and approval gates.",
        "limits": "Heliox does not understand every third-party interface. Dynamic pages, anti-bot controls, inaccessible elements, missing credentials, and unsupported applications can block execution.",
        "status": "Implemented with platform limits",
    },
    {
        "slug": "accessibility-hands-free",
        "eyebrow": "Accessibility and hands-free operation",
        "title": "More ways to operate a computer.",
        "lede": "Voice, gesture, gaze-region signals, keyboard shortcuts, and ordinary text can be combined so a user is not forced into a single input method.",
        "facts": ["Multiple input modes", "Keyboard stop path", "Local camera processing"],
        "does": [
            "Supports voice commands for common desktop and browser workflows.",
            "Provides opt-in gesture cursor control and coarse gaze-region input.",
            "Preserves keyboard, pointer, and in-app stop controls when sensor features are enabled.",
            "Allows features to coexist without one sensor silently disabling another.",
        ],
        "flow": ["Choose only the input modes that help.", "Calibrate device-dependent gesture or gaze behavior.", "Keep a non-sensor stop method available.", "Review results in the visible activity history."],
        "safety": "Camera and microphone features are off until enabled, and their signals do not grant action authority. Emergency stop and approval controls remain separate from learned signals.",
        "limits": "Heliox is not certified assistive technology and should not be the only control path for safety-critical use. Individual accessibility needs and hardware accuracy require human evaluation.",
        "status": "Research-grade accessibility support",
    },
    {
        "slug": "gesture-gaze-control",
        "eyebrow": "Gesture and gaze control",
        "title": "On-device visual intent, bounded by safety.",
        "lede": "The camera pipeline derives hand gestures and a coarse gaze region on the user's device. It combines temporal and spatial checks to reduce face-driven and single-frame false positives.",
        "facts": ["On-device inference", "Temporal confirmation", "Coarse gaze regions"],
        "does": [
            "Tracks hand landmarks and uses depth-aware geometry for supported gesture labels.",
            "Requires stable evidence across frames before emitting consequential gesture events.",
            "Rejects candidates without a valid hand and applies face-exclusion checks.",
            "Publishes only a coarse gaze label and confidence; camera frames are not sent to Heliox's daemon.",
        ],
        "flow": ["Start the camera and confirm the preview.", "Allow the model to acquire a hand or face.", "Hold a supported gesture long enough for temporal confirmation.", "Use a non-camera control to stop or approve when required."],
        "safety": "A gesture may respond to an already-pending approval only under the configured policy. Gaze remains a fusion signal and cannot authorize an action by itself.",
        "limits": "Lighting, camera placement, occlusion, skin visibility, motion blur, and model availability affect accuracy. Software tests do not prove performance on a user's physical camera.",
        "status": "Implemented; calibration required",
    },
    {
        "slug": "autonomous-workflows",
        "eyebrow": "Autonomous workflows",
        "title": "Long-running work without unlimited authority.",
        "lede": "Heliox can plan multi-step work, run independent actions, recover durable tasks, and offer a next step—while keeping high-risk or irreversible effects behind supervision.",
        "facts": ["Durable jobs", "Bounded parallelism", "Interruptible execution"],
        "does": [
            "Breaks a goal into registered actions and routes them to specialist agents.",
            "Runs independent work concurrently within configured resource and agent limits.",
            "Stores durable job state so supported tasks can recover after interruption.",
            "Uses narration, proactive suggestions, and learned risk as advisory companion signals.",
        ],
        "flow": ["State an outcome and relevant constraints.", "Inspect the plan when supervision is required.", "Approve only the gated action—not a blanket future authority.", "Review verified outputs and optional next-step suggestions."],
        "safety": "Autonomy is bounded by source policy, credentials, permission tiers, approvals, timeouts, and stop controls. Learned models may increase caution but cannot grant permission.",
        "limits": "Not every task can recover cleanly, and not every external effect is reversible. Model quality, provider latency, application support, and missing context can still cause a plan to fail.",
        "status": "Implemented with bounded autonomy",
    },
    {
        "slug": "plugin-marketplace",
        "eyebrow": "Plugin marketplace",
        "title": "Extend Heliox without hiding trust decisions.",
        "lede": "Plugins add actions and integrations through declared manifests. The public marketplace is repository-governed so a submission can be reviewed, tested, and distributed without rebuilding the desktop application for every listing change.",
        "facts": ["Manifest-declared capabilities", "Hash verification", "Repository moderation"],
        "does": [
            "Lists approved marketplace packages from a versioned public catalog.",
            "Verifies package files against approved SHA-256 metadata during installation.",
            "Shows requested capabilities before the plugin becomes active.",
            "Allows contributors to propose marketplace entries through a reviewed pull request.",
        ],
        "flow": ["Author a plugin and its manifest.", "Submit the package metadata through the marketplace contribution path.", "Pass automated validation and maintainer review.", "Users install the approved, integrity-checked package from the app."],
        "safety": "Marketplace approval does not make arbitrary plugin code harmless. Plugins remain constrained by declared capabilities and Heliox's runtime policy, and sensitive integrations still require user credentials.",
        "limits": "Platform dependencies, external API changes, revoked credentials, and plugin-specific bugs can prevent a listed integration from working. Availability is not a guarantee of every third-party service.",
        "status": "Implemented with moderated catalog",
    },
    {
        "slug": "neural-research",
        "eyebrow": "Heliox OS neural intent research",
        "title": "Synthetic and recorded EEG research—not validated live brain control.",
        "lede": "Heliox OS includes a bounded neural-intent research path for BrainFlow synthetic signals, recorded EEG playback, and the public PhysioNet EEGBCI motor-imagery dataset.",
        "facts": ["Synthetic signals", "Recorded EEG", "Non-neural arming required"],
        "does": [
            "Streams BrainFlow synthetic-board data through the neural ingestion contract.",
            "Replays recorded EEG so the classifier and action proposal pipeline can be tested deterministically.",
            "Benchmarks motor-imagery decoding with public EEGBCI data and an MNE CSP/LDA workflow.",
            "Maps a recognized neural intent only to a bounded proposal that still needs independent arming and confirmation.",
        ],
        "flow": ["Select synthetic or recorded input.", "Run preprocessing and a reproducible classifier benchmark.", "Map the result to a bounded Heliox intent proposal.", "Use a separate non-neural control to arm or confirm any action."],
        "safety": "A neural signal cannot self-arm, widen permissions, or directly control a dangerous physical action. The research path is not a medical device and has no clinical claim.",
        "limits": "Synthetic and recorded-data results are not evidence of live EEG accuracy, individual calibration, brain control, medical utility, or clinical validation. Physical hardware work remains unverified until tested with participants and an actual device.",
        "status": "Software-verified; no live EEG claim",
        "faq": [
            {
                "question": "Can Heliox OS be controlled by the brain today?",
                "answer": "Not as a validated live product. Heliox OS currently provides software-verified BrainFlow synthetic-board and recorded PhysioNet EEGBCI paths. A real headset, participant calibration, and human validation are still required before any live brain-control claim.",
            },
            {
                "question": "What neural or EEG evidence exists for Heliox OS?",
                "answer": "The public implementation covers synthetic signal ingestion, recorded EEG replay, and a reproducible motor-imagery CSP/LDA benchmark. These tests validate the software pipeline, not live EEG accuracy or medical utility.",
            },
            {
                "question": "Can a neural signal approve a dangerous Heliox action?",
                "answer": "No. Neural input can only propose a bounded intent. Independent non-neural arming, Heliox policy checks, and any required user approval remain mandatory.",
            },
        ],
    },
    {
        "slug": "subscription-models",
        "eyebrow": "Codex and Claude subscription model access",
        "title": "Use your existing AI subscription—without handing Heliox your login.",
        "lede": "Heliox can ask an officially authenticated Codex or Claude Code CLI to produce a text-only plan while keeping credentials, tools, approvals, execution, and verification inside their proper trust boundaries.",
        "facts": ["Official provider CLI", "Selectable provider model", "Bounded usage evidence"],
        "does": [
            "Checks provider CLI availability and login status without reading or copying OAuth files.",
            "Lets the user choose a provider-owned model or keep the official CLI default.",
            "Runs the CLI as a text-only model helper in a sterile temporary directory with provider tools disabled or rejected.",
            "Shows Heliox prompt estimates and provider-reported input, cached input, uncached input, and output separately from metered API spend.",
        ],
        "flow": [
            "Install the official Codex or Claude Code CLI and sign in with the provider.",
            "Choose Existing AI subscription in Heliox Settings or first-run setup.",
            "Select an available model or leave the provider default.",
            "Submit a task; Heliox validates the returned plan and retains every policy, approval, execution, and verification gate.",
        ],
        "safety": "A subscription is model access, not action authority. Heliox does not import provider credentials, rejects provider tool activity, and never lets a model approve or execute its own proposal.",
        "limits": "Availability, eligible plans, models, latency, and quotas are provider-owned. The published benchmark covers one Codex CLI account and three fixed planning-only prompts; it does not establish Claude behavior, action execution, or unlimited use.",
        "status": "Released in v0.12.0; provider-dependent",
    },
]


def render_markdown(page: dict[str, object]) -> str:
    bullets = lambda values: "\n".join(f"- {value}" for value in values)
    steps = "\n".join(f"{index}. {value}" for index, value in enumerate(page["flow"], 1))
    faq = ""
    if page.get("faq"):
        faq_items = "\n\n".join(
            f"### {item['question']}\n\n{item['answer']}" for item in page["faq"]
        )
        faq = f"\n\n## Neural intent FAQ\n\n{faq_items}"
    return f"""# {page['title']}

> {page['lede']}

Status: **{page['status']}**

## What Heliox does

{bullets(page['does'])}

## Typical flow

{steps}

## Safety boundary

{page['safety']}

## Known limitations

{page['limits']}{faq}

## Verify the implementation

- [Machine-readable capability catalog]({SITE}/capabilities.json)
- [Evidence and limitations]({SITE}/proof.md)
- [Source repository](https://github.com/VyomKulshrestha/Heliox-OS)

Heliox OS is MIT-licensed. [Download the current release](https://github.com/VyomKulshrestha/Heliox-OS/releases).
"""


def render_html(page: dict[str, object]) -> str:
    esc = lambda value: html.escape(str(value), quote=True)
    slug = esc(page["slug"])
    facts = "".join(f"<span>{esc(value)}</span>" for value in page["facts"])
    does = "".join(f"<li>{esc(value)}</li>" for value in page["does"])
    flow = "".join(f"<li>{esc(value)}</li>" for value in page["flow"])
    webpage = {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": page["title"],
            "description": page["lede"],
            "url": f"{SITE}/{slug}.html",
            "isPartOf": {"@type": "WebSite", "name": "Heliox OS", "url": f"{SITE}/"},
            "about": {"@type": "SoftwareApplication", "name": "Heliox OS", "operatingSystem": "Windows, macOS, Linux"},
        }
    structured_data: dict[str, object] = webpage
    faq_section = ""
    if page.get("faq"):
        webpage["about"] = {
            "@type": "SoftwareApplication",
            "@id": f"{SITE}/#software",
            "name": "Heliox OS",
            "alternateName": "Heliox",
            "operatingSystem": "Windows, macOS, Linux",
        }
        questions = [
            {
                "@type": "Question",
                "name": item["question"],
                "acceptedAnswer": {"@type": "Answer", "text": item["answer"]},
            }
            for item in page["faq"]
        ]
        webpage.pop("@context")
        structured_data = {
            "@context": "https://schema.org",
            "@graph": [
                webpage,
                {
                    "@type": "FAQPage",
                    "@id": f"{SITE}/{slug}.html#faq",
                    "mainEntity": questions,
                },
            ],
        }
        faq_html = (
            '<section class="grid" id="faq" aria-label="Neural intent questions">'
            + "".join(
                f'<article class="card wide"><h2>{esc(item["question"])}</h2>'
                f'<p>{esc(item["answer"])}</p></article>'
                for item in page["faq"]
            )
            + "</section>"
        )
        faq_section = f"    {faq_html}\n"
    structured = json.dumps(structured_data, ensure_ascii=False).replace("</", "<\\/")
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(page['eyebrow'])} | Heliox OS</title>
  <meta name="description" content="{esc(page['lede'])}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{SITE}/{slug}.html">
  <link rel="alternate" type="text/markdown" href="{SITE}/{slug}.md">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@500;700&amp;display=swap">
  <link rel="stylesheet" href="content-page.css">
  <script type="application/ld+json">{structured}</script>
</head>
<body>
  <nav class="site-nav"><div class="shell nav-inner">
    <a class="brand" href="/"><span>HELIOX</span> OS</a>
    <div class="nav-links"><a href="/capabilities.json">Capabilities</a><a href="/proof.md">Evidence</a><a href="https://github.com/VyomKulshrestha/Heliox-OS">GitHub</a><a class="sponsor" href="https://github.com/sponsors/VyomKulshrestha">Sponsor</a></div>
  </div></nav>
  <main class="shell">
    <div class="breadcrumb"><a href="/">Heliox OS</a> / Use cases / {esc(page['eyebrow'])}</div>
    <header class="hero">
      <div class="eyebrow">{esc(page['eyebrow'])}</div>
      <h1>{esc(page['title'])}</h1>
      <p class="lede">{esc(page['lede'])}</p>
      <div class="truth-strip">{facts}</div>
    </header>
    <section class="grid" aria-label="Capability details">
      <article class="card wide"><div class="status">{esc(page['status'])}</div><h2>What Heliox does</h2><ul>{does}</ul></article>
      <article class="card"><h2>Typical flow</h2><ol class="steps">{flow}</ol></article>
      <article class="card"><h2>Safety boundary</h2><p>{esc(page['safety'])}</p></article>
      <article class="card wide limit"><div class="status">Known limits</div><h2>Where this can fail</h2><p>{esc(page['limits'])}</p></article>
    </section>
{faq_section}    <section class="cta"><div><h2>Inspect the evidence</h2><p>Read generated coverage, measured latency, hardware boundaries, and known limitations.</p></div><a href="/proof.md">Open proof center</a></section>
  </main>
  <footer><div class="shell footer-inner"><span>Heliox OS · MIT licensed</span><span><a href="/{slug}.md">Markdown version</a> · <a href="/llms.txt">Agent index</a></span></div></footer>
</body>
</html>
"""


def main() -> None:
    for page in PAGES:
        slug = str(page["slug"])
        (ROOT / f"{slug}.md").write_text(render_markdown(page), encoding="utf-8", newline="\n")
        (ROOT / f"{slug}.html").write_text(render_html(page), encoding="utf-8", newline="\n")
    print(f"Generated {len(PAGES)} paired use-case pages.")


if __name__ == "__main__":
    main()
