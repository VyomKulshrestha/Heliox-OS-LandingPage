"""Validate canonical discovery metadata and published-release claims."""

from __future__ import annotations

import json
import re
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "style.css").read_text(encoding="utf-8")
    if (
        ".heliox-scroll-world.is-mounted .hworld-copy__actions a" not in css
        or ".heliox-scroll-world.is-mounted .hworld-footer a" not in css
        or "pointer-events: auto" not in css
    ):
        raise SystemExit("cinematic CTA and footer links must remain interactive")
    if '<link rel="canonical" href="https://www.helioxos.dev/"' not in html:
        raise SystemExit("canonical homepage link is missing")
    verification = re.search(
        r'<meta name="google-site-verification" content="([^"]+)"\s*/?>', html
    )
    if not verification or len(verification.group(1)) < 20:
        raise SystemExit("Google Search Console verification metadata is missing")
    match = re.search(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        html,
        re.DOTALL,
    )
    if not match:
        raise SystemExit("JSON-LD graph is missing")
    graph = json.loads(match.group(1))["@graph"]
    software = next(item for item in graph if item["@type"] == "SoftwareApplication")
    if software["softwareVersion"] != "0.12.0":
        raise SystemExit("structured data must describe the latest published installer")
    if software["codeRepository"] != "https://github.com/VyomKulshrestha/Heliox-OS":
        raise SystemExit("canonical code repository drifted")
    if "Download v0.9.0" in html or "Heliox-OS_0.9.0_" in html:
        raise SystemExit("website still advertises the superseded installer")
    if "cdn.tailwindcss.com" in html or "tailwind.config =" in html:
        raise SystemExit("homepage must use compiled CSS instead of the Tailwind runtime CDN")
    if 'fetchpriority="high"' not in html:
        raise SystemExit("above-fold cinematic poster must be prioritized")
    generated_css = ROOT / "assets" / "tailwind.generated.css"
    if 'href="assets/tailwind.generated.css?v=1"' not in html or not generated_css.exists():
        raise SystemExit("homepage compiled CSS asset is missing")
    if generated_css.stat().st_size < 20_000:
        raise SystemExit("compiled Tailwind CSS is unexpectedly incomplete")
    required_homepage_evidence = (
        'id="benchmarks"',
        "27.636 ms",
        "29.906 ms p95",
        "59 / 59",
        "66 ticks",
        "36k / 5.4k",
        "software-benchmarks-2026-08-21.json",
        "14.708 s median",
        "zero destructive actions",
        "audible TTS",
        "not population-level language accuracy",
    )
    for claim in required_homepage_evidence:
        if claim not in html:
            raise SystemExit(f"homepage is missing direct benchmark evidence: {claim}")
    benchmark_dataset = software.get("subjectOf", {})
    if benchmark_dataset.get("@type") != "Dataset":
        raise SystemExit("structured software metadata does not expose benchmark evidence")
    required_dataset_fields = {
        "@id",
        "name",
        "description",
        "url",
        "dateModified",
        "license",
        "creator",
        "measurementTechnique",
        "variableMeasured",
        "distribution",
    }
    if not required_dataset_fields.issubset(benchmark_dataset):
        missing = sorted(required_dataset_fields - set(benchmark_dataset))
        raise SystemExit(f"structured benchmark dataset is incomplete: {missing}")
    if benchmark_dataset["dateModified"] != software["dateModified"]:
        raise SystemExit("software and benchmark structured-data dates disagree")
    raw_evidence_prefix = (
        "https://raw.githubusercontent.com/VyomKulshrestha/Heliox-OS/main/"
        "docs/evidence/"
    )
    distributions = benchmark_dataset["distribution"]
    if not distributions or not all(
        item.get("contentUrl", "").startswith(raw_evidence_prefix)
        for item in distributions
    ):
        raise SystemExit("structured benchmark downloads must resolve to raw JSON")

    expected_counters = {
        "157": "157",
        "30": "30+",
        "21": "21",
    }
    for target, visible_value in expected_counters.items():
        pattern = rf'data-target="{target}"(?:\s+data-suffix="\+")?[^>]*>{re.escape(visible_value)}<'
        if not re.search(pattern, html):
            raise SystemExit(
                f"counter {target} must expose its real value without requiring JavaScript"
            )
    capabilities = json.loads((ROOT / "capabilities.json").read_text(encoding="utf-8"))
    if capabilities["summary"]["action_types"] != 157:
        raise SystemExit("current-source capability catalog is stale")
    if "157 action types" not in html or "11 actions" not in html:
        raise SystemExit("homepage does not state current release coverage and verification depth")
    overview = (ROOT / "index.html.md").read_text(encoding="utf-8")
    if "OpenRouter" not in overview or "DeepSeek" not in overview:
        raise SystemExit("agent-readable overview omits current model-provider support")
    if "capability explorer" not in overview or "capabilities.json" not in overview:
        raise SystemExit("agent-readable overview omits the capability explorer source")
    if re.search(r'class="[^"]*count-up[^"]*"[^>]*>0\+?<', html):
        raise SystemExit("crawler-visible counters must not render as zero")
    if "<!-- 10 Specialist Agents -->" in html:
        raise SystemExit("stale specialist count remains in homepage source")
    if 'href="proof.html"' not in html:
        raise SystemExit("homepage does not expose the human-readable evidence center")
    olud_page = "https://olud.ai/tool/vyomkulshrestha-heliox-os.html"
    olud_badge = "https://olud.ai/badge.php?tool=vyomkulshrestha-heliox-os"
    if olud_page not in html or olud_badge not in html:
        raise SystemExit("homepage does not expose the verified olud.ai listing badge")
    olud_fallback_contract = (
        'aria-label="View the Heliox OS listing on olud.ai"',
        'alt=""',
        'onerror="this.hidden=true; this.nextElementSibling.hidden=false;"',
        '<span class="olud-badge-fallback" hidden>OLUD listing &middot; badge unavailable</span>',
    )
    if not all(fragment in html for fragment in olud_fallback_contract):
        raise SystemExit("homepage olud.ai badge lacks its accessible local fallback")
    styles = (ROOT / "style.css").read_text(encoding="utf-8")
    if ".olud-badge-fallback:not([hidden])" not in styles:
        raise SystemExit("homepage olud.ai badge fallback styling is missing")

    scroll_init = (ROOT / "scroll-world-init.js").read_text(encoding="utf-8")
    scroll_bootstrap = (ROOT / "scroll-world-bootstrap.js").read_text(encoding="utf-8")
    if "document.addEventListener('DOMContentLoaded'" in scroll_init:
        raise SystemExit("cinematic hydration must not replace the server-rendered LCP on load")
    for event_name in ("wheel", "touchstart", "pointerdown", "keydown"):
        if f"'{event_name}'" not in scroll_init:
            raise SystemExit(f"cinematic hydration omits visitor intent event: {event_name}")
        if f"'{event_name}'" not in scroll_bootstrap:
            raise SystemExit(f"cinematic loader omits visitor intent event: {event_name}")
    if 'src="scroll-world.js' in html or 'src="scroll-world-init.js' in html:
        raise SystemExit("cinematic implementation scripts must not block first paint")
    if not re.search(r'src="scroll-world-bootstrap\.js(?:\?v=\d+)?"', html):
        raise SystemExit("intent-driven cinematic loader is missing")
    if "heliox-storm-agents" in html or "awakening-scene" in html:
        raise SystemExit("retired storm-sequence artwork remains in the homepage")
    if "Material+Symbols+Outlined:FILL@0..1" not in html or "icon_names=" not in html:
        raise SystemExit("Material Symbols must be restricted to the icons in use")
    if not re.search(
        r'<script defer src="scroll-world-bootstrap\.js(?:\?v=\d+)?"></script>',
        html,
    ):
        raise SystemExit("cinematic bootstrap must not block HTML parsing")
    comparison_pages = (
        "heliox-vs-windows-copilot.html",
        "heliox-vs-open-interpreter.html",
        "heliox-vs-traditional-automation.html",
    )
    if 'id="comparisons"' not in html or 'href="#comparisons"' not in html:
        raise SystemExit("homepage comparison pages are not directly navigable")
    for comparison in comparison_pages:
        if f'href="{comparison}"' not in html:
            raise SystemExit(f"homepage does not link comparison page: {comparison}")

    proof_html = (ROOT / "proof.html").read_text(encoding="utf-8")
    required_proof_claims = (
        '<link rel="canonical" href="https://www.helioxos.dev/proof.html">',
        '"dateModified":"2026-08-21"',
        "11 independent post-condition verifiers",
        "production certificate remains pending",
        "recorded/synthetic EEG research",
        "59/59 regression cases",
        "36,000 training and 5,400 temporal-validation samples",
        "software-benchmarks-2026-08-21.json",
        "subscription-planning-codex-2026-08-16.json",
        "3/3 fixed planning cases",
    )
    for claim in required_proof_claims:
        if claim not in proof_html:
            raise SystemExit(f"evidence center is missing required claim: {claim}")
    if "157 declared actions" not in proof_html or "146 rely" not in proof_html:
        raise SystemExit("human evidence center has stale current-source action evidence")

    proof_markdown = (ROOT / "proof.md").read_text(encoding="utf-8")
    required_markdown_claims = (
        "27.636",
        "29.906",
        "59/59",
        "66 ticks",
        "36,000",
        "5,400",
        "software-benchmarks-2026-08-21.json",
        "Human microphone accuracy is not a release gate",
        "audible quality and device output require a human check",
        "Physical accuracy is not established across cameras",
        "No live headset/human validation has established control accuracy",
    )
    for claim in required_markdown_claims:
        if claim not in proof_markdown:
            raise SystemExit(f"agent-readable proof is missing required claim: {claim}")

    releases = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))
    if releases["latest_published_version"] != software["softwareVersion"]:
        raise SystemExit("structured data and release feed disagree")

    sitemap = ET.parse(ROOT / "sitemap.xml")
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    entries = sitemap.findall("s:url", namespace)
    urls = [node.findtext("s:loc", namespaces=namespace) for node in entries]
    if len(urls) != len(set(urls)) or "https://www.helioxos.dev/" not in urls:
        raise SystemExit("sitemap contains duplicates or lacks the canonical homepage")
    last_modified = {
        node.findtext("s:loc", namespaces=namespace): node.findtext(
            "s:lastmod", namespaces=namespace
        )
        for node in entries
    }
    expected_last_modified = {
        "https://www.helioxos.dev/": "2026-08-21",
        "https://www.helioxos.dev/privacy.html": "2026-08-16",
        "https://www.helioxos.dev/heliox-vs-open-interpreter.html": "2026-08-16",
        "https://www.helioxos.dev/cost.html": "2026-08-16",
        "https://www.helioxos.dev/proof.html": "2026-08-21",
        "https://www.helioxos.dev/neural-research.html": "2026-08-21",
        "https://www.helioxos.dev/ai-visibility.md": "2026-08-21",
    }
    for url, expected_date in expected_last_modified.items():
        if last_modified.get(url) != expected_date:
            raise SystemExit(f"sitemap lastmod is stale for {url}")
    print(f"Validated canonical metadata, release truth, and {len(urls)} sitemap URLs.")


if __name__ == "__main__":
    main()
