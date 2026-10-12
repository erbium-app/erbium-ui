# Third-party artwork

## File and language icons

The SVG assets in `svg/files/` are sourced from `@pierre/vscode-icons` version
0.0.9, by The Pierre Computer Company:

https://github.com/pierrecomputer/vscode-icons

These assets are distributed under the MIT license reproduced in
`LICENSE.pierre.md`. Generated sprites contain the same artwork and must retain
this notice and license when redistributed.

The SVG filenames retain their upstream names. The package does not import
Pierre's theme colors, file associations, or component implementations.

## Interface glyphs

The SVG assets in `svg/ui/` are converted from `@hugeicons/core-free-icons`
version 4.3.5, by Hugeicons:

https://hugeicons.com

They are distributed under the MIT license reproduced in `LICENSE.hugeicons.md`.
Names are the upstream icon names in kebab case, without the `Icon` suffix.
Geometry is unchanged; the stroke width is exposed as `--icon-stroke-width`.
