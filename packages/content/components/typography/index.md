---
title: Typography
description: One shared hierarchy for interfaces, reading, code, and multilingual text.
---

## The system

Typography describes the job of the text. Layout describes its available space; [sizing](/docs/foundations/sizing) describes the control around it; [surfaces](/docs/foundations/surfaces) describe its interaction and elevation. Choose a text role before adjusting a layout. Smaller containers rearrange content rather than inventing a smaller type scale.

Load the shared styles as described in [Installation](/docs/installation). Components already include their text defaults. Apply roles to application text and plain HTML; do not restyle every component instance.

## Fonts and hierarchy

Cal Sans is the Latin interface and reading face. Vazirmatn serves Arabic-script text in the same family stack. Paper Mono serves code, commands, paths, and identifiers. Headings use the interface family. Keep system fallbacks and natural letter spacing.

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

These seven roles define the scale. Other treatments reuse it:

| Treatment          | Behavior                                                                     | Use                                               |
| ------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------- |
| `text-metadata`    | Small control size and leading, regular weight                               | Timestamps, filenames, and secondary short values |
| `text-code-block`  | Caption size, 1.6 line height, regular Paper Mono                            | Standalone code and commands                      |
| `text-inline-code` | 0.875em, inherited leading, regular Paper Mono                               | Identifiers within a sentence                     |
| `text-field`       | Body size and leading; control size and leading on wide fine-pointer layouts | Editable input text                               |
| `text-editable`    | Inherits the owning text treatment                                           | Inline editing without a size jump                |

Do not put essential instructions in metadata. Color expresses importance separately: use foreground for primary text and muted foreground for supporting text.

## One reading rhythm

Use `typeset` on an article or Markdown container. It establishes body text, the shared heading hierarchy, and 1.5em spacing between reading blocks. The first block has no extra top margin. There is one reading treatment on desktop and mobile; there are no compact or documentation presets.

The Reading showcase demonstrates paragraphs, emphasis, nested lists, quotations, inline code, and a table. Use its source as the complete composition example. Let the layout constrain prose to approximately 65 characters per line. Wide code and tables can occupy more room.

Inside an article, exclude embedded interface components with `not-typeset` or `data-not-typeset`. Wrap wide native tables in `typeset-scroll`, give the scroll region a descriptive accessible name, and allow keyboard access. Keep table semantics intact rather than turning a table into a block for scrolling.

## Screens, language, and content growth

The text hierarchy stays stable as the screen changes. Allow headings and descriptions to wrap; do not force their line boxes into fixed heights. Heading roles balance lines, while body and caption roles favor readable paragraph wrapping. Long identifiers wrap or scroll within their own region, without widening the page.

Editable text remains 16px on touch devices, including wide tablets. It also remains 16px below 48rem. Only wide layouts with a fine primary pointer use 14px fields. The sizing foundation coordinates neighboring controls with those larger line boxes.

Set `lang` and `dir` at the content boundary. Arabic, Persian, and Urdu retain the same font sizes but receive more line room: display and title use 1.5, subtitle and controls use 1.6, and body and caption use 1.75. Never add tracking or uppercase transformations to Arabic-script text. Prefer semibold to synthesized italic emphasis in that script.

Use `bdi` for mixed-direction identifiers and numbers. Code blocks stay left-to-right. Use `tabular-nums` for changing counts, timers, and totals; numerical data does not require a monospace font.

## Emphasis and state

Use regular for prose, medium for controls, semibold for emphasis and section headings, and bold for page titles. The supported product weights are 400, 500, 600, and 700. Preserve a label's weight during hover so nearby content does not move. Selected-state emphasis must not create clipping or layout jumps.

Paper Mono keeps punctuation explicit with code ligatures disabled. Use it for technical content, not ordinary labels or paragraphs. Its code rhythm does not introduce another independently adjustable size scale.

## Usage contract

- Use component defaults first; choose a semantic text role for application-owned text.
- Keep typography independent of control size and panel spacing. A compact panel does not shrink its prose or headings.
- Use the single `typeset` reading treatment. Preserve heading order, reading measure, table semantics, and access to full truncated values.
- Use shared roles for responsive and state treatments. Do not introduce local font sizes, line heights, tracking, unsupported families, or new font weights.
- Treat changes to fonts or the shared scale as a design-system decision, verified across components, languages, and text enlargement.

Repository checks enforce these roles across React, Astro, stories, and CSS recipes. The showcases below cover code, reading, and multilingual behavior; the opening Interface showcase demonstrates the hierarchy in a real settings panel.
