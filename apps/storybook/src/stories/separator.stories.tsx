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
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: [undefined, "full", "inset"] },
  },
  render: (args) => (
    <div className="flex h-28 w-72 flex-col items-center justify-center">
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

export const Labeled: Story = {
  parameters: {
    docs: {
      description: {
        story: "A centered label stays readable while the carved lines fade at the outer edges.",
      },
      source: {
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\n<Separator>or</Separator>',
      },
    },
  },
  render: () => (
    <div className="w-72 rounded-lg surface-panel p-4">
      <Separator className="text-xs text-muted-foreground">or</Separator>
    </div>
  ),
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Without a `variant`, a separator follows its container. On a surface it runs solid to both edges; in padded content (`separator-inset`) and on the canvas it fades. Pass `variant="full"` or `variant="inset"` to choose.',
      },
      source: {
        code: 'import { Separator } from "@erbium/ui/components/separator";\n\n<div className="surface-panel">\n  <Separator />\n  <div className="separator-inset p-3">\n    <Separator />\n  </div>\n</div>',
      },
    },
  },
  render: () => (
    <div className="grid w-72 gap-6">
      <div className="overflow-hidden rounded-lg surface-panel py-3">
        <div className="px-3 pb-3 text-sm">Card header</div>
        <Separator />
        <div className="separator-inset grid gap-3 p-3 text-sm text-muted-foreground">
          Card content
          <Separator />
          Inset content divider
        </div>
      </div>
      <div className="grid gap-3 text-sm text-muted-foreground">
        Canvas
        <Separator />
        <Separator variant="full" />
      </div>
    </div>
  ),
};

const surfaceSamples = [
  ["Canvas", "bg-surface-canvas"],
  ["Panel", "bg-surface-panel"],
  ["Control", "bg-surface-control"],
  ["Input", "bg-surface-input"],
  ["Overlay", "bg-surface-overlay"],
  ["Modal", "bg-surface-modal"],
  ["Top", "bg-surface-top"],
  ["Well", "bg-surface-well"],
  ["Muted", "bg-muted"],
  ["Secondary", "bg-secondary text-secondary-foreground"],
  ["Accent", "bg-accent text-accent-foreground"],
  ["Primary", "bg-primary text-primary-foreground"],
  ["Error", "bg-error text-error-foreground"],
  ["Success", "bg-success text-success-foreground"],
  ["Warning", "bg-warning text-warning-foreground"],
  ["Info", "bg-info text-info-foreground"],
  ["Error soft", "bg-error-soft text-error-soft-foreground"],
  ["Success soft", "bg-success-soft text-success-soft-foreground"],
  ["Warning soft", "bg-warning-soft text-warning-soft-foreground"],
  ["Info soft", "bg-info-soft text-info-soft-foreground"],
] as const;

export const OnSurfaces: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The translucent shadow and catchlight are checked across the surface palette in both themes.",
      },
    },
  },
  render: () => (
    <div className="grid w-160 max-w-[calc(100vw-2rem)] grid-cols-2 gap-3 p-4 sm:grid-cols-3">
      {surfaceSamples.map(([name, surface]) => (
        <div
          key={name}
          className={`flex min-h-24 flex-col justify-center gap-2 rounded-lg border border-transparent p-3 ${surface}`}
        >
          <span className="text-xs font-medium">{name}</span>
          <Separator />
          <Separator className="text-xs">or</Separator>
        </div>
      ))}
    </div>
  ),
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
  render: () => (
    <div className="w-72 max-w-[calc(100vw-2rem)]">
      <SeparatorList />
    </div>
  ),
};

/** Browser regression: margins must move both edges, including in RTL. */
export const MarginSizing: Story = {
  render: () => (
    <div className="grid gap-6">
      {(["ltr", "rtl"] as const).map((direction) => (
        <div key={direction} dir={direction} className="grid gap-3">
          {(["block", "flex flex-col items-center", "grid justify-items-center"] as const).map(
            (layout) => (
              <div
                key={layout}
                data-separator-case
                className={`w-72 gap-2 bg-surface-panel p-4 ${layout}`}
              >
                <span className="text-sm">
                  {direction}: {layout}
                </span>
                <Separator data-inset="0" className="-mx-4" />
                <Separator data-inset="24" className="mx-2" />
                <Separator data-inset="0" className="-mx-4">
                  Labeled
                </Separator>
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  ),
  play: ({ canvasElement }) => {
    for (const container of canvasElement.querySelectorAll("[data-separator-case]")) {
      const parent = container.getBoundingClientRect();
      for (const separator of container.querySelectorAll<HTMLElement>("[data-inset]")) {
        const inset = Number(separator.dataset.inset);
        const rect = separator.getBoundingClientRect();
        if (
          Math.abs(rect.left - parent.left - inset) > 0.5 ||
          Math.abs(parent.right - rect.right - inset) > 0.5
        ) {
          throw new Error(
            `Separator edges are asymmetric in ${container.className} (${container.parentElement?.dir})`,
          );
        }
      }
    }
  },
};
