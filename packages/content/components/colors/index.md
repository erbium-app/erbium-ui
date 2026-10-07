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

## Shared translucent roles

Repeated opacity treatments have dedicated tokens. Their color mixes live in `theme.css`, so components consume the role without choosing an opacity. The mixes preserve the previous Tailwind opacity values in both themes.

| Role                                  | Token                                                         | Current treatment                   |
| ------------------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| Footer background                     | `footer`                                                      | Muted at 50%                        |
| Neutral hover background              | `muted-hover`                                                 | Muted at 50%                        |
| Active navigation background          | `muted-selected`                                              | Muted at 50%                        |
| Focus halo                            | `focus-halo`                                                  | Ring at 40%                         |
| Strong focus halo and default outline | `focus-halo-strong`                                           | Ring at 50%                         |
| Invalid control halo                  | `invalid-halo`                                                | Error at 20% in light, 40% in dark  |
| Invalid control border                | `invalid`                                                     | Error at 100% in light, 50% in dark |
| Destructive menu interaction          | `error-interactive`                                           | Error at 10% in light, 20% in dark  |
| Status button focus border            | `error-focus`, `success-focus`, `warning-focus`, `info-focus` | Corresponding status at 40%         |

Use `bg-footer`, `focus-visible:ring-focus-halo`, or `aria-invalid:ring-invalid-halo` for these roles. Sidebar footers retain their own background treatment.

Opacity modifiers remain appropriate for component-specific treatments: scrollbar thumb states, cursor trails, tooltip keycaps, attachment feedback, and slider selection. Repeated input opacity values span different roles (checkbox faces, popup search fields, chat bubbles, and questionnaire fields); they remain local rather than sharing a token solely because their numeric value matches. Text attenuation and isolated demonstration backgrounds also remain local.
