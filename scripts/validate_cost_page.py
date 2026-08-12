"""Validate cost-page claims, discovery, and HTML/Markdown parity markers."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    html = (ROOT / "cost.html").read_text(encoding="utf-8")
    markdown = (ROOT / "cost.md").read_text(encoding="utf-8")
    common = ["MIT", "Ollama", "Kokoro", "Pocket TTS", "No paid hosted Heliox"]
    for marker in common:
        if marker not in html or marker not in markdown:
            raise SystemExit(f"cost page pair missing {marker!r}")
    for prohibited in ("unlimited", "always free", "all models included"):
        if prohibited in (html + markdown).lower():
            raise SystemExit(f"cost page contains misleading claim {prohibited!r}")
    discovery = ["llms.txt", "index.html", "index.html.md", "sitemap.xml"]
    for name in discovery:
        content = (ROOT / name).read_text(encoding="utf-8")
        expected = "cost.html" if name in {"index.html", "sitemap.xml"} else "cost.md"
        if expected not in content:
            raise SystemExit(f"{name} does not discover {expected}")
    print("Validated transparent cost page and discovery links.")


if __name__ == "__main__":
    main()
