import ExampleResizableVertical from "../examples/resizable-vertical";
import ExampleResizableHandle from "../examples/resizable-handle";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/resizable-demo";

const meta = {
  title: "UI/Resizable",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Accessible resizable panel groups and layouts with keyboard support.\n\n**Import:** `@erbium/ui/components/resizable`  \n\n**shadcn/ui page:** [Resizable](https://ui.shadcn.com/docs/components/base/resizable)\n\n### About\n\nThe `Resizable` component is built on top of [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by [bvaughn](https://github.com/bvaughn).\n\n### Usage\n\n```tsx\nimport {\n  ResizableHandle,\n  ResizablePanel,\n  ResizablePanelGroup,\n} from "@erbium/ui/components/resizable"\n```\n\n```tsx\n<ResizablePanelGroup orientation="horizontal">\n  <ResizablePanel>One</ResizablePanel>\n  <ResizableHandle />\n  <ResizablePanel>Two</ResizablePanel>\n</ResizablePanelGroup>\n```\n\n### Composition\n\nUse the following composition to build a `ResizablePanelGroup`:\n\n```text\nResizablePanelGroup\n├── ResizablePanel\n├── ResizableHandle\n└── ResizablePanel\n```\n\n### Changelog\n\nUpdated to `react-resizable-panels` v4. See the [v4.0.0 release notes](https://github.com/bvaughn/react-resizable-panels/releases/tag/4.0.0) for full details.\n\nIf you\'re using `react-resizable-panels` primitives directly, note the following changes:\n\n| v3                           | v4                      |\n\n| ---------------------------- | ----------------------- |\n\n| `PanelGroup`                 | `Group`                 |\n\n| `PanelResizeHandle`          | `Separator`             |\n\n| `direction` prop             | `orientation` prop      |\n\n| `defaultSize={50}`           | `defaultSize="50%"`     |\n\n| `onLayout`                   | `onLayoutChange`        |\n\n| `ImperativePanelHandle`      | `PanelImperativeHandle` |\n\n| `ref` prop on Panel          | `panelRef` prop         |\n\n| `data-panel-group-direction` | `aria-orientation`      |\n\nThe shadcn/ui wrapper components (`ResizablePanelGroup`, `ResizablePanel`,\n\n`ResizableHandle`) remain unchanged.',
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
        code: 'import {\n  ResizableHandle,\n  ResizablePanel,\n  ResizablePanelGroup,\n} from "@erbium/ui/components/resizable";\n\nexport default function ResizableDemo() {\n  return (\n    <ResizablePanelGroup\n      orientation="horizontal"\n      className="max-w-md rounded-lg border md:min-w-[450px]"\n    >\n      <ResizablePanel defaultSize="50%">\n        <div className="flex h-[200px] items-center justify-center p-6">\n          <span className="font-semibold">One</span>\n        </div>\n      </ResizablePanel>\n      <ResizableHandle />\n      <ResizablePanel defaultSize="50%">\n        <ResizablePanelGroup orientation="vertical">\n          <ResizablePanel defaultSize="25%">\n            <div className="flex h-full items-center justify-center p-6">\n              <span className="font-semibold">Two</span>\n            </div>\n          </ResizablePanel>\n          <ResizableHandle />\n          <ResizablePanel defaultSize="75%">\n            <div className="flex h-full items-center justify-center p-6">\n              <span className="font-semibold">Three</span>\n            </div>\n          </ResizablePanel>\n        </ResizablePanelGroup>\n      </ResizablePanel>\n    </ResizablePanelGroup>\n  );\n}\n',
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
      description: { story: 'Use `orientation="vertical"` for vertical resizing.' },

      source: {
        code: 'import {\n  ResizableHandle,\n  ResizablePanel,\n  ResizablePanelGroup,\n} from "@erbium/ui/components/resizable"\n\nexport default function ResizableDemo() {\n  return (\n    <ResizablePanelGroup\n      orientation="vertical"\n      className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"\n    >\n      <ResizablePanel defaultSize="25%">\n        <div className="flex h-full items-center justify-center p-6">\n          <span className="font-semibold">Header</span>\n        </div>\n      </ResizablePanel>\n      <ResizableHandle />\n      <ResizablePanel defaultSize="75%">\n        <div className="flex h-full items-center justify-center p-6">\n          <span className="font-semibold">Content</span>\n        </div>\n      </ResizablePanel>\n    </ResizablePanelGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleResizableVertical />
    </div>
  ),
};
export const Handle: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `withHandle` prop on `ResizableHandle` to show a visible handle.",
      },

      source: {
        code: 'import {\n  ResizableHandle,\n  ResizablePanel,\n  ResizablePanelGroup,\n} from "@erbium/ui/components/resizable"\n\nexport default function ResizableHandleDemo() {\n  return (\n    <ResizablePanelGroup\n      orientation="horizontal"\n      className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"\n    >\n      <ResizablePanel defaultSize="25%">\n        <div className="flex h-full items-center justify-center p-6">\n          <span className="font-semibold">Sidebar</span>\n        </div>\n      </ResizablePanel>\n      <ResizableHandle withHandle />\n      <ResizablePanel defaultSize="75%">\n        <div className="flex h-full items-center justify-center p-6">\n          <span className="font-semibold">Content</span>\n        </div>\n      </ResizablePanel>\n    </ResizablePanelGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleResizableHandle />
    </div>
  ),
};
