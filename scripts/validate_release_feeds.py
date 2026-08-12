"""Validate published release feeds against the product-generated artifacts."""

from __future__ import annotations

import json
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PRODUCT = ROOT.parent / "cursor-os" / "pilot"


def main() -> None:
    names = ("changelog.md", "releases.json", "releases.feed.json", "releases.xml")
    for name in names:
        if (ROOT / name).read_bytes() != (PRODUCT / name).read_bytes():
            raise SystemExit(f"website {name} drifted from product-generated source")
    releases = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))
    feed = json.loads((ROOT / "releases.feed.json").read_text(encoding="utf-8"))
    if releases["current_version"] != "0.10.1" or len(releases["releases"]) != len(feed["items"]):
        raise SystemExit("release feed version or item count drifted")
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
