# Heliox AI visibility audit

Heliox maintains a public pack of 40 recurring questions in [`visibility-prompts.json`](https://www.helioxos.dev/visibility-prompts.json). The pack checks identity, price, privacy, capabilities, multimodal input, neural claims, safety, plugins, comparisons, releases, platforms, MCP, Air Handoff, secure integrations, subscription-model boundaries, software benchmarks, and limitations.

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

Run `python scripts/run_visibility_audit.py --responses captures-one.jsonl captures-two.jsonl`. The output records expected-term coverage, forbidden claims, citation coverage, competitors shown, and human-review flags. Keyword scoring is only triage; a human decides whether an answer is correct.

## 2026-08-12 baseline

Two fresh, signed-in web chats were tested without supplying Heliox source text:

- **Gemini:** completed the identity prompt, correctly described Heliox as an open-source desktop agent, separated repository facts from runtime claims, and cited the GitHub repository. It did not cite the canonical website.
- **ChatGPT:** found and began checking the website and GitHub repository, but did not complete a source-grounded answer within 110 seconds. The timeout is recorded as an incomplete attempt, not a successful mention.

The machine-readable evaluation is in [`visibility-report.json`](https://www.helioxos.dev/visibility-report.json), and the source capture is versioned under `visibility-captures/` in the website repository. These are single-session observations, not market-share or ranking statistics.

## 2026-08-21 follow-up

A second sample attempted all 40 prompts in both signed-in ChatGPT and Gemini sessions: 80 assistant responses in total, with 79 completed answers and one incomplete Gemini attempt. The corrected evaluator found:

- 36 answers with complete expected-term coverage;
- 37 answers containing at least one resolvable citation to the canonical Heliox website or repository;
- 62 Heliox citations among 94 total resolvable citations; and
- 49 responses flagged for human review because coverage was partial, a forbidden phrase appeared, or the attempt did not complete.

ChatGPT consistently discovered Heliox's identity, current release, cost, privacy, action count, specialist count, and most safety material. Gemini identified the project, but its captured citation controls did not expose resolvable source URLs, so the evaluator did not count them as citations. The weakest topic was identity-qualified edge cases: neural questions could be confused with medical heliox gas, and one limitations query resolved to an unrelated Heliox IDE. The canonical neural-research page now answers neural questions directly and exposes an FAQ schema, while keeping the boundary explicit: there is no validated live brain-control claim.

This follow-up demonstrates stronger source discovery in the sampled sessions than the 2026-08-12 baseline. It does not prove a search-ranking increase, broad assistant coverage, or future retrieval behavior; indexing and model refreshes occur on external schedules.

## Honesty boundary

No assistant is counted as tested based on the prompt pack alone. Completed answers and timeouts are recorded separately so a slow or failed probe cannot inflate the result.
