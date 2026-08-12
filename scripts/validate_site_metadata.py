"""Validate canonical discovery metadata and published-release claims."""

from __future__ import annotations

import json
import re
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    if '<link rel="canonical" href="https://www.helioxos.dev/"' not in html:
        raise SystemExit("canonical homepage link is missing")
    match = re.search(
        r'<script type="application/ld\+json">\s*(\{.*?\})\s*</script>',
        html,
        re.DOTALL,
    )
    if not match:
        raise SystemExit("JSON-LD graph is missing")
    graph = json.loads(match.group(1))["@graph"]
    software = next(item for item in graph if item["@type"] == "SoftwareApplication")
    if software["softwareVersion"] != "0.11.1":
        raise SystemExit("structured data must describe the latest published installer")
    if software["codeRepository"] != "https://github.com/VyomKulshrestha/Heliox-OS":
        raise SystemExit("canonical code repository drifted")
    if "Download v0.9.0" in html or "Heliox-OS_0.9.0_" in html:
        raise SystemExit("website still advertises the superseded installer")

    expected_counters = {
        "156": "156",
        "30": "30+",
        "21": "21",
    }
    for target, visible_value in expected_counters.items():
        pattern = rf'data-target="{target}"(?:\s+data-suffix="\+")?[^>]*>{re.escape(visible_value)}<'
        if not re.search(pattern, html):
            raise SystemExit(
                f"counter {target} must expose its real value without requiring JavaScript"
            )
    if re.search(r'class="[^"]*count-up[^"]*"[^>]*>0\+?<', html):
        raise SystemExit("crawler-visible counters must not render as zero")
    if "<!-- 10 Specialist Agents -->" in html:
        raise SystemExit("stale specialist count remains in homepage source")
    if 'href="proof.html"' not in html:
        raise SystemExit("homepage does not expose the human-readable evidence center")
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
        "11 independent post-condition verifiers",
        "production certificate remains pending",
        "recorded/synthetic EEG research",
    )
    for claim in required_proof_claims:
        if claim not in proof_html:
            raise SystemExit(f"evidence center is missing required claim: {claim}")

    releases = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))
    if releases["latest_published_version"] != software["softwareVersion"]:
        raise SystemExit("structured data and release feed disagree")

    sitemap = ET.parse(ROOT / "sitemap.xml")
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text for node in sitemap.findall("s:url/s:loc", namespace)]
    if len(urls) != len(set(urls)) or "https://www.helioxos.dev/" not in urls:
        raise SystemExit("sitemap contains duplicates or lacks the canonical homepage")
    print(f"Validated canonical metadata, release truth, and {len(urls)} sitemap URLs.")


if __name__ == "__main__":
    main()
