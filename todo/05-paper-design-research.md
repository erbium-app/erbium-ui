# Paper design-system research

Status reviewed 2026-10-04: this is a historical capability/research snapshot, not a current implementation report. Recheck vendor capabilities before using its conclusions. The active plan and repository status are in [05-paper-design-system.md](./05-paper-design-system.md).

Researched on 2026-10-04. Companion to [the Paper parity checklist](./05-paper-design-system.md). This document records findings and a proposed architecture; it does not indicate that synchronization has been implemented.

## Goal and recommendation

Provide reusable Erbium code, an editable Paper design kit, and documentation with links directly to the corresponding Paper pages and specimens. Keep these aligned through a shared catalog and a versioned publishing workflow.

Use the maintained components, CSS tokens, and showcase definitions as the published system's source of truth. Paper is the editable visual companion and a place for design exploration. Approved exploration should flow back into repository changes before the published reference is updated.

## Verified Paper capabilities and limitations

| Capability             | Current finding                                                                                                                   | Implication                                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Page and element links | Paper's changelog documents links to pages and individual elements.                                                               | Docs can link to a component page or a specific specimen. Store actual copied links rather than constructing undocumented URLs. |
| External viewing       | The changelog documents external view-only sharing and anonymous visitors.                                                        | Verify access to the chosen canonical file from a signed-out browser before publishing links.                                   |
| File duplication       | Dashboard duplication is documented.                                                                                              | Verify whether an external viewer can duplicate the shared kit into their own workspace before advertising that workflow.       |
| Editable HTML import   | HTML can become editable layers, but only inline styles are supported; classes and selector styles are ignored.                   | Export rendered appearance rather than raw Tailwind JSX.                                                                        |
| Imported inputs        | Inputs become frames with text children.                                                                                          | Paper specimens demonstrate appearance; live docs and Storybook demonstrate behavior.                                           |
| Tokens                 | Colors, radius, spacing, containers, breakpoints, and typography tokens are supported. CSS variables can be imported through MCP. | Keep names consistent with repository tokens and synchronize deliberately.                                                      |
| Shared token libraries | Libraries are being developed; copied tokens do not update across files.                                                          | Begin with one canonical file. Treat user copies as independent snapshots.                                                      |
| Theme modes            | Multiple theme modes are on the token roadmap.                                                                                    | Use separate light/dark specimen sections and an explicit token mapping initially.                                              |
| Native components      | Components are listed as coming soon; using existing code components is in progress.                                              | Do not promise Figma-style linked instances, props, or automatic library updates yet.                                           |
| MCP automation         | Desktop MCP can read and write files; remote MCP is listed as coming soon.                                                        | Start with a maintainer-run sync operation rather than assuming headless CI can publish to Paper.                               |

