---
title: Typography
description: Five text roles, font defaults, and a shared reading rhythm.
---

## Fonts

| Role                                                | Typeface                                                 | Weights and styles         |
| --------------------------------------------------- | -------------------------------------------------------- | -------------------------- |
| Body and headings, `--font-sans` / `--font-heading` | [Cal Sans](https://github.com/calcom/sans) for Latin     | 400–700, normal and italic |
| Arabic and Persian, within the same body stack      | [Vazirmatn](https://rastikerdar.github.io/vazirmatn/)    | 100–900, normal            |
| Code, `--font-mono`                                 | [Paper Mono](https://github.com/paper-design/paper-mono) | 100–800, normal            |

Each role includes system fallbacks. Headings inherit the body family. Paper Mono has no italic face, so code italics may be synthesized.

Fonts use `font-display: swap` and load when rendered text needs them. Nothing is preloaded. Vazirmatn’s `unicode-range` limits it to Arabic-script characters. Latin-only pages do not request it.

## Setup

Configure the registries using [Installation](/docs/installation), then install the styles:

```sh
bunx shadcn@latest add @erbium/styles
```

Load them from your application’s global CSS entry:

```css
/* src/index.css */
@import "./styles/globals.css";
```

```tsx
// src/main.tsx
import "./index.css";
```

The CLI copies the styles and font licenses. It does not wire the global import. In Astro, import your global CSS in the shared layout frontmatter. No additional font provider is needed.

Registry installations load Cal Sans, Vazirmatn, and Paper Mono from `https://ui.erbium.app/fonts/`. To self-host them, copy the font files into your public directory and update the URLs in `fonts.css`, preserving the Unicode ranges and bundled licenses.

Workspace apps import `@erbium/ui/globals.css` and use local assets from `packages/ui/src/assets/fonts`.

## Our defaults

Use five roles across product UI and Markdown. Start with the role, then choose the semantic HTML element for the document structure. Headings stay in natural case, at normal tracking. Avoid decorative eyebrows, uppercase labels, and text opacity as extra hierarchy steps.

| Role     | Utility         | Size            | Line height  | Weight | Use                                   |
| -------- | --------------- | --------------- | ------------ | ------ | ------------------------------------- |
| Display  | `text-display`  | 2rem / 32px     | 1.25 / 40px  | 700    | Page title                            |
| Title    | `text-title`    | 1.5rem / 24px   | 1.333 / 32px | 600    | Section heading                       |
| Subtitle | `text-subtitle` | 1.125rem / 18px | 1.444 / 26px | 600    | Card, dialog, sheet, and drawer title |
| Body     | `text-body`     | 1rem / 16px     | 1.625 / 26px | 400    | Paragraphs and general content        |
| Caption  | `text-caption`  | 0.875rem / 14px | 1.571 / 22px | 400    | Supporting descriptions and metadata  |

Pixel equivalents assume the browser’s default 16px root size. All sizes use rem and all line heights are unitless. Browser zoom and user font preferences remain effective. Body text starts at the body role; shared titles and descriptions use subtitle and caption. Existing compact controls keep their size variants.

Use `text-foreground` for primary content and `text-muted-foreground` for supporting content. Links and status messages keep their semantic colors. Muted text is a color token, not foreground with reduced opacity. Essential instructions belong in body text, not tiny metadata.

```tsx
<h1 className="text-display">Workspace settings</h1>
<h2 className="text-title">Members</h2>
<p className="text-body">Manage who can access your projects.</p>
<p className="text-caption text-muted-foreground">Changes apply immediately.</p>
```

### Defaults for our fonts

**Cal Sans:** use 400 for prose, 600 for headings and emphasis, and 700 for page titles. Keep 500 for existing control labels when needed. Use its real italic face for prose emphasis. Keep natural tracking; do not add negative tracking throughout the product. Display text can be larger for a specific marketing composition, but product screens start with the five roles above.

**Vazirmatn:** shares the same roles and weights. Set `lang="fa"`, `lang="ar"`, or `lang="ur"` and `dir="rtl"` at the content boundary. These languages receive more generous role line heights: 1.5 for display and title, 1.6 for subtitle, and 1.75 for body and caption. This leaves room for marks without changing font size. Never space out Arabic letters or force uppercase. The bundled face has no italic style; prefer semibold for deliberate emphasis in Arabic-script content.

**Paper Mono:** use for code, commands, paths, and identifiers. Start at 400; use 600 when code needs emphasis. Use 14px with a 1.6 line height for standalone code, and 0.875em for inline code. Keep normal tracking and disable ligatures in code so punctuation stays explicit. Paper Mono has no italic face, so syntax highlighting may synthesize italics. Avoid mono for ordinary labels or paragraphs.

Use `font-weight`, `font-variant-numeric`, and the other high-level font properties. Do not copy Inter-specific `opsz` values or assume that changing weight preserves a label’s width. Keep the same weight between hover and selected states where a width change would move nearby content.

### Wrapping and numbers

The heading roles balance their lines; body and caption roles use pretty wrapping. Both are progressive enhancements. Long prose still needs a controlled measure: start at 65ch and keep it between about 60 and 70 characters. The layout owns the width so tables, code, and embedded controls can use more room.

Changing numbers use `tabular-nums`, including counts, timers, and totals. Mono is not required for numerical data. Isolate mixed-direction values with `bdi` and keep code blocks left-to-right:

```tsx
<span className="text-body tabular-nums">1,024 members</span>
<p lang="fa" dir="rtl">شناسه: <bdi className="font-mono">project-42</bdi></p>
```

Keep inputs at least 16px on touch devices. Avoid fixed heights for multiline titles and descriptions. Keep useful text selectable and provide access to a full value when truncating it. Do not apply Latin cap-height trimming globally: multilingual text needs its full ascent and descent.

## Reading styles

Wrap reading content with `typeset` and an optional preset:

```tsx
<article className="typeset typeset-docs max-w-[65ch]">
  <h2>Getting started</h2>
  <p>Render HTML or Markdown here.</p>
</article>
```

| Preset                    | Base size                        | Line height  | Block spacing |
| ------------------------- | -------------------------------- | ------------ | ------------- |
| `typeset`                 | `1em`, relative to its container | Body role    | `1.25em`      |
| `typeset typeset-docs`    | Body role, 1rem                  | Body role    | `1.5em`       |
| `typeset typeset-compact` | Caption role, 0.875rem           | Caption role | `1em`         |

A preset alone does not activate Typeset. Text keeps the same size on narrow and wide screens; compact reading is an explicit choice for short content, never the default for an article. Language-specific line heights apply to both presets.

Markdown shares the interface heading roles: h1 is display, h2 is title, and h3 is subtitle. h4–h6 use the container’s body size at semibold. The semantic levels remain distinct for navigation, without introducing smaller uppercase headings. Heading sizes remain the same in both reading presets. Space goes above each block; the first block has no extra top margin.

Typeset balances headings, pretty-wraps paragraphs, uses font-derived underline metrics, isolates code blocks as LTR, and aligns table numbers with tabular figures. Colors and spacing follow the shared theme.

Use `not-typeset` or `data-not-typeset` to exclude embedded components and their descendants. Wrap wide tables with `typeset-scroll`:

```tsx
<article className="typeset typeset-docs">
  <p>Choose your preferences.</p>
  <div className="not-typeset">
    <SettingsForm />
  </div>
  <div className="typeset-scroll">
    <table>{/* rows */}</table>
  </div>
</article>
```

Tailwind utilities override Typeset styles on individual elements. Use the semantic text roles for new UI; existing `text-sm` and `text-base` utilities remain available for component density variants.

## Customization

The five roles live in `typography.css`. Override a role’s size, line height, and weight together through Tailwind’s theme variables. These also drive the reading headings:

```css
@theme {
  --text-display: 2.25rem;
  --text-display--line-height: 1.222222;
  --text-display--font-weight: 700;
}
```

Load a replacement font before assigning it. Override both runtime tokens and Tailwind’s inline mappings after the global import:

```css
@import "./styles/globals.css";

:root {
  --font-sans: "My Sans", ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-sans);
}

@theme inline {
  --font-sans: "My Sans", ui-sans-serif, system-ui, sans-serif;
  --font-heading: var(--font-sans);
}
```

Apply the same pattern to `--font-mono` for a code font or `--font-heading` for a separate heading family. Keep system fallbacks and check language coverage.

Define reading rhythm through three variables:

```css
@layer components {
  .typeset-reading {
    --typeset-size: 1.125rem;
    --typeset-leading: 1.9;
    --typeset-flow: 1.75em;
  }
}
```

Use `typeset typeset-reading` to apply it. The same examples are available in Storybook under **Foundations / Typography**. The approach adapts [Fluid Functionalism’s typography](https://www.fluidfunctionalism.com/docs/typography): a small shared scale, clear weights, and careful wrapping, with defaults for Erbium’s three font roles.
