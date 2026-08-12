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
