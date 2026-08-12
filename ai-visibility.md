# Heliox AI visibility audit

Heliox maintains a public pack of 30 recurring questions in [`visibility-prompts.json`](https://www.helioxos.dev/visibility-prompts.json). The pack checks identity, price, privacy, capabilities, multimodal input, neural claims, safety, plugins, comparisons, releases, platforms, and limitations.

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

## Honesty boundary

The committed [`visibility-report.json`](https://www.helioxos.dev/visibility-report.json) says `pending-real-responses` until genuine assistant outputs are supplied. No assistant is counted as tested based on the prompt pack alone.
