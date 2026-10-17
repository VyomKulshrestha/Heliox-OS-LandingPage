# Heliox AI visibility audit

## 18 October 2026 source refresh

Current source facts are v0.14.0, 162 declared action types, 21 executable specialists and 22 independent post-condition verifiers. The homepage, proof pages, release feeds, identity page, Markdown overview, LLM index, visibility prompt pack and documentation MCP now use those authorities. The software measurements come from the 18 October bundle, including explicitly labelled in-sample co-adaptation simulation. The older TTS and subscription-planning samples retain their original capture dates.

Run `python scripts/sync_product_evidence.py --product ../cursor-os/pilot` after regenerating product evidence, and use `--check` to verify the mirrored files. Website CI checks the MCP source hash against `benchmarks.json`, the static identity page's visible FAQ content against its schema, page titles, descriptions, canonical URLs, JSON-LD and sitemap dates. The cinematic homepage makes its legacy main inert, so it no longer advertises FAQ schema for that hidden content.

Before publication, the website and retrieved search result advertised v0.13.0 and 18 verifiers. After deployment, all **23 production sitemap URLs returned HTTP 200**, the apex redirected permanently to `www`, robots allowed crawling, and release/capability JSON, Markdown negotiation, the proof page, raw benchmark mirror and documentation MCP served current evidence. IndexNow accepted the 23 canonical URLs with HTTP 200. Acceptance does not prove indexing.

Google's [AI search guidance](https://developers.google.com/search/docs/appearance/ai-features) emphasizes crawlable, useful content and structured data consistent with visible text. The updates are published, but external search/assistant copies may still lag. Ranking, traffic and aggregate assistant-citation gains have not been measured.

### Real ChatGPT and Gemini checks

These were **10 actual queries** in signed-in Chrome sessions, not simulated answers or API substitutes: two baseline queries, five post-publication prompt-pack queries, two source-guided diagnostics, and one qualified-brand diagnostic. ChatGPT used unpersonalized temporary chats (UI label **Pro**, power 5/5); Gemini used temporary chats (UI label **Auto**). No hidden backend model version is inferred. The dated prompt pack contains 42 questions; this is a **focused sample**, not a new 42-question-per-assistant sweep. Only the five post-publication pack responses are scored in the current report; the other five are archived separately.

- Baseline release question: ChatGPT found v0.14.0 on GitHub and identified the stale website; Gemini returned v0.13.0 from the old website excerpt.
- After publication, ChatGPT retrieved the October measurements: **28.727 ms median, 32.192 ms p95, 33.190 ms p99**, with the correct local/non-LLM exclusions. Its extra statement that the website still contained the August snapshot was stale relative to the live page.
- For the short-brand co-adaptation query, ChatGPT identified Heliox OS as a possible match and did not claim human efficacy, but did not recover the specific published tuning/simulation study. It discussed unrelated human studies instead. This is partial discovery, not a passing feature-accuracy result.
- Gemini's fresh release and latency queries still returned **v0.13.0** and **26.476 / 27.999 ms**, respectively. The short-brand co-adaptation query resolved to medical gas rather than Heliox OS. The feature description now explicitly identifies desktop software and links to its bounded simulation evidence; this is remediation, not proof that entity resolution has improved.
- Separate source-guided Gemini diagnostics could not directly read the JSON endpoints, although independent HTTP checks succeeded. The HTML follow-up still cited older GitHub metrics and did not recover the explicit evidence date. Supplying URLs did not establish current-source grounding.
- A separate fresh Gemini query using the full name "Heliox OS assistance co-adaptation" still failed to resolve the software feature. The qualified-name change alone is not credited as an improvement; [that diagnostic is preserved too](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/blob/main/visibility-results/2026-10-18-qualified-brand.jsonl).

Original failures and baseline observations are retained. Raw branded queries: [ChatGPT](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/blob/main/visibility-captures/2026-10-18-chatgpt.jsonl), [Gemini](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/blob/main/visibility-captures/2026-10-18-gemini.jsonl). Separate diagnostics: [before publication](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/blob/main/visibility-results/2026-10-18-before-publication.jsonl), [source-guided](https://github.com/VyomKulshrestha/Heliox-OS-LandingPage/blob/main/visibility-results/2026-10-18-source-guided.jsonl). These samples show discoverability and freshness problems; they do not measure organic traffic or guarantee future assistant answers.

Heliox maintains a public pack of 42 recurring questions in [`visibility-prompts.json`](https://www.helioxos.dev/visibility-prompts.json). The pack checks identity, price, privacy, capabilities, multimodal input, neural claims, safety, plugins, comparisons, releases, platforms, both MCP directions, Air Handoff, secure integrations, subscription-model boundaries, software benchmarks, co-adaptation simulation, and limitations.

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

## 27 August 2026 v0.13.0 source refresh

The canonical homepage, Markdown overview, release feeds, proof center, documentation MCP evidence record, structured data, cinematic release copy, and recurring prompt pack now resolve current release facts to **v0.13.0** and the dated 27 August benchmark bundle. The prompt pack also corrects the independent-verifier expectation to **18** actions and retains **157** declared action types across **21** executable specialists.

This is a source-readiness improvement, not evidence that search engines or external assistants have already re-indexed v0.13.0. The preserved 21 and 23 August captures remain the latest real assistant observations until a new, separately timestamped sampling run is completed after the public deployment has been crawled.

## Honesty boundary

These are dated, single-session observations on the model surfaces shown at capture time. They are not market-share, ranking, recommendation-frequency, or universal-answer statistics. Incomplete attempts remain incomplete, source labels are not promoted to URLs, and current product facts resolve against `releases.json`, `capabilities.json`, and `proof.md`.
