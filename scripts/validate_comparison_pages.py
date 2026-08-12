"""Validate comparison-page freshness, sourcing, and discovery."""

from __future__ import annotations

import sys

from generate_comparison_pages import PAGES, ROOT, VERIFIED, render_html, render_markdown


def main() -> int:
    errors: list[str] = []
    discovery = {
        "llms.txt": (ROOT / "llms.txt").read_text(encoding="utf-8"),
        "index.html": (ROOT / "index.html").read_text(encoding="utf-8"),
        "index.html.md": (ROOT / "index.html.md").read_text(encoding="utf-8"),
        "sitemap.xml": (ROOT / "sitemap.xml").read_text(encoding="utf-8"),
    }
    if len(PAGES) != 3:
        errors.append("comparison registry must contain three pages")

    for page in PAGES:
        slug = str(page["slug"])
        html_path = ROOT / f"{slug}.html"
        markdown_path = ROOT / f"{slug}.md"
        html_content = html_path.read_text(encoding="utf-8")
        markdown_content = markdown_path.read_text(encoding="utf-8")
        if html_content != render_html(page):
            errors.append(f"stale generated HTML: {html_path.name}")
        if markdown_content != render_markdown(page):
            errors.append(f"stale generated Markdown: {markdown_path.name}")
        if VERIFIED not in html_content or VERIFIED not in markdown_content:
            errors.append(f"missing fact-check date: {slug}")
        if len(page["sources"]) < 3:
            errors.append(f"not enough primary/evidence sources: {slug}")
        for _, url in page["sources"]:
            if str(url) not in html_content or str(url) not in markdown_content:
                errors.append(f"source missing from generated pair: {url}")
        for name, content in discovery.items():
            expected = f"{slug}.html" if name in {"index.html", "sitemap.xml"} else f"{slug}.md"
            if expected not in content:
                errors.append(f"{name} does not discover {expected}")

    copilot = (ROOT / "heliox-vs-windows-copilot.md").read_text(encoding="utf-8")
    if "PC Insights" not in copilot or "cannot fix issues" not in copilot:
        errors.append("Copilot comparison lost the feature-specific scope boundary")
    interpreter = (ROOT / "heliox-vs-open-interpreter.md").read_text(encoding="utf-8")
    if "current official repository" not in interpreter or "Apache-2.0" not in interpreter:
        errors.append("Open Interpreter comparison is not tied to the current implementation")

    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(PAGES)} dated comparison page pairs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
