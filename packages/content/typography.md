---
title: Typography
description: Fonts, loading, and reading styles for Erbium UI.
---

## Fonts

| Role                                                | Typeface                                              | Weights and styles         |
| --------------------------------------------------- | ----------------------------------------------------- | -------------------------- |
| Body and headings, `--font-sans` / `--font-heading` | [Cal Sans](https://github.com/calcom/sans) for Latin  | 400–700, normal and italic |
| Arabic and Persian, within the same body stack      | [Vazirmatn](https://rastikerdar.github.io/vazirmatn/) | 100–900, normal            |
| Code, `--font-mono`                                 | [Geist Mono](https://vercel.com/font)                 | 100–900, normal            |

Each role includes system fallbacks. Headings inherit the body family. The Geist Mono import has no italic face, so code italics may be synthesized.

Fonts use `font-display: swap` and load when rendered text needs them. Nothing is preloaded. Vazirmatn’s `unicode-range` limits it to Arabic-script characters; Latin-only pages do not request it.

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

The CLI copies the styles and installs Geist Mono through Fontsource. It does not wire the global import. In Astro, import your global CSS in the shared layout frontmatter; no additional font provider is needed.

Registry installations load Cal Sans and Vazirmatn from `https://ui.erbium.app/fonts/`. To self-host them, copy the font files into your public directory and update the URLs in `fonts.css`, preserving the Unicode ranges and bundled licenses.

Workspace apps import `@erbium/ui/globals.css` and use local assets from `packages/ui/src/assets/fonts`.

## Interface text

Use semantic elements for document structure and font utilities for appearance:

```tsx
<h2 className="font-heading text-xl font-semibold">Account settings</h2>
<p className="text-sm text-muted-foreground">Manage your profile.</p>
<code className="font-mono text-sm">user.name</code>
```

Use normal weight for body copy, medium for labels, and semibold for emphasis. Keep small text for metadata; allow wrapping and browser zoom. Set `dir` and `lang` on multilingual content.

## Reading styles

Wrap reading content with `typeset` and an optional preset:

```tsx
<article className="typeset typeset-docs max-w-[70ch]">
  <h2>Getting started</h2>
  <p>Render HTML or Markdown here.</p>
</article>
```

| Preset                    | Base size                        | Line height | Block spacing |
| ------------------------- | -------------------------------- | ----------- | ------------- |
| `typeset`                 | `1em`, relative to its container | `1.75`      | `1.25em`      |
| `typeset typeset-docs`    | `1rem`                           | `1.75`      | `1.5em`       |
| `typeset typeset-compact` | `0.875rem`                       | `1.6`       | `1em`         |

A preset alone does not activate Typeset. Below 48rem, text size increases by 12.5%. The layout controls width; about 60–70 characters per line suits prose. Colors and RTL spacing follow the shared theme.

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

Tailwind utilities override Typeset styles on individual elements.

## Customization

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

Use `typeset typeset-reading` to apply it. The same examples are available in Storybook under **Foundations / Typography**. See [Shadcn typography examples](https://ui.shadcn.com/docs/components/typography) for individual text treatments.