Sources: [Paper changelog](https://paper.design/build-log), [roadmap](https://paper.design/roadmap), [tokens](https://paper.design/docs/tokens), [HTML import](https://paper.design/docs/paste/html), and [MCP documentation](https://paper.design/docs/mcp). These capabilities should be checked again before implementation because Paper is changing quickly.

## Existing repository foundation

- `packages/ui/src` owns reusable components and styles; `packages/ui/registry.json` describes installable items.
- `packages/showcase/src/<component>/catalog.tsx` owns live example definitions. The Button catalog already includes sizes, variants, disabled, and loading examples.
- `packages/showcase/scripts/generate.mjs` generates the showcase manifest and Storybook adapters.
- `packages/content/components` owns the written component and example documentation.
- `apps/docs/src/data/components.ts` joins the showcase manifest, registry, and content into documentation entries.

Extend this existing pipeline. Do not create independent copies of component examples for Paper, docs, and Storybook, or hand-edit generated manifests.

## Canonical design kit

Start with one Paper file named `Erbium UI` containing:

1. Start here: kit version, reuse instructions, installation, license information, and docs links.
2. Foundations: semantic colors, typography, spacing, radii, borders, shadows, icons, and theme references.
3. Component pages or grouped component sections: anatomy, variants, sizes, states, and representative compositions.
4. Patterns: forms, navigation, responsive layouts, and other application compositions.

Name specimens using the public API, for example `Button / outline / sm / disabled`. Add component import paths, docs references, and release information alongside each component section.

Keep the published reference separate from exploration. Generated specimen regions should be replaceable without overwriting manually authored annotations or exploratory work.

## Shared state coverage

Extend the authored showcase metadata with explicit specimen definitions. Use stable IDs such as `button.outline.sm.disabled` across export artifacts and Paper mappings.

Cover applicable dimensions:

- Appearance and size variants.
- Rest, hover, pressed, and keyboard focus.
- Disabled, loading, selected, checked, invalid, open, and closed states.
- Light/dark themes, RTL, narrow layouts, long labels, and overflow.
- Anatomy, accessibility notes, and representative compositions.

Use a curated matrix rather than every possible combination. Ensure all meaningful states appear, then add combinations that expose actual edge cases. Behavior notes are useful in Paper, but focus management, accessibility, motion, and keyboard interaction must be verified in the live components.

Hover and focus require deliberate browser state capture. Portaled overlays require capturing their rendered content rather than only the trigger's DOM subtree. Animated examples need a defined capture point.

## Rendering and export approach

First use Paper Snapshot to transfer a small set of rendered specimens into editable layers. If the pilot is successful, build a repeatable rendered-DOM export and a Paper MCP synchronization procedure.

A proposed exporter should:

1. Render the actual Erbium components using the shared specimen definitions.
2. Apply each required interaction state, theme, viewport, and direction.
3. Collect rendered styles into supported inline HTML.
4. Handle pseudo-elements, icons, fonts, images, overlays, and animation capture explicitly.
5. Produce stable names and IDs for mapping into Paper.
6. Compare the resulting Paper appearance against the browser specimen before marking it synchronized.

Paper's importer ignores class-based styling and transforms some DOM structures. Images must be accessible to Paper. Import fidelity must be established experimentally; editable import is not a guarantee of exact rendering or retained React behavior. See [HTML import details](https://paper.design/docs/paste/html).

## Design reference metadata

Use an authored file such as `design/paper-components.json`, consistent with the existing parity checklist. Generate docs-facing metadata from it through the existing pipeline.

Suggested fields:

```json
{
  "button": {
    "paperUrl": "<copied component page link>",
    "kitVersion": "<published kit version>",
    "specimens": {
      "outline-sm-disabled": {
        "paperUrl": "<copied element link>",
        "paperNodeId": "<existing Paper node ID>",
        "sourceFingerprint": "<relevant source and token hash>",
        "status": "reviewed"
      }
    }
  }
}
```

This is a proposed schema, not a Paper API contract. Derive repository paths, registry identities, and docs routes where possible instead of duplicating them manually.

Preserve mapped landing pages and frame IDs during updates where supported. If replacing a frame changes its ID, update the mapping and verify links before publishing. A stable component landing page provides a fallback for specimen links.

## Documentation experience

- Add `Open in Paper` beside the component title, targeting its specific page or section.
- Add `View this example in Paper` beside mapped examples.
- Add a design-kit entry on the installation page with reuse instructions and the matching release version.
- Include a link back to docs on Paper component sections.
- Show links only when mappings exist and have been verified; do not publish placeholder destinations.

## Synchronization and release workflow

```text
Change component, tokens, or showcase definitions
                    |
Render affected specimens and flag stale mappings
                    |
Update canonical Paper specimens and tokens
                    |
Review appearance, coverage, and public links
                    |
Publish matching registry, docs, and kit version
```

Fingerprint relevant component, example, shared styling, token, and asset inputs. A source fingerprint detects a need to resynchronize; it does not prove visual parity. Record reviewed synchronization separately.

Repository validation can check mapping coverage, unknown component/specimen IDs, generated metadata freshness, and missing release information without accessing Paper. Authenticated Paper inspection and signed-out link checks are separate maintainer steps initially.

Roll out coverage checks gradually: distinguish planned, synchronized, and reviewed components, rather than blocking every change because the entire library is not yet mapped.

Follow existing repository requirements when implementing: rebuild UI registries for UI changes, regenerate showcase artifacts when their sources change, run `bun run showcase:check` for synchronization, and use `bun run ready` for release readiness.

## What users can reuse

Users install the component code through the existing registry and obtain the matching editable Paper kit separately. Verify external copy/duplication and token transfer with a second account before documenting the exact steps.

A copied design kit is a versioned snapshot. Updating the canonical file does not imply that a user's customized copy receives component or token updates. Publish release notes and an upgrade procedure covering affected specimens and token changes. Avoid promising automatic updates until Paper provides and the project verifies that capability.

## Pilot and acceptance criteria

- [ ] Create foundations plus Button, Input, Checkbox, and Dialog specimens.
- [ ] Share the canonical kit and verify anonymous viewing and page/element links.
- [ ] Verify how an external user copies the kit or its specimens into their own project.
- [ ] Establish editable import fidelity for variants, focus, validation, selection, and overlays.
- [ ] Verify light/dark and RTL coverage, fonts, icons, and representative long content.
- [ ] Add authored mappings and generated documentation links for the pilot.
- [ ] Change a token and a component style; confirm the sync workflow updates all affected specimens.
- [ ] Repeat synchronization without duplicates or unintended changes to annotations.
- [ ] Verify published links remain correct after updates.
- [ ] Confirm stale source detection and reviewed version reporting work.
- [ ] Document a complete release and consumer upgrade procedure before scaling to the remaining components.

## Open questions to resolve in the pilot

1. Can external viewers duplicate the published file directly, and what account requirements apply?
2. Which update operations preserve Paper node IDs and links reliably?
3. How faithfully do Snapshot and inline HTML preserve tokens, pseudo-elements, overlays, and complex styling?
4. Can imported specimens retain semantic token references, or must these be rebound through MCP?
5. How should dark-mode token mappings be represented until native modes ship?
6. What automation becomes available when remote MCP and native components are released?

## Research sources

- [Paper changelog](https://paper.design/build-log): sharing, anonymous viewing, duplication, page/element links, and upcoming features.
- [Paper roadmap](https://paper.design/roadmap): native components, code-component reuse, Tailwind integration, and sharing progress.
- [Paper tokens](https://paper.design/docs/tokens): supported token types, codebase import, theme-mode roadmap, and cross-file copy limitations.
- [Paper HTML import](https://paper.design/docs/paste/html): editable layers, inline-style requirements, input transformation, and asset access.
- [Paper MCP](https://paper.design/docs/mcp): desktop setup and agent read/write workflows.
- [Paper support](https://paper.design/docs/support): file links and copy/paste shortcuts.
- [Paper Snapshot extension](https://paper.design/snapshot): initial browser-to-Paper capture workflow.
