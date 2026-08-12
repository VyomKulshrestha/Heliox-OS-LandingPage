"""Notify IndexNow participants about canonical Heliox website URLs."""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.request
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
HOST = "www.helioxos.dev"
ORIGIN = f"https://{HOST}"
KEY = "e1bbf98753024b0c88eee0260a8d8401"
KEY_LOCATION = f"{ORIGIN}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/indexnow"


def load_urls(sitemap_path: Path = ROOT / "sitemap.xml") -> list[str]:
    tree = ET.parse(sitemap_path)
    namespace = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text or "" for node in tree.findall("s:url/s:loc", namespace)]
    if not urls or len(urls) > 10_000:
        raise ValueError("sitemap must contain between 1 and 10,000 URLs")
    if len(urls) != len(set(urls)):
        raise ValueError("sitemap contains duplicate URLs")
    invalid = [url for url in urls if not url.startswith(f"{ORIGIN}/")]
    if invalid:
        raise ValueError(f"sitemap contains URLs outside {ORIGIN}: {invalid}")
    return urls


def build_payload(urls: list[str]) -> dict[str, object]:
    return {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }


def wait_for_public_key(timeout_seconds: int) -> None:
    deadline = time.monotonic() + timeout_seconds
    while True:
        try:
            with urllib.request.urlopen(KEY_LOCATION, timeout=15) as response:
                content = response.read().decode("utf-8").strip()
            if content == KEY:
                return
        except (OSError, UnicodeError, urllib.error.URLError):
            pass
        if time.monotonic() >= deadline:
            raise RuntimeError(f"IndexNow key is not available at {KEY_LOCATION}")
        time.sleep(min(5, max(0.1, deadline - time.monotonic())))


def submit(urls: list[str]) -> int:
    body = json.dumps(build_payload(urls), separators=(",", ":")).encode("utf-8")
    request = urllib.request.Request(
        ENDPOINT,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            status = response.status
    except urllib.error.HTTPError as exc:
        status = exc.code
    if status not in {200, 202}:
        raise RuntimeError(f"IndexNow rejected the URL batch with HTTP {status}")
    return status


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--wait-for-key-seconds", type=int, default=0)
    args = parser.parse_args()

    urls = load_urls()
    payload = build_payload(urls)
    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return

    wait_for_public_key(max(0, args.wait_for_key_seconds))
    status = submit(urls)
    print(f"IndexNow accepted {len(urls)} canonical URLs with HTTP {status}.")


if __name__ == "__main__":
    main()
