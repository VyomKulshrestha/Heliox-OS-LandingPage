"""Regression checks for date-only sitemap validation across time zones."""

import unittest
from datetime import date, datetime, timedelta, timezone

from scripts.validate_site_metadata import latest_calendar_date


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
