"""Fail when generated use-case pages or their discovery links drift."""

from __future__ import annotations

import sys

from generate_use_case_pages import PAGES, ROOT, render_html, render_markdown


def main() -> int:
    errors: list[str] = []
    slugs = [str(page["slug"]) for page in PAGES]
    if len(slugs) != 8 or len(set(slugs)) != len(slugs):
        errors.append("use-case registry must contain eight unique slugs")

    discovery = {
        "llms.txt": (ROOT / "llms.txt").read_text(encoding="utf-8"),
        "index.html": (ROOT / "index.html").read_text(encoding="utf-8"),
        "index.html.md": (ROOT / "index.html.md").read_text(encoding="utf-8"),
        "sitemap.xml": (ROOT / "sitemap.xml").read_text(encoding="utf-8"),
    }

    for page in PAGES:
        slug = str(page["slug"])
        html_path = ROOT / f"{slug}.html"
        markdown_path = ROOT / f"{slug}.md"
        if html_path.read_text(encoding="utf-8") != render_html(page):
            errors.append(f"stale generated HTML: {html_path.name}")
        if markdown_path.read_text(encoding="utf-8") != render_markdown(page):
            errors.append(f"stale generated Markdown: {markdown_path.name}")
        html_content = html_path.read_text(encoding="utf-8")
        required = [
            f'href="https://www.helioxos.dev/{slug}.html"',
            f'href="https://www.helioxos.dev/{slug}.md"',
            "Known limits",
            "Safety boundary",
        ]
        for marker in required:
            if marker not in html_content:
                errors.append(f"{html_path.name} missing {marker!r}")
        for name, content in discovery.items():
            expected = f"{slug}.html" if name in {"index.html", "sitemap.xml"} else f"{slug}.md"
            if expected not in content:
                errors.append(f"{name} does not discover {expected}")

    neural = (ROOT / "neural-research.md").read_text(encoding="utf-8").lower()
    for phrase in (
        "not evidence of live eeg",
        "not a medical device",
        "non-neural",
        "can heliox os be controlled by the brain today?",
        "brainflow",
        "physionet eegbci",
    ):
        if phrase not in neural:
            errors.append(f"neural evidence boundary missing: {phrase}")
    neural_html = (ROOT / "neural-research.html").read_text(encoding="utf-8")
    if '"@type": "FAQPage"' not in neural_html or 'id="faq"' not in neural_html:
        errors.append("neural research page must expose its evidence boundary as FAQ data")

    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors), file=sys.stderr)
        return 1
    print(f"Validated {len(PAGES)} paired use-case pages and discovery links.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
