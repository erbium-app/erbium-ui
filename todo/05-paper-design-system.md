# 05 — Paper design-system parity

Maintain a live Paper design-system file alongside the Erbium component library. Every public Erbium component should have a corresponding Paper representation, while React/Base UI remains the source of truth for behavior, accessibility, and implementation.

Paper is the visual counterpart of the `packages/ui` registry. It must not become a second, disconnected component implementation.

## Source-of-truth boundaries

- [ ] Keep Base UI as the source of behavior, focus management, accessibility, state, and positioning.
- [ ] Keep `packages/ui/src` as the source of React component implementation and public APIs.
- [ ] Keep `packages/ui/src/styles` as the source of semantic CSS tokens and shared styling behavior.
- [ ] Keep Storybook as the source of live, rendered component states.
- [ ] Use Paper as the source of visual intent, composition examples, responsive layouts, and design review.
- [ ] Record intentional differences between Paper and implementation instead of allowing silent drift.

## Repository design metadata

Add a design metadata layer to the repository:

- [ ] Create `design/README.md` explaining the Paper workflow and source-of-truth boundaries.
- [ ] Create `design/paper-components.json` mapping every registry item to:
  - source file;
  - registry item and generated registry file;
  - Storybook story;
  - Paper file URL;
  - Paper page and frame/artboard name;
  - supported variants and states;
  - responsive coverage;
  - RTL and dark-mode coverage;
  - parity status and review notes.
- [ ] Decide whether exported Paper reference images belong in `design/assets/` or an app-specific public directory.
- [ ] Do not commit proprietary Paper canvas internals; commit links, metadata, and approved exports only.
- [ ] Define a stable naming convention shared by source files, registry entries, Storybook stories, and Paper frames.

Suggested mapping shape:

```json
{
  "dialog": {
    "source": "packages/ui/src/components/dialog.tsx",
    "registry": "packages/ui/public/r/dialog.json",
    "storybook": "UI/Dialog",
    "paper": {
      "file": "https://app.paper.design/...",
      "page": "05 Overlays",
      "frame": "Dialog"
    },
    "states": ["closed", "open", "long-content", "rtl", "dark"],
    "responsive": ["desktop", "mobile"],
    "status": "planned"
  }
}
```

## Canonical Paper file

Create one primary Paper file named `Erbium UI` before splitting the system across files.

Organize it into pages or artboards:

- [ ] `00 Foundations`
  - colors;
  - semantic surfaces and text;
  - typography;
  - spacing;
  - radius;
  - borders and shadows;
  - motion and reduced-motion behavior;
  - breakpoints and container widths;
  - light, dark, and RTL references.
- [ ] `01 Actions`
- [ ] `02 Forms`
- [ ] `03 Selection`
- [ ] `04 Navigation`
- [ ] `05 Overlays`
- [ ] `06 Feedback`
- [ ] `07 Layout and content`
- [ ] `08 Responsive patterns`
- [ ] `09 Blocks and particles`

Keep components, variants, states, and usage examples together on each page. Split into multiple Paper files only when the single file becomes difficult to navigate, and document how its tokens are synchronized.

## Token synchronization

- [ ] Normalize semantic CSS variable names in `packages/ui/src/styles/theme.css` and related style files.
- [ ] Use the same semantic token names in Paper.
- [ ] Import or generate Paper tokens from the codebase through Paper MCP.
- [ ] Cover colors, radius, spacing, container sizes, breakpoints, font family, font size, font weight, line height, and letter spacing.
- [ ] Avoid Paper-only primitive token names that do not exist in the codebase.
- [ ] Document which system owns token changes and how the change is propagated.
- [ ] Review token changes in both Storybook and Paper before merging.
- [ ] Keep copied tokens between separate Paper files documented because they are not automatically live-linked.

## Storybook bridge

Use `apps/storybook` as the live verification surface for Paper designs.

- [ ] Add a Storybook story for every public component.
- [ ] Add stories for all meaningful variants and interaction states.
- [ ] Add stories for long content, empty states, loading, errors, disabled states, and success states where relevant.
- [ ] Add desktop, mobile, dark-mode, and RTL stories for components with responsive or directional behavior.
- [ ] Use realistic content and representative content lengths rather than placeholder-only examples.
- [ ] Use Paper Snapshot or Paper MCP to inspect the live Storybook output.
- [ ] Link Storybook story IDs or URLs from `design/paper-components.json`.
- [ ] Do not use Paper-generated code as a replacement for the maintained `packages/ui` implementation.

