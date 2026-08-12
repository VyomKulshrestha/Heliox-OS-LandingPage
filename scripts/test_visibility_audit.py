"""Unit contracts for real-response visibility scoring."""

from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path

SCRIPT = Path(__file__).with_name("run_visibility_audit.py")
SPEC = importlib.util.spec_from_file_location("run_visibility_audit", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class VisibilityAuditTests(unittest.TestCase):
    def test_hyphenated_expected_term_matches(self) -> None:
        prompt = {"id": "identity-01", "expected": ["open source"], "forbidden": []}
        result = MODULE.evaluate(
            prompt,
            {
                "assistant": "example",
                "response": "An open-source project.",
                "status": "completed",
                "citations": [],
            },
        )
        self.assertEqual(result["expected_term_coverage"], 1.0)

    def test_timeout_is_not_scored_as_success(self) -> None:
        prompt = {"id": "identity-01", "expected": ["agent"], "forbidden": []}
        result = MODULE.evaluate(
            prompt,
            {
                "assistant": "example",
                "status": "timed_out",
                "elapsed_seconds": 10,
                "error": "no answer",
            },
        )
        self.assertEqual(result["status"], "timed_out")
        self.assertNotIn("expected_term_coverage", result)
        self.assertTrue(result["needs_human_review"])


if __name__ == "__main__":
    unittest.main()
