# Heliox AI visibility audit

Heliox maintains a public pack of 35 recurring questions in [`visibility-prompts.json`](https://www.helioxos.dev/visibility-prompts.json). The pack checks identity, price, privacy, capabilities, multimodal input, neural claims, safety, plugins, comparisons, releases, platforms, software benchmarks, and limitations.

## What runs automatically

A monthly repository workflow verifies that the authoritative sources exist and that the prompt pack/report contracts remain valid. This is a free source-readiness check; it does **not** pretend to query external assistants.

## What requires real sampling

Responses from ChatGPT, Claude, Gemini, Copilot, Perplexity, or another assistant must be captured from a real session or authorized API call. Each JSONL record contains:

- `assistant`
- `prompt_id`
- `response`
- `captured_at`
- `citations`
- `competitors_shown`

Run `python scripts/run_visibility_audit.py --responses captures.jsonl`. The output records expected-term coverage, forbidden claims, citation coverage, competitors shown, and human-review flags. Keyword scoring is only triage; a human decides whether an answer is correct.

## 2026-08-12 baseline

Two fresh, signed-in web chats were tested without supplying Heliox source text:

- **Gemini:** completed the identity prompt, correctly described Heliox as an open-source desktop agent, separated repository facts from runtime claims, and cited the GitHub repository. It did not cite the canonical website.
- **ChatGPT:** found and began checking the website and GitHub repository, but did not complete a source-grounded answer within 110 seconds. The timeout is recorded as an incomplete attempt, not a successful mention.

The machine-readable evaluation is in [`visibility-report.json`](https://www.helioxos.dev/visibility-report.json), and the source capture is versioned under `visibility-captures/` in the website repository. These are single-session observations, not market-share or ranking statistics.

## Honesty boundary

No assistant is counted as tested based on the prompt pack alone. Completed answers and timeouts are recorded separately so a slow or failed probe cannot inflate the result.
