---
title: Colors
description: "A Vitesse-inspired palette, expressed in OKLCH and named by purpose."
---

Erbium's theme uses OKLCH for color literals in both appearances, including borders, shadows, and translucent state overlays. Components use semantic tokens such as `background`, `foreground`, and `selection`, so the same component follows either theme.

## Why OKLCH

OKLCH describes a color through **lightness**, **chroma**, and **hue**: `oklch(L C H / alpha)`. Lightness runs from 0% to 100%, chroma describes color intensity, and hue is an angle around the color wheel. Unlike HSL, its lightness more closely follows perceived brightness: colors with the same lightness look more equally bright across hues. This makes it easier to adjust a surface's lightness or a status color's intensity without changing its hue. [oklch.fyi](https://oklch.fyi/) explains these channels with interactive examples.

Hex and RGB describe display channels; OKLCH gives us controls that are closer to how we design a palette. Converting the existing colors preserves their appearance and transparency, within numerical rounding. The notation alone does not improve contrast: foregrounds still need to be checked against the backgrounds they render on, including any transparency. This follows the role-based, measured approach in Jakub Krehel's [Better colors skill](https://skills.sh/jakubkrehel/skills/better-colors), also included in our [installation guide](/docs/installation#project-skills).

Shadcn's current base themes already use OKLCH. Our difference is **the palette and its semantic roles**, rather than a different color notation. We retain Shadcn's CSS-variable approach and Tailwind mapping.

## Why this palette

We adopted Vitesse because it gives the interface and its code examples a shared palette. [Shiki supports Vitesse themes](https://shiki.style/guide/install), and our TanStack Highlight theme maps the same Vitesse colors to its syntax roles. Code highlighting and interface colors therefore stay visually consistent across light and dark appearances, using warm neutral text, quiet backgrounds, and restrained syntax hues.

Erbium adapts that palette into semantic interface roles. Primary actions are neutral; purple distinguishes links, selection, and keyboard focus. Status colors describe feedback, while category and chart tokens retain separate meanings even when they share a color.

Light and dark are designed separately. Dark surfaces become lighter as they rise; light surfaces use subtle perimeters and shadows to distinguish their depth. Coss's styling guidance informs the combination of translucent edges and bottom shadows. Erbium's surface recipes add catchlights and interaction states to those colors. See [Surfaces](/docs/foundations/surfaces) for the rendered system.

The original Vitesse reference files retain their editor format. Erbium's theme expresses the adapted palette in OKLCH.

## What extends Shadcn

Erbium adds tokens for a few more interface roles:

- **Links and selection:** `link`, `selection`, and `selection-foreground` style links and selected text independently of primary actions.
- **Feedback:** `success`, `warning`, and `info` join `error`, which replaces Shadcn's `destructive`. Each has a foreground color and a soft background pair for quieter feedback.
- **Categories:** `tag-*` colors distinguish labels without implying a status.
- **Code and loading:** `code`, `code-foreground`, and `code-highlight` style code blocks; `skeleton` and `skeleton-highlight` style loading placeholders.
- **Overlays and cursors:** Dedicated colors style backdrops and cursor rendering.
- **Surfaces:** `surface-*` colors define layered backgrounds, edges, highlights, shadows, and hover or pressed states.

## Using the tokens

Use `bg-selection text-selection-foreground`, or `var(--selection)` in CSS, when styling components. Copy the CSS blocks below when editing your theme. Each OKLCH value uses its own color as a background, with contrasting text, without changing the copied code. Pair solid and soft backgrounds with their corresponding foregrounds. The blocks come directly from the shared theme files, preserving aliases and color mixes where they express a relationship.
