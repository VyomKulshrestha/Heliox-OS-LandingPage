"""Validate published release feeds against the product-generated artifacts."""

from __future__ import annotations

import json
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PRODUCT = ROOT.parent / "cursor-os" / "pilot"


def main() -> None:
    names = ("changelog.md", "releases.json", "releases.feed.json", "releases.xml")
    if PRODUCT.is_dir():
        for name in names:
            if (ROOT / name).read_bytes() != (PRODUCT / name).read_bytes():
                raise SystemExit(f"website {name} drifted from product-generated source")
    releases = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))
    feed = json.loads((ROOT / "releases.feed.json").read_text(encoding="utf-8"))
    if releases["current_source_version"] != "0.13.0":
        raise SystemExit("current source version drifted")
    if releases["latest_published_version"] != "0.13.0":
        raise SystemExit("latest published version drifted")
    published = [item for item in releases["releases"] if item["status"] == "published"]
    if len(published) != len(feed["items"]):
        raise SystemExit("published release and feed item counts drifted")
    if len(ET.parse(ROOT / "releases.xml").findall("./channel/item")) != len(feed["items"]):
        raise SystemExit("RSS item count does not match JSON Feed")
    discovery = "\n".join(
        (ROOT / name).read_text(encoding="utf-8")
        for name in ("llms.txt", "index.html", "index.html.md", "sitemap.xml")
    )
    for name in names:
        if name not in discovery:
            raise SystemExit(f"public discovery files do not link {name}")
    print(f"Validated {len(feed['items'])} releases across Markdown, JSON, JSON Feed, and RSS.")


if __name__ == "__main__":
    main()
