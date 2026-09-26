import { SeparatorVertical } from "../examples/upstream/separator-vertical";
import { SeparatorMenu } from "../examples/upstream/separator-menu";
import { SeparatorList } from "../examples/upstream/separator-list";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Separator } from "@erbium/ui/components/separator";
import Demo from "../examples/separator-demo";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Visually or semantically separates content.\n\n**Import:** `@erbium/ui/components/separator`  \n\n**shadcn/ui page:** [Separator](https://ui.shadcn.com/docs/components/base/separator)\n\n### Usage\n\n```tsx\nimport { Separator } from "@erbium/ui/components/separator"\n```\n\n```tsx\n<Separator />\n```',
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Separator> = {
  args: { orientation: "horizontal", className: "" },
  argTypes: { orientation: { control: "select", options: ["horizontal", "vertical"] } },
  render: (args) => (
    <div className="flex h-28 w-72 items-center justify-center">
      <Separator
        {...args}
        className={
          args.orientation === "vertical"
            ? `h-full ${typeof args.className === "string" ? args.className : ""}`
            : `w-full ${typeof args.className === "string" ? args.className : ""}`
        }
      />
    </div>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\nexport default function SeparatorDemo() {\n  return (\n    <div>\n      <div className="space-y-1">\n        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>\n        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>\n      </div>\n      <Separator className="my-4" />\n      <div className="flex h-5 items-center space-x-4 text-sm">\n        <div>Blog</div>\n        <Separator orientation="vertical" />\n        <div>Docs</div>\n        <Separator orientation="vertical" />\n        <div>Source</div>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `orientation="vertical"` for a vertical separator.' },
      source: {
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\nexport function SeparatorVertical() {\n  return (\n    <div className="flex h-5 items-center gap-4 text-sm">\n      <div>Blog</div>\n      <Separator orientation="vertical" />\n      <div>Docs</div>\n      <Separator orientation="vertical" />\n      <div>Source</div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SeparatorVertical />,
};
export const Menu: Story = {
  parameters: {
    docs: {
      description: { story: "Vertical separators between menu items with descriptions." },
      source: {
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\nexport function SeparatorMenu() {\n  return (\n    <div className="flex items-center gap-2 text-sm md:gap-4">\n      <div className="flex flex-col gap-1">\n        <span className="font-medium">Settings</span>\n        <span className="text-xs text-muted-foreground">Manage preferences</span>\n      </div>\n      <Separator orientation="vertical" />\n      <div className="flex flex-col gap-1">\n        <span className="font-medium">Account</span>\n        <span className="text-xs text-muted-foreground">Profile & security</span>\n      </div>\n      <Separator orientation="vertical" className="hidden md:block" />\n      <div className="hidden flex-col gap-1 md:flex">\n        <span className="font-medium">Help</span>\n        <span className="text-xs text-muted-foreground">Support & docs</span>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SeparatorMenu />,
};
export const List: Story = {
  parameters: {
    docs: {
      description: { story: "Horizontal separators between list items." },
      source: {
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\nexport function SeparatorList() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-2 text-sm">\n      <dl className="flex items-center justify-between">\n        <dt>Item 1</dt>\n        <dd className="text-muted-foreground">Value 1</dd>\n      </dl>\n      <Separator />\n      <dl className="flex items-center justify-between">\n        <dt>Item 2</dt>\n        <dd className="text-muted-foreground">Value 2</dd>\n      </dl>\n      <Separator />\n      <dl className="flex items-center justify-between">\n        <dt>Item 3</dt>\n        <dd className="text-muted-foreground">Value 3</dd>\n      </dl>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <SeparatorList />,
};
