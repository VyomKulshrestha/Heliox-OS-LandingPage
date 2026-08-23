# Heliox AI visibility audit

Heliox maintains a public pack of 40 recurring questions in [`visibility-prompts.json`](https://www.helioxos.dev/visibility-prompts.json). The pack checks identity, price, privacy, capabilities, multimodal input, neural claims, safety, plugins, comparisons, releases, platforms, MCP, Air Handoff, secure integrations, subscription-model boundaries, software benchmarks, and limitations.

## What runs automatically

A monthly repository workflow verifies that the authoritative sources exist and that the prompt pack/report contracts remain valid. This is a free source-readiness check; it does **not** pretend to query external assistants.

## What requires real sampling

Responses from ChatGPT, Gemini, or another assistant must be captured from a real session or authorized API call. Each raw JSONL record identifies the assistant, prompt, model label shown by the surface, capture time, response status, rendered answer, exposed citations or source labels, and conversation scope. `python scripts/run_visibility_audit.py --responses <capture files>` produces keyword-coverage triage; it does not decide whether an answer is factually correct.

## 21 August 2026 refresh

The complete 40-prompt pack was asked without supplying Heliox source text, using one new conversation per prompt:

- **ChatGPT:** 40/40 prompts produced completed answers on the signed-in GPT-5.6 Sol / High surface.
- **Gemini:** all 40 prompts were run. 39 produced completed answers. The secured-integrations prompt requested access to the unrelated Atlassian-Rovo app; access was declined and the attempt is recorded as incomplete rather than credited as an answer.
- **Gemini model labels:** 25 captures exposed Gemini 3.6 Flash, one exposed Gemini 3.1 Pro, one exposed only Gemini Pro, and 13 exposed only Gemini Flash. The report does not infer a hidden model version.

Both assistants identified **v0.12.0** for the latest-installer prompt. Both also returned the older 16 August benchmark snapshot for guarded-task latency and event-loop responsiveness instead of the current-main 21 August bundle. The source-discovery refresh therefore points the homepage, proof pages, MCP evidence record, agent-readable overview, and sitemap metadata to the dated 21 August evidence while retaining the one-host, software-path exclusions.

One Gemini cost answer introduced an older, unrelated Linux project before discussing this Heliox OS repository. That is a single-session ambiguity observation, not a search-ranking statistic. Existing canonical sources already distinguish Heliox OS as a desktop agent, so no broader identity claim was added from that sample alone.

Keyword triage found full expected-term coverage in 22/40 completed ChatGPT answers and 14/39 completed Gemini answers. Human review remains required: negated phrases can trigger forbidden-term matches, omitted keywords do not prove an answer is wrong, and matching keywords do not prove it is right.

ChatGPT exposed URL citations in all 40 completed answers, including Heliox or repository URLs in 37. Gemini rendered source labels but did not expose their destination URLs in the captured DOM, so the machine-readable report conservatively records zero URL citations for Gemini rather than inventing links.

The timestamped raw records are versioned in the [`visibility-captures/2026-08-21*.jsonl`](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/tree/main/visibility-captures) files. The generated evaluation is [`visibility-report.json`](https://www.helioxos.dev/visibility-report.json).

## 23 August 2026 focused identity resample

The 21 August ChatGPT captures exposed a concrete entity collision: `platform-01` led with Heliox IDE before correcting to Heliox OS, while `limits-01` answered about Heliox IDE throughout. A focused resample asked the same two prompts in separate new ChatGPT conversations without supplying source text.

- `platform-01` resolved to Heliox OS, returned Windows, macOS, and Linux, and cited the Heliox OS repository and website. It did not mention Heliox IDE.
- `limits-01` also resolved to Heliox OS and covered hardware validation, cross-platform maturity, model reliability, irreversible effects, conditional capability availability, and neural-input limits. It did not mention Heliox IDE.
- The limits answer still requires human review: several rendered citations point to the creator profile rather than the product repository, and the answer introduced an unverified claim about an older indexed 156-action copy.
- The surface exposed the reasoning label `High` but did not expose a base-model name, so the capture does not infer one.

These two answers are dated observations, not a ranking or a proof that the source patch caused the change. The focused resample ran against the then-public site before this local disambiguation patch was published or re-indexed. The raw records are in [`visibility-captures/2026-08-23-chatgpt-focus.jsonl`](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/blob/main/visibility-captures/2026-08-23-chatgpt-focus.jsonl); the generated report now evaluates this two-prompt resample while the 21 August full-pack captures remain preserved.

## Honesty boundary

These are dated, single-session observations on the model surfaces shown at capture time. They are not market-share, ranking, recommendation-frequency, or universal-answer statistics. Incomplete attempts remain incomplete, source labels are not promoted to URLs, and current product facts resolve against `releases.json`, `capabilities.json`, and `proof.md`.