## Component design coverage

Every Paper component frame must document:

- [ ] anatomy and slot names;
- [ ] default state;
- [ ] variants and sizes;
- [ ] hover, focus-visible, pressed, selected, open, and closed states where relevant;
- [ ] disabled, invalid, loading, empty, and error states where relevant;
- [ ] keyboard and focus behavior notes;
- [ ] screen-reader or live-region behavior where relevant;
- [ ] dark mode;
- [ ] RTL;
- [ ] responsive behavior;
- [ ] long-content and overflow behavior;
- [ ] reduced-motion behavior;
- [ ] links to the source, registry item, and Storybook story.

## Responsive design coverage

Create explicit Paper frames for presentation changes that are part of the Erbium API:

- [ ] `dialog` to `drawer` responsive composition;
- [ ] sidebar to mobile sheet/drawer;
- [ ] command dialog to mobile drawer;
- [ ] date-picker popover to mobile drawer/dialog;
- [ ] opt-in responsive popover, select, and combobox compositions;
- [ ] scroll areas with thin desktop handles and touch-friendly native scrolling;
- [ ] long-content dialogs and drawers with independently scrolling bodies;
- [ ] software-keyboard-visible drawer forms;
- [ ] nested overlays and focus restoration;
- [ ] RTL placement and directional transitions.

Keep these primitives semantically stable unless a responsive composition is explicitly provided:

- menus remain menus;
- tooltips remain tooltips;
- hover cards remain non-modal preview surfaces;
- alert dialogs remain confirmation dialogs;
- toasts remain toasts.

## Paper MCP workflow

- [ ] Install and keep Paper Desktop available for the team.
- [ ] Connect the Paper MCP server to the approved agent tooling.
- [ ] Verify that the intended Paper file is open before making agent changes.
- [ ] Use read-only inspection first: file info, selection, tree summary, computed styles, and screenshots.
- [ ] Use write operations only on the intended Paper file and selected nodes.
- [ ] Generate or update tokens from the repository deliberately.
- [ ] Use Paper MCP to create repetitive component frames only after naming and anatomy are agreed.
- [ ] Finish or clear working indicators after agent edits.
- [ ] Record the Paper file URL and frame names in the mapping manifest after each new component.
- [ ] Review agent-created designs manually before marking parity complete.

## Component rollout order

Build the Paper system in the same dependency order as the UI library:

1. [ ] Foundations and tokens.
2. [ ] Button, badge, separator, avatar, and typography primitives.
3. [ ] Input, textarea, label, field, fieldset, and form compositions.
4. [ ] Checkbox, radio group, switch, toggle, select, combobox, and autocomplete.
5. [ ] Tabs, accordion, collapsible, navigation, sidebar, and menus.
6. [ ] Dialog, alert dialog, drawer, sheet, popover, tooltip, and hover card.
7. [ ] Scroll area, progress, meter, spinner, skeleton, alert, and toast.
8. [ ] Calendar, date-picker, pagination, table, card, and data compositions.
9. [ ] Responsive compositions and blocks.

## Parity automation

- [ ] Add a script that compares `packages/ui/registry.json` with `design/paper-components.json`.
- [ ] Fail or warn when a public registry item has no Paper mapping.
- [ ] Detect Paper mappings that point to missing source files or registry entries.
- [ ] Check that each mapped component has a Storybook story.
- [ ] Check that required state and responsive coverage is recorded.
- [ ] Add the parity check to review/release validation once the manifest is established.
- [ ] Decide whether visual regression screenshots should be generated from Storybook, Paper, or both.

## Definition of done

- [ ] Every public component has a Paper frame or a documented intentional omission.
- [ ] Every Paper frame links back to its Erbium source and Storybook story.
- [ ] Foundations use the same semantic token vocabulary as the codebase.
- [ ] Responsive and RTL behavior is represented explicitly.
- [ ] Paper designs show real component states, not only static default examples.
- [ ] Storybook and Paper are reviewed together for visual drift.
- [ ] Registry, source, Storybook, documentation, and Paper mappings agree.
