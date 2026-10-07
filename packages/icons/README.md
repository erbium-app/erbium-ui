# Erbium Icons

`@erbium/icons` owns SVG artwork, icon names, symbol metadata, and generated
spritesheets. It has no runtime dependencies, framework components, rendering
policy, theme, or file/language resolver. Consumers own those concerns.

## Exports

```ts
import { iconDefinitions, iconNames } from "@erbium/icons";
import type { IconName, IconSymbolId } from "@erbium/icons";
import { spriteSheet } from "@erbium/icons/sprite";
```

`iconNames` lists all SVG basenames. `iconDefinitions[name]` contains the matching
`id` and original `viewBox`. Symbol IDs use the stable `erbium-icon-` prefix.
The metadata entry does not import the complete sprite.

The package also exports `@erbium/icons/sprite.svg` and source assets such as
`@erbium/icons/svg/lang-typescript-duo.svg`.

Vite consumers can import `@erbium/icons/sprite.svg?url` for an emitted asset or
`@erbium/icons/sprite.svg?raw` for inline markup. The `sprite` JavaScript entry
provides the same markup without requiring Vite. Consumers decide where to mount
it, how to reference symbols, and how to render, size, label, and color icons.
The sprite contains no mounting attributes or application styles.

## Sources and generation

Add SVGs under `svg/`. Filenames must be lowercase kebab case and globally unique,
including across subdirectories. Each source needs a valid `viewBox`.

From the workspace root:

```sh
bun run icons:generate
bun run icons:check
bun run icons:dev
```

Generation preserves the source artwork, fills, strokes, classes, and opacity.
It removes comments and XML boilerplate, converts SVG roots to symbols, and
prefixes internal IDs and their references. Source files are never rewritten.
Names, types, metadata, inline markup, and the external sprite are generated in
one pass. Commit these outputs with source changes; do not edit them manually.

`icons:check` verifies outputs without writing. `icons:dev` regenerates when SVGs
are added, edited, or deleted. Consumers watching generated files can then reload
them. The package's Vite+ build task declares source inputs and generated outputs
for build caching; no custom Vite plugin is required.

The initial 45 file, language, and tooling icons are Pierre SVG assets. See
`NOTICE.md` and `LICENSE.pierre.md` for provenance and redistribution terms.
