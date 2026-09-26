import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Marker } from "@erbium/ui/components/marker";
import Demo from "../examples/marker-demo";

const meta = {
  title: "UI/Marker",
  component: Marker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays an inline status, system note, bordered row, or labeled separator in a conversation.\n\n**Import:** `@erbium/ui/components/marker`  \n\n**shadcn/ui page:** [Marker](https://ui.shadcn.com/docs/components/base/marker)\n\n### Usage\n\n```tsx\nimport { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker"\n```\n\n```tsx\n<Marker>\n  <MarkerIcon>\n    <CheckIcon />\n  </MarkerIcon>\n  <MarkerContent>Explored 4 files</MarkerContent>\n</Marker>\n```\n\n### Composition\n\nUse the following composition to build a marker:\n\n```text\nMarker\n├── MarkerIcon\n└── MarkerContent\n```\n\n### Features\n\n- Inline marker, bordered row, and labeled separator variants\n\n- Decorative icon slot that is hidden from assistive tech\n\n- Polymorphic root via `render` for link and button markers\n\n- Pairs with the [`shimmer`](https://ui.shadcn.com/docs/utils/shimmer) utility for streaming status text\n\n- Customizable styling through the `className` prop on every part\n\n### Variants\n\nUse `variant` to switch between an inline marker, bordered row, and labeled separator.\n\nstyleName="base-rhea"\n\nname="marker-variants"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n| Variant     | Description                                          |\n\n| ----------- | ---------------------------------------------------- |\n\n| `default`   | An inline marker for status, notes, and actions.     |\n\n| `border`    | A default marker with a bottom border under the row. |\n\n| `separator` | A centered label with divider lines on each side.    |\n\n### Status\n\nSet `role="status"` and include a [`Spinner`](https://ui.shadcn.com/docs/components/spinner) for streaming or in-progress markers so updates are announced.\n\nstyleName="base-rhea"\n\nname="marker-status"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Shimmer\n\nAdd the [`shimmer`](https://ui.shadcn.com/docs/utils/shimmer) utility class to `MarkerContent` for an animated streaming-text effect. The utility ships with the `shadcn` package — see the shimmer docs for installation.\n\nstyleName="base-rhea"\n\nname="marker-shimmer"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Separator\n\nUse the `separator` variant for labeled dividers, such as dates or section breaks, in a conversation.\n\nstyleName="base-rhea"\n\nname="marker-separator"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Border\n\nUse the `border` variant for status rows that should keep the default marker alignment while separating the next row.\n\nstyleName="base-rhea"\n\nname="marker-border"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### With Icon\n\nUse `MarkerIcon` to render an icon alongside the content. Use `flex-col` to stack the icon above the content.\n\nstyleName="base-rhea"\n\nname="marker-icon"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n### Links and Buttons\n\nTurn a marker into a link or button with the `render` prop on `Marker`.\n\nstyleName="base-rhea"\n\nname="marker-link-button"\n\npreviewClassName="h-auto theme-blue"\n\n/>\n\n```tsx\nimport { Marker, MarkerContent } from "@erbium/ui/components/marker"\n\nexport function MarkerLinkDemo() {\n  return (\n    <Marker render={<a href="#" />}>\n      <MarkerContent>View the pull request</MarkerContent>\n    </Marker>\n  )\n}\n```\n\n### Accessibility\n\n`Marker` is presentational by default. The correct semantics depend on how you use it, so choose the role based on intent rather than relying on a single default.\n\nFor streaming or progress markers such as "Thinking..." or a running tool, set `role="status"` so assistive tech announces the update as it appears. `Marker` forwards `role` to the underlying element.\n\nA separator that carries text, such as a date or a section label, needs no role. The divider lines are decorative CSS pseudo-elements, and the text is announced as ordinary content.\n\n**Note:** Do not add `role="separator"` to a labeled divider. A separator\n\ntakes its accessible name from `aria-label`, not from its text, and its\n\ncontents are treated as presentational, so the visible label would not be\n\nannounced. Reserve `role="separator"` for a divider with no meaningful text.\n\nA bordered marker keeps the same semantics as the default marker. The bottom border is decorative, so choose `role="status"`, `render`, or no role based on the marker\'s purpose.\n\n`MarkerIcon` is decorative and hidden from assistive tech with `aria-hidden`, so the adjacent `MarkerContent` carries the meaning. For an icon-only marker, provide an `aria-label` or visible text so it is not announced as empty.\n\nWhen a marker links or triggers an action, render it as a real `<button>` or `<a>` with the `render` prop so it is focusable and exposes the correct role. The accessible name comes from the marker text.\n\n```tsx\n<Marker role="status">\n  <MarkerIcon>\n    <Spinner />\n  </MarkerIcon>\n  <MarkerContent>Compacting conversation</MarkerContent>\n</Marker>\n```\n\n```tsx\n<Marker variant="separator">\n  <MarkerContent>Today</MarkerContent>\n</Marker>\n```\n\n```tsx\n<Marker variant="border">\n  <MarkerIcon>\n    <FileTextIcon />\n  </MarkerIcon>\n  <MarkerContent>Opened implementation notes</MarkerContent>\n</Marker>\n```\n\n```tsx\n<Marker aria-label="Synced">\n  <MarkerIcon>\n    <CheckIcon />\n  </MarkerIcon>\n</Marker>\n```\n\n```tsx\n<Marker render={<a href="/files" />}>\n  <MarkerIcon>\n    <FileTextIcon />\n  </MarkerIcon>\n  <MarkerContent>Explored 4 files</MarkerContent>\n</Marker>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Marker, MarkerContent } from "@erbium/ui/components/marker";\nexport default function Demo() {\n  return (\n    <div className="flex gap-3">\n      <Marker>\n        <MarkerContent>New</MarkerContent>\n      </Marker>\n      <Marker variant="border">\n        <MarkerContent>Updated</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
