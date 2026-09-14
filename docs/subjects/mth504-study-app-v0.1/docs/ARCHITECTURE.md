# Architecture

## Authority split

**Academic truth:** exact existing `data/enrichment.json` from beta.1.
**Derived learning metadata:** `visual-models.json` and `study-links.json`.
**Presentation state:** HTML/CSS/JS.
**Personal study state:** browser `localStorage` only; never written into academic data.

## JAMstack/static model

No server is required. GitHub Pages serves:
- HTML shell;
- CSS tokens/components;
- ES modules;
- JSON assets;
- SVG icons;
- service worker.

## Renderer layers

1. load and verify 179-question invariant;
2. parse enrichment text into student-facing sections;
3. keep source/audit material out of the default view;
4. render a study schematic from `visual-models.json`;
5. render recall and local review controls;
6. create public GitHub feedback links by permanent question ID.

## Non-negotiable safety

The renderer must never infer missing academic givens or silently turn a structural schematic into a quantitative plot. Any future quantitative visualization metadata is a separately governed derived data layer.
