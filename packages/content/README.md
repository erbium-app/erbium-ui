# Shared content

`@erbium/content` is the leaf package for documentation copy. It has no runtime or workspace dependencies.

```text
components/
  checkbox/
    index.md        # Component documentation
    playground.md   # Named variant title and explanation
    controlled.md
src/
  documents.ts      # Compiled Markdown entries
  markdown.ts       # Markdown bodies for Storybook
```

The docs site renders compiled Markdown with its normal renderer. Storybook receives the same Markdown bodies as component and story descriptions. React examples, controls and provider composition belong in `@erbium/showcase`; Markdown stays free of framework-specific JSX.

Variant frontmatter uses `title: "Display title"` and `story: ExportName`. Component frontmatter supplies `title` and `description`. The showcase generator reads variant titles from Markdown; preserve export names to keep Storybook IDs stable.

Edit copy here, then run `bun run showcase:generate`, `bun run showcase:registry`, and `bun run showcase:check` from the workspace root. Portable registry stories embed the generated Markdown bodies so consumers do not need this package.

Component footer links live in `references/<component>.md` and appear at the end of the docs page, Storybook description, and portable registry copy. Credit the external libraries used by the component and its examples, distinguish example integrations from underlying primitives, and link to official documentation or the upstream README. Use version-specific documentation when the latest API differs from the installed package. Keep Base UI-only sections titled `Base UI documentation`; use `External documentation` when referencing other libraries.

## Release notes

Add `changelog/<version>.md` with frontmatter containing `version` and a quoted `date` in `YYYY-MM-DD` format. Write notes in Markdown and link each changed component to its docs page, for example `[Button](/docs/components/button)`. The newest entry sets the sidebar version. Linked items get the sidebar dot for seven calendar days from the release date in Australia/Sydney.
