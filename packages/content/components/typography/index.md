---
title: Typography
description: The typefaces and text roles behind Erbium.
---

Typography gives a page its reading order: a title to orient you, a heading to group related content, and body text to explain what comes next. Erbium uses three typefaces and a shared set of roles across its components and documentation.

## The typefaces

[Cal Sans](https://cal.com/font), designed by [Mark Davis at WORDMARK](https://wordmark.nyc/calsans/) for Cal.com, is the Latin face throughout Erbium. It appears in page titles, article text, field labels, and buttons. Headings and body text share a family; size and weight establish the hierarchy.

[Vazirmatn](https://github.com/rastikerdar/vazirmatn), created by [Saber Rastikerdar](https://github.com/rastikerdar), supplies Arabic-script glyphs for Persian and Arabic text. It sits alongside Cal Sans in the shared sans-serif stack, so mixed-script sentences can use both faces without a font override.

[Paper Mono](https://github.com/paper-design/paper-mono) by [Paper](https://paper.design) is reserved for source code, commands, paths, and identifiers. Code ligatures are disabled to keep punctuation explicit. Ordinary labels and numerical values use the sans-serif stack; use `tabular-nums` when changing counts or totals need aligned digits.

All three fonts are bundled with the shared styles under the SIL Open Font License 1.1. The opening showcase presents Cal Sans and Paper Mono. The final Multilingual showcase shows Vazirmatn in Arabic and Farsi.

## Choose a text role

Load the shared styles following [Installation](/docs/installation). Components already carry their text defaults. For headings, paragraphs, and other text you compose yourself, choose a role by its purpose.

| Text role         | Size / line height | Weight | Use                                                    |
| ----------------- | ------------------ | ------ | ------------------------------------------------------ |
| `text-display`    | 32px / 40px        | 700    | Page title                                             |
| `text-title`      | 24px / 32px        | 600    | Section heading                                        |
| `text-subtitle`   | 18px / 26px        | 600    | Panel heading                                          |
| `text-body`       | 16px / 26px        | 400    | Prose and essential instructions                       |
| `text-caption`    | 14px / 22px        | 400    | Descriptions and supporting sentences                  |
| `text-control`    | 14px / 20px        | 500    | Larger actions and field labels                        |
| `text-control-sm` | 12px / 18px        | 500    | Dense controls, menus, tabs, badges, and keyboard keys |

Values assume a 16px root; rem units respect browser text sizing. Native h1, h2, and h3 use display, title, and subtitle. h4–h6 use body size at semibold. Preserve semantic heading levels for navigation; do not choose an element only for its visual size.

Fields, metadata, and code reuse the same scale:

| Treatment          | Behavior                                                                     | Use                                               |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| `text-metadata`    | Small control size and leading, regular weight                               | Timestamps, filenames, and secondary short values |
| `text-code-block`  | Caption size, 22px line height, regular Paper Mono                           | Standalone code and commands                      |
| `text-inline-code` | 0.875em, inherited leading, regular Paper Mono                               | Identifiers within a sentence                     |
| `text-field`       | Body size and leading; control size and leading on wide fine-pointer layouts | Editable input text                               |
| `text-editable`    | Inherits the owning text treatment                                           | Inline editing without a size jump                |

Do not put essential instructions in metadata. Color expresses importance separately: use foreground for primary text and muted foreground for supporting text.

## Reading and articles

Apply `typeset` to an article or Markdown container. It handles headings, paragraphs, lists, quotations, and tables, with 24px (1.5em of the container's body size) between reading blocks and no extra margin above the first block. Every block spaces from that one unit, whatever its own font size, so a code block or an h3 sits on the same rhythm as a paragraph. Keep prose around 65 characters per line; tables and code can use more width.

Paragraphs use pretty wrapping to avoid one-word last lines. While a reply streams in, set `aria-busy="true"` on its container: text then wraps plainly, so lines already on screen do not move as words arrive. Remove the attribute when the content is complete. [Streaming Response](/docs/blocks/streaming-response) sets it on its content for you.

Embedded controls can opt out with `not-typeset` or `data-not-typeset`. For a wide table, use a `typeset-scroll` wrapper with a descriptive accessible name and keyboard access, while preserving the table's native markup. The Reading example shows this composition in full.

## Wrapping and editable text

Keep the text scale steady as the layout narrows. Let titles and descriptions wrap, and give long identifiers their own wrapping or scrolling region. A smaller panel should change its arrangement rather than shrink its text. [Sizing](/docs/foundations/sizing) covers the surrounding controls and spacing.

Fields use 16px text on touch devices and below 48rem. A wide layout with a fine primary pointer uses 14px. Inline editing inherits the text it replaces, avoiding a size jump between reading and editing.

Use the supported weights—400, 500, 600, and 700—for prose, controls, emphasis, and headings. Keep label weight steady on hover. When a selected state must change weight, use `font-selected` inside a control role. It sets 600 and raises the optical size with it: Cal Sans narrows as `opsz` rises, so the heavier label stays within 1px of its regular width instead of pushing its neighbors or moving an ellipsis. The table of contents on this site and the active row of a chart tooltip both use it. Control roles already set weight 500, so do not add `font-medium` beside them.

Text uses two colors at full strength, foreground and muted foreground, plus a status color where the state calls for one. Do not lighten text with an opacity step, and write capitals into the content rather than applying `uppercase`. The typography lint reports both.
