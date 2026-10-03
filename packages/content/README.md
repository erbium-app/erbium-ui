# Shared content

`@erbium/content` is the leaf package for documentation copy. It has no runtime or workspace dependencies.

```text
components/
  checkbox/
    index.md        # Component documentation
    playground.md   # Named variant title and explanation
    controlled.md
src/
  documents.ts      # Compiled Markdown entries for Astro
  markdown.ts       # Markdown bodies for Storybook
```

Astro renders compiled Markdown with its normal renderer. Storybook receives the same Markdown bodies as component and story descriptions. React examples, controls and provider composition belong in `@erbium/showcase`; Markdown stays free of framework-specific JSX.

Variant frontmatter uses `title: "Display title"` and `story: ExportName`. Component frontmatter supplies `title` and `description`. The showcase generator reads variant titles from Markdown; preserve export names to keep Storybook IDs stable.

Edit copy here, then run `bun run showcase:generate`, `bun run showcase:registry`, and `bun run showcase:check` from the workspace root. Portable registry stories embed the generated Markdown bodies so consumers do not need this package.
