"""Regression checks for date-only sitemap validation across time zones."""

import json
import unittest
from datetime import date, datetime, timedelta, timezone

from scripts.validate_site_metadata import ROOT, latest_calendar_date, validate_current_answers


class CurrentAnswerTests(unittest.TestCase):
    def setUp(self):
        self.markup = (ROOT / "what-is-heliox-os.html").read_text(encoding="utf-8")
        self.markdown = (ROOT / "what-is-heliox-os.md").read_text(encoding="utf-8")
        self.evidence = json.loads((ROOT / "benchmarks.json").read_text(encoding="utf-8"))
        self.releases = json.loads((ROOT / "releases.json").read_text(encoding="utf-8"))

    def check(self, markup=None, markdown=None):
        validate_current_answers(markup or self.markup, markdown or self.markdown, self.evidence, self.releases)

    def test_current_answers_match_sources(self):
        self.check()

    def test_stale_latency_is_rejected(self):
        current = f"{self.evidence['guarded_cpu_request']['steady_state']['median_ms']:.3f}"
        with self.assertRaisesRegex(ValueError, "stale or missing"):
            self.check(markup=self.markup.replace(current, "999.999"))

    def test_new_release_requires_answer_refresh(self):
        self.releases["releases"][0]["date"] = "2027-01-01"
        with self.assertRaisesRegex(ValueError, "stale or missing"):
            self.check()

    def test_invisible_or_markdown_only_drift_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "visible HTML and Markdown"):
            self.check(markdown=self.markdown.replace("zero model calls", "model calls"))

    def test_human_claim_boundary_is_required(self):
        with self.assertRaisesRegex(ValueError, "stale or missing"):
            self.check(markup=self.markup.replace("not proven improvement for real people", "proven improvement for real people"))


class SitemapDateTests(unittest.TestCase):
    def test_local_next_day_is_valid_on_utc_runner(self):
        now = datetime(2026, 10, 17, 19, 0, tzinfo=timezone.utc)
        self.assertEqual(latest_calendar_date(now), date(2026, 10, 18))
        self.assertGreater(date(2026, 10, 19), latest_calendar_date(now))

    def test_result_does_not_depend_on_runner_timezone(self):
        utc = datetime(2026, 10, 17, 9, 0, tzinfo=timezone.utc)
        local = utc.astimezone(timezone(timedelta(hours=5, minutes=30)))
        self.assertEqual(latest_calendar_date(utc), date(2026, 10, 17))
        self.assertEqual(latest_calendar_date(utc), latest_calendar_date(local))


if __name__ == "__main__":
    unittest.main()
