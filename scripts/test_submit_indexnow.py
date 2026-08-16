"""Contract tests for IndexNow URL submission."""

from __future__ import annotations

import unittest

from scripts.submit_indexnow import HOST, KEY, KEY_LOCATION, build_payload, load_urls


class IndexNowSubmissionTests(unittest.TestCase):
    def test_sitemap_urls_are_canonical_and_unique(self) -> None:
        urls = load_urls()
        self.assertEqual(len(urls), 19)
        self.assertEqual(len(urls), len(set(urls)))
        self.assertTrue(all(url.startswith(f"https://{HOST}/") for url in urls))

    def test_payload_proves_host_ownership(self) -> None:
        urls = load_urls()
        payload = build_payload(urls)
        self.assertEqual(payload["host"], HOST)
        self.assertEqual(payload["key"], KEY)
        self.assertEqual(payload["keyLocation"], KEY_LOCATION)
        self.assertEqual(payload["urlList"], urls)


if __name__ == "__main__":
    unittest.main()
