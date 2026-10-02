import { ScrollAreaHorizontalDemo } from "../examples/upstream/scroll-area-horizontal-demo";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ScrollArea } from "@erbium/ui/components/scroll-area";
import Demo from "../examples/scroll-area-demo";

const meta = {
  title: "UI/Scroll Area",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Augments native scroll functionality for custom, cross-browser styling.\n\n**Import:** `@erbium/ui/components/scroll-area`  \n\n**shadcn/ui page:** [Scroll Area](https://ui.shadcn.com/docs/components/base/scroll-area)\n\n### Usage\n\n```tsx\nimport { ScrollArea, ScrollBar } from "@erbium/ui/components/scroll-area"\n```\n\n```tsx\n<ScrollArea className="h-[200px] w-[350px] rounded-xl border surface-panel p-4">\n  Your scrollable content here.\n</ScrollArea>\n```\n\n### Composition\n\nUse the following composition to build a `ScrollArea`:\n\n```text\nScrollArea\n└── ScrollBar\n```',
      },
    },
  },
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof ScrollArea> = {
  args: { fade: "vertical", scrollbar: "thin", scrollbarVisibility: "always" },
  argTypes: {
    fade: { control: "select", options: ["vertical", "horizontal", false] },
    scrollbar: { control: "select", options: ["thin", "default", "none"] },
    scrollbarVisibility: { control: "select", options: ["always", "hover", "scroll"] },
  },
  render: (args) => (
    <ScrollArea {...args} className="h-40 w-72 rounded-xl border surface-panel">
      <div className="space-y-2 p-4">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>Scrollable row {index + 1}</p>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\n\nimport { ScrollArea } from "@erbium/ui/components/scroll-area";\nimport { Separator } from "@erbium/ui/components/separator";\n\nconst tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);\n\nexport default function ScrollAreaDemo() {\n  return (\n    <ScrollArea className="h-72 w-48 rounded-xl border surface-panel">\n      <div className="p-4">\n        <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>\n        {tags.map((tag) => (\n          <React.Fragment key={tag}>\n            <div className="text-sm">{tag}</div>\n            <Separator className="my-2" />\n          </React.Fragment>\n        ))}\n      </div>\n    </ScrollArea>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Horizontal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Horizontal overflow shows a horizontal scrollbar automatically. Set `fade="horizontal"` to fade the start and end edges.',
      },
      source: {
        code: 'import * as React from "react";\n\nimport { ScrollArea } from "@erbium/ui/components/scroll-area";\n\nexport interface Artwork {\n  artist: string;\n  art: string;\n}\n\nexport const works: Artwork[] = [\n  {\n    artist: "Ornella Binni",\n    art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80",\n  },\n  {\n    artist: "Tom Byrom",\n    art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80",\n  },\n  {\n    artist: "Vladimir Malyavko",\n    art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80",\n  },\n];\n\nexport function ScrollAreaHorizontalDemo() {\n  return (\n    <ScrollArea fade="horizontal" className="w-96 rounded-xl border surface-panel whitespace-nowrap">\n      <div className="flex w-max space-x-4 p-4">\n        {works.map((artwork) => (\n          <figure key={artwork.artist} className="shrink-0">\n            <div className="overflow-hidden rounded-md">\n              <img\n                src={artwork.art}\n                alt={`Photo by ${artwork.artist}`}\n                className="aspect-[3/4] h-fit w-fit object-cover"\n                width={300}\n                height={400}\n              />\n            </div>\n            <figcaption className="pt-2 text-xs text-muted-foreground">\n              Photo by <span className="font-semibold text-foreground">{artwork.artist}</span>\n            </figcaption>\n          </figure>\n        ))}\n      </div>\n    </ScrollArea>\n  );\n}\n',
      },
    },
  },
  render: () => <ScrollAreaHorizontalDemo />,
};
