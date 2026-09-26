import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ContextMenu } from "@erbium/ui/components/context-menu";
import Demo from "./examples/context-menu-demo";

const meta = {
  title: "UI/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a menu of actions triggered by a right click.\n\n**Import:** `@erbium/ui/components/context-menu`  \n\n**shadcn/ui page:** [Context Menu](https://ui.shadcn.com/docs/components/base/context-menu)\n\n### Usage\n\n```tsx\nimport {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuItem,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu"\n```\n\n```tsx\n<ContextMenu>\n  <ContextMenuTrigger>Right click here</ContextMenuTrigger>\n  <ContextMenuContent>\n    <ContextMenuItem>Profile</ContextMenuItem>\n    <ContextMenuItem>Billing</ContextMenuItem>\n    <ContextMenuItem>Team</ContextMenuItem>\n    <ContextMenuItem>Subscription</ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>\n```\n\n### Composition\n\nUse the following composition to build a `ContextMenu`:\n\n```text\nContextMenu\n├── ContextMenuTrigger\n└── ContextMenuContent\n    ├── ContextMenuGroup\n    │   ├── ContextMenuLabel\n    │   ├── ContextMenuItem\n    │   └── ContextMenuItem\n    ├── ContextMenuSeparator\n    ├── ContextMenuGroup\n    │   ├── ContextMenuLabel\n    │   ├── ContextMenuCheckboxItem\n    │   └── ContextMenuCheckboxItem\n    ├── ContextMenuSeparator\n    ├── ContextMenuGroup\n    │   ├── ContextMenuLabel\n    │   └── ContextMenuRadioGroup\n    │       ├── ContextMenuRadioItem\n    │       └── ContextMenuRadioItem\n    └── ContextMenuSub\n        ├── ContextMenuSubTrigger\n        └── ContextMenuSubContent\n            └── ContextMenuGroup\n                ├── ContextMenuItem\n                └── ContextMenuItem\n```\n\n### Basic\n\nA simple context menu with a few actions.\n\n### Submenu\n\nUse `ContextMenuSub` to nest secondary actions.\n\n### Shortcuts\n\nAdd `ContextMenuShortcut` to show keyboard hints.\n\n### Groups\n\nGroup related actions and separate them with dividers.\n\n### Icons\n\nCombine icons with labels for quick scanning.\n\n### Checkboxes\n\nUse `ContextMenuCheckboxItem` for toggles.\n\n### Radio\n\nUse `ContextMenuRadioItem` for exclusive choices.\n\n### Destructive\n\nUse `variant="destructive"` to style the menu item as destructive.\n\n### Sides\n\nControl submenu placement with side and align props.',
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
        code: 'import {\n  ContextMenu,\n  ContextMenuCheckboxItem,\n  ContextMenuContent,\n  ContextMenuItem,\n  ContextMenuLabel,\n  ContextMenuRadioGroup,\n  ContextMenuRadioItem,\n  ContextMenuSeparator,\n  ContextMenuShortcut,\n  ContextMenuSub,\n  ContextMenuSubContent,\n  ContextMenuSubTrigger,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport default function ContextMenuDemo() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">\n        Right click here\n      </ContextMenuTrigger>\n      <ContextMenuContent className="w-52">\n        <ContextMenuItem inset>\n          Back\n          <ContextMenuShortcut>⌘[</ContextMenuShortcut>\n        </ContextMenuItem>\n        <ContextMenuItem inset disabled>\n          Forward\n          <ContextMenuShortcut>⌘]</ContextMenuShortcut>\n        </ContextMenuItem>\n        <ContextMenuItem inset>\n          Reload\n          <ContextMenuShortcut>⌘R</ContextMenuShortcut>\n        </ContextMenuItem>\n        <ContextMenuSub>\n          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>\n          <ContextMenuSubContent className="w-44">\n            <ContextMenuItem>Save Page...</ContextMenuItem>\n            <ContextMenuItem>Create Shortcut...</ContextMenuItem>\n            <ContextMenuItem>Name Window...</ContextMenuItem>\n            <ContextMenuSeparator />\n            <ContextMenuItem>Developer Tools</ContextMenuItem>\n            <ContextMenuSeparator />\n            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>\n          </ContextMenuSubContent>\n        </ContextMenuSub>\n        <ContextMenuSeparator />\n        <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>\n        <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>\n        <ContextMenuSeparator />\n        <ContextMenuRadioGroup value="pedro">\n          <ContextMenuLabel inset>People</ContextMenuLabel>\n          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>\n          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>\n        </ContextMenuRadioGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
