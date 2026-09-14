# MTH504 Study App Shell v0.1

**State:** Drive-frozen source candidate. **Not yet pushed to a new GitHub branch and not live.**

This is a derived student-facing JAMstack/static application shell built **on top of** the already-preserved MTH504 v1.2 beta.1 milestone. It does not replace, rewrite, renumber, or re-harvest the 179-question academic corpus.

## Frozen academic input

- 179 permanent question identities
- 228 occurrences
- exact `data/enrichment.json` copied from the independently verified beta.1 publication packet
- SHA-256: `e3707fd0f43f3951a05d0ce6dd5239c189af1281e8dcacb2452ca79a96b97ade`
- beta.1 release commit: `d88aa14044f4ce3e095f891022c32ee74b8f386f`
- immutable prerelease tag: `mth504-v1.2.0-beta.1`

## What this shell changes

Presentation and study workflow only:
- light-first long-study-hours interface;
- optional dark/high-contrast/reduced-semantic-color modes;
- Study / Worked / Visual / Exam / Recall / Audit separation;
- governance/provenance moved to Audit;
- semantic callouts and mathematical role colors;
- a meaningful study figure for every question, with quantitative claims prohibited unless governed numeric visual metadata exists;
- local-only star/confidence/review queue;
- active-recall reveal/rating;
- heuristic related-question navigation explicitly marked nonauthoritative;
- responsive and print layouts;
- PWA/service-worker shell.

## Run locally

Use an HTTP server (modules and JSON loading do not work reliably from `file://`):

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`.

## Governance

This folder is intended to be pushed as **one bounded folder** to a new non-main GitHub branch through the already-proven Colab writer → independent connector readback pipeline. Pages promotion is a later, separate gate.
