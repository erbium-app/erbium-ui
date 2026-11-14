/*
 * How a primitive is drawn while a measured `Skeleton` around it loads. Spread one onto the
 * primitive's root so every composition of it is drawn the same way.
 *
 * - `skeletonBlock`: one block at the element's box (controls, chips, pills), not a bar per line of
 *   the text inside.
 * - `skeletonIgnore`: nothing at all (spinners, decorative rules, focus and overlay layers).
 * - `skeletonKnown`: drawn as itself. For content that is already known while the rest loads
 *   (column headers, labels, toolbars), which stays readable instead of becoming a skeleton.
 *
 * Inputs, textareas, images, SVG icons and media are drawn as blocks already.
 */
const skeletonBlock = { "skullet-block": "" } as const;

const skeletonIgnore = { "skullet-ignore": "" } as const;

const skeletonKnown = { "skullet-own": "" } as const;

export { skeletonBlock, skeletonIgnore, skeletonKnown };
