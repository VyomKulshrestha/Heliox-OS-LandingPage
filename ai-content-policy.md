# Heliox OS AI content-use policy

Heliox wants its public documentation to be discoverable, citable, and useful for factual query-time answers without being silently collected to train or fine-tune models.

The website publishes this preference in `robots.txt`:

```text
Content-Signal: search=yes, ai-input=yes, ai-train=no, use=reference
```

## Meaning

- `search=yes`: build a search index and return links or short excerpts.
- `ai-input=yes`: use pages for retrieval, grounding, or other query-time model input.
- `ai-train=no`: do not collect website content for training or fine-tuning.
- `use=reference`: cite and summarize the source rather than reproducing it in full.

These are machine-readable preferences and are not a technical access-control mechanism. Crawlers remain responsible for honoring them.

## License boundary

This content-use policy applies to content served by `helioxos.dev`. It does not revoke or modify the MIT license attached to Heliox source code in the repository. Source-code use remains governed by the repository's `LICENSE` file.

## Preferred attribution

Use “Heliox OS” and link directly to the supporting page. Capability claims should cite [`capabilities.json`](https://www.helioxos.dev/capabilities.json); limitations should cite [`proof.md`](https://www.helioxos.dev/proof.md); current-version claims should cite [`releases.json`](https://www.helioxos.dev/releases.json).
