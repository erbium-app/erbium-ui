import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { AspectRatio } from "@erbium/ui/components/aspect-ratio";
import Demo from "../examples/aspect-ratio-demo";

const meta = {
  title: "UI/Aspect Ratio",
  component: AspectRatio,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays content within a desired ratio.\n\n**Import:** `@erbium/ui/components/aspect-ratio`  \n\n**shadcn/ui page:** [Aspect Ratio](https://ui.shadcn.com/docs/components/base/aspect-ratio)\n\n### Usage\n\n```tsx\nimport { AspectRatio } from "@erbium/ui/components/aspect-ratio"\n```\n\n```tsx\n<AspectRatio ratio={16 / 9}>\n  <Image src="..." alt="Image" className="rounded-md object-cover" />\n</AspectRatio>\n```\n\n### Square\n\nA square aspect ratio component using the `ratio={1 / 1}` prop. This is useful for displaying images in a square format.\n\n### Portrait\n\nA portrait aspect ratio component using the `ratio={9 / 16}` prop. This is useful for displaying images in a portrait format.\n\nstyleName="base-nova"\n\nname="aspect-ratio-portrait"\n\npreviewClassName="h-96"\n\n/>',
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
        code: 'import { AspectRatio } from "@erbium/ui/components/aspect-ratio";\nexport default function Demo() {\n  return (\n    <div className="w-80">\n      <AspectRatio ratio={16 / 9}>\n        <div className="flex size-full items-center justify-center rounded-lg bg-muted">\n          16:9 media area\n        </div>\n      </AspectRatio>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
