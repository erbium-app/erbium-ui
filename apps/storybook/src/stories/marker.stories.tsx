import { MarkerLinkButtonDemo } from "../examples/upstream/marker-link-button";
import { MarkerVariantsDemo } from "../examples/upstream/marker-variants";
import { MarkerStatusDemo } from "../examples/upstream/marker-status";
import { MarkerShimmerDemo } from "../examples/upstream/marker-shimmer";
import { MarkerSeparatorDemo } from "../examples/upstream/marker-separator";
import { MarkerBorderDemo } from "../examples/upstream/marker-border";
import { MarkerIconDemo } from "../examples/upstream/marker-icon";
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
          'Displays an inline status, system note, bordered row, or labeled separator in a conversation.\n\n**Import:** `@erbium/ui/components/marker`  \n\n**shadcn/ui page:** [Marker](https://ui.shadcn.com/docs/components/base/marker)\n\n### Usage\n\n```tsx\nimport { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker"\n```\n\n```tsx\n<Marker>\n  <MarkerIcon>\n    <CheckIcon />\n  </MarkerIcon>\n  <MarkerContent>Explored 4 files</MarkerContent>\n</Marker>\n```\n\n### Composition\n\nUse the following composition to build a marker:\n\n```text\nMarker\n├── MarkerIcon\n└── MarkerContent\n```\n\n### Features\n\n- Inline marker, bordered row, and labeled separator variants\n\n- Decorative icon slot that is hidden from assistive tech\n\n- Polymorphic root via `render` for link and button markers\n\n- Pairs with the [`shimmer`](https://ui.shadcn.com/docs/utils/shimmer) utility for streaming status text\n\n- Customizable styling through the `className` prop on every part\n\n### Accessibility\n\n`Marker` is presentational by default. The correct semantics depend on how you use it, so choose the role based on intent rather than relying on a single default.\n\nFor streaming or progress markers such as "Thinking..." or a running tool, set `role="status"` so assistive tech announces the update as it appears. `Marker` forwards `role` to the underlying element.\n\nA separator that carries text, such as a date or a section label, needs no role. The divider lines are decorative CSS pseudo-elements, and the text is announced as ordinary content.\n\n**Note:** Do not add `role="separator"` to a labeled divider. A separator\n\ntakes its accessible name from `aria-label`, not from its text, and its\n\ncontents are treated as presentational, so the visible label would not be\n\nannounced. Reserve `role="separator"` for a divider with no meaningful text.\n\nA bordered marker keeps the same semantics as the default marker. The bottom border is decorative, so choose `role="status"`, `render`, or no role based on the marker\'s purpose.\n\n`MarkerIcon` is decorative and hidden from assistive tech with `aria-hidden`, so the adjacent `MarkerContent` carries the meaning. For an icon-only marker, provide an `aria-label` or visible text so it is not announced as empty.\n\nWhen a marker links or triggers an action, render it as a real `<button>` or `<a>` with the `render` prop so it is focusable and exposes the correct role. The accessible name comes from the marker text.\n\n```tsx\n<Marker role="status">\n  <MarkerIcon>\n    <Spinner />\n  </MarkerIcon>\n  <MarkerContent>Compacting conversation</MarkerContent>\n</Marker>\n```\n\n```tsx\n<Marker variant="separator">\n  <MarkerContent>Today</MarkerContent>\n</Marker>\n```\n\n```tsx\n<Marker variant="border">\n  <MarkerIcon>\n    <FileTextIcon />\n  </MarkerIcon>\n  <MarkerContent>Opened implementation notes</MarkerContent>\n</Marker>\n```\n\n```tsx\n<Marker aria-label="Synced">\n  <MarkerIcon>\n    <CheckIcon />\n  </MarkerIcon>\n</Marker>\n```\n\n```tsx\n<Marker render={<a href="/files" />}>\n  <MarkerIcon>\n    <FileTextIcon />\n  </MarkerIcon>\n  <MarkerContent>Explored 4 files</MarkerContent>\n</Marker>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  variant: "default" | "separator" | "border";
  asSpan: boolean;
  className: string;
}> = {
  args: { variant: "default", asSpan: false, className: "" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "separator", "border"],
    },
    asSpan: { control: "boolean" },
    className: { control: "text" },
  },
  render: (args) => (
    <Marker
      variant={args.variant}
      render={args.asSpan ? <span /> : undefined}
      className={args.className}
    >
      Marker
    </Marker>
  ),
};

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

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `variant` to switch between an inline marker, bordered row, and labeled separator.\n\n| Variant     | Description                                          |\n\n| ----------- | ---------------------------------------------------- |\n\n| `default`   | An inline marker for status, notes, and actions.     |\n\n| `border`    | A default marker with a bottom border under the row. |\n\n| `separator` | A centered label with divider lines on each side.    |",
      },
      source: {
        code: 'import { Marker, MarkerContent } from "@erbium/ui/components/marker";\n\nexport function MarkerVariantsDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Marker>\n        <MarkerContent>A default marker for inline notes.</MarkerContent>\n      </Marker>\n      <Marker variant="separator">\n        <MarkerContent>A separator marker</MarkerContent>\n      </Marker>\n      <Marker variant="border">\n        <MarkerContent>A border marker for row boundaries.</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerVariantsDemo />,
};
export const Status: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `role="status"` and include a [`Spinner`](https://ui.shadcn.com/docs/components/spinner) for streaming or in-progress markers so updates are announced.',
      },
      source: {
        code: 'import { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";\nimport { Spinner } from "@erbium/ui/components/spinner";\n\nexport function MarkerStatusDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Marker role="status">\n        <MarkerIcon>\n          <Spinner />\n        </MarkerIcon>\n        <MarkerContent>Compacting conversation</MarkerContent>\n      </Marker>\n      <Marker variant="separator" role="status">\n        <MarkerIcon>\n          <Spinner />\n        </MarkerIcon>\n        <MarkerContent>Running tests</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerStatusDemo />,
};
export const Shimmer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Add the [`shimmer`](https://ui.shadcn.com/docs/utils/shimmer) utility class to `MarkerContent` for an animated streaming-text effect. The utility ships with the `shadcn` package — see the shimmer docs for installation.",
      },
      source: {
        code: 'import { Marker, MarkerContent } from "@erbium/ui/components/marker";\n\nexport function MarkerShimmerDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Marker role="status">\n        <MarkerContent className="shimmer">Thinking...</MarkerContent>\n      </Marker>\n      <Marker variant="separator" role="status">\n        <MarkerContent className="shimmer">Reading 4 files</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerShimmerDemo />,
};
export const Separator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `separator` variant for labeled dividers, such as dates or section breaks, in a conversation.",
      },
      source: {
        code: 'import { Marker, MarkerContent } from "@erbium/ui/components/marker";\n\nexport function MarkerSeparatorDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Marker variant="separator">\n        <MarkerContent>Today</MarkerContent>\n      </Marker>\n      <Marker variant="separator">\n        <MarkerContent>Worked for 42s</MarkerContent>\n      </Marker>\n      <Marker variant="separator">\n        <MarkerContent>Conversation compacted</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerSeparatorDemo />,
};
export const Border: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `border` variant for status rows that should keep the default marker alignment while separating the next row.",
      },
      source: {
        code: 'import { FileTextIcon, GitBranchIcon, SearchIcon } from "lucide-react";\n\nimport { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";\n\nexport function MarkerBorderDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-3 py-12">\n      <Marker variant="border">\n        <MarkerIcon>\n          <GitBranchIcon />\n        </MarkerIcon>\n        <MarkerContent>Switched to release-candidate</MarkerContent>\n      </Marker>\n      <Marker variant="border">\n        <MarkerIcon>\n          <SearchIcon />\n        </MarkerIcon>\n        <MarkerContent>Reviewed 8 related files</MarkerContent>\n      </Marker>\n      <Marker variant="border">\n        <MarkerIcon>\n          <FileTextIcon />\n        </MarkerIcon>\n        <MarkerContent>Opened implementation notes</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerBorderDemo />,
};
export const Icon: Story = {
  name: "With Icon",
  parameters: {
    docs: {
      description: {
        story:
          "Use `MarkerIcon` to render an icon alongside the content. Use `flex-col` to stack the icon above the content.",
      },
      source: {
        code: 'import { BookOpenCheck, GitBranchIcon, SearchIcon } from "lucide-react";\n\nimport { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";\n\nexport function MarkerIconDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-12 py-12">\n      <Marker>\n        <MarkerIcon>\n          <GitBranchIcon />\n        </MarkerIcon>\n        <MarkerContent>Switched to a new branch</MarkerContent>\n      </Marker>\n      <Marker variant="separator">\n        <MarkerIcon>\n          <SearchIcon />\n        </MarkerIcon>\n        <MarkerContent>Explored 4 files</MarkerContent>\n      </Marker>\n      <Marker className="flex-col">\n        <MarkerIcon>\n          <BookOpenCheck />\n        </MarkerIcon>\n        <MarkerContent>Syncing completed</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerIconDemo />,
};

export const LinkButton: Story = {
  name: "Links and Buttons",
  parameters: {
    docs: {
      description: {
        story:
          'Turn a marker into a link or button with the `render` prop on `Marker`.\n\n```tsx\nimport { Marker, MarkerContent } from "@erbium/ui/components/marker"\n\nexport function MarkerLinkDemo() {\n  return (\n    <Marker render={<a href="#" />}>\n      <MarkerContent>View the pull request</MarkerContent>\n    </Marker>\n  )\n}\n```',
      },
      source: {
        code: 'import { GitBranchIcon, RotateCcwIcon } from "lucide-react";\nimport { toast } from "@erbium/ui/components/toast";\n\nimport { Marker, MarkerContent, MarkerIcon } from "@erbium/ui/components/marker";\n\nexport function MarkerLinkButtonDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Marker render={<a href="#links-and-buttons" />}>\n        <MarkerIcon>\n          <GitBranchIcon />\n        </MarkerIcon>\n        <MarkerContent>View the pull request</MarkerContent>\n      </Marker>\n      <Marker\n        render={\n          <button\n            type="button"\n            className="transition-colors hover:text-foreground"\n            onClick={() => toast.add({ title: "You clicked the revert button" })}\n          />\n        }\n      >\n        <MarkerIcon>\n          <RotateCcwIcon />\n        </MarkerIcon>\n        <MarkerContent>Revert this change</MarkerContent>\n      </Marker>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <MarkerLinkButtonDemo />,
};
