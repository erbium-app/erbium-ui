import ExampleDropdownMenuRadioGroup from "../examples/dropdown-menu-radio-group";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { DropdownMenu } from "@erbium/ui/components/dropdown-menu";
import Demo from "../examples/dropdown-menu-demo";

const meta = {
  title: "UI/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a menu to the user — such as a set of actions or functions — triggered by a button.\n\n**Import:** `@erbium/ui/components/dropdown-menu`  \n\n**shadcn/ui page:** [Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu)\n\n### Usage\n\n```tsx\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\n```\n\n```tsx\n<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="outline" />}>\n    Open\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuGroup>\n      <DropdownMenuLabel>My Account</DropdownMenuLabel>\n      <DropdownMenuItem>Profile</DropdownMenuItem>\n      <DropdownMenuItem>Billing</DropdownMenuItem>\n    </DropdownMenuGroup>\n    <DropdownMenuSeparator />\n    <DropdownMenuGroup>\n      <DropdownMenuItem>Team</DropdownMenuItem>\n      <DropdownMenuItem>Subscription</DropdownMenuItem>\n    </DropdownMenuGroup>\n  </DropdownMenuContent>\n</DropdownMenu>\n```\n\n### Composition\n\nUse the following composition to build a `DropdownMenu`:\n\n```text\nDropdownMenu\n├── DropdownMenuTrigger\n└── DropdownMenuContent\n    ├── DropdownMenuGroup\n    │   ├── DropdownMenuLabel\n    │   ├── DropdownMenuItem\n    │   └── DropdownMenuItem\n    ├── DropdownMenuSeparator\n    ├── DropdownMenuGroup\n    │   ├── DropdownMenuLabel\n    │   ├── DropdownMenuCheckboxItem\n    │   └── DropdownMenuCheckboxItem\n    ├── DropdownMenuSeparator\n    ├── DropdownMenuGroup\n    │   ├── DropdownMenuLabel\n    │   └── DropdownMenuRadioGroup\n    │       ├── DropdownMenuRadioItem\n    │       └── DropdownMenuRadioItem\n    └── DropdownMenuSub\n        ├── DropdownMenuSubTrigger\n        └── DropdownMenuSubContent\n            └── DropdownMenuGroup\n                ├── DropdownMenuLabel\n                ├── DropdownMenuItem\n                └── DropdownMenuItem\n```\n\n### Basic\n\nA basic dropdown menu with labels and separators.\n\n### Submenu\n\nUse `DropdownMenuSub` to nest secondary actions.\n\n### Shortcuts\n\nAdd `DropdownMenuShortcut` to show keyboard hints.\n\n### Icons\n\nCombine icons with labels for quick scanning.\n\n### Checkboxes\n\nUse `DropdownMenuCheckboxItem` for toggles.\n\n### Checkboxes Icons\n\nAdd icons to checkbox items.\n\n### Radio Group\n\nUse `DropdownMenuRadioGroup` for exclusive choices.\n\n### Radio Icons\n\nShow radio options with icons.\n\n### Destructive\n\nUse `variant="destructive"` for irreversible actions.\n\n### Avatar\n\nAn account switcher dropdown triggered by an avatar.\n\n### Complex\n\nA richer example combining groups, icons, and submenus.',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuPortal,\n  DropdownMenuSeparator,\n  DropdownMenuShortcut,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport default function DropdownMenuDemo() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />\n      <DropdownMenuContent className="w-56" align="start">\n        <DropdownMenuLabel>My Account</DropdownMenuLabel>\n        <DropdownMenuGroup>\n          <DropdownMenuItem>\n            Profile\n            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Billing\n            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Settings\n            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Keyboard shortcuts\n            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuItem>Team</DropdownMenuItem>\n          <DropdownMenuSub>\n            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>\n            <DropdownMenuPortal>\n              <DropdownMenuSubContent>\n                <DropdownMenuItem>Email</DropdownMenuItem>\n                <DropdownMenuItem>Message</DropdownMenuItem>\n                <DropdownMenuSeparator />\n                <DropdownMenuItem>More...</DropdownMenuItem>\n              </DropdownMenuSubContent>\n            </DropdownMenuPortal>\n          </DropdownMenuSub>\n          <DropdownMenuItem>\n            New Team\n            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>GitHub</DropdownMenuItem>\n        <DropdownMenuItem>Support</DropdownMenuItem>\n        <DropdownMenuItem disabled>API</DropdownMenuItem>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>\n          Log out\n          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>\n        </DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const RadioGroup: Story = {
  parameters: {
    docs: {
      source: {
        code: '\nimport * as React from "react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuLabel,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\n\nexport default function DropdownMenuRadioGroupDemo() {\n  const [position, setPosition] = React.useState("bottom")\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />\n      <DropdownMenuContent className="w-56">\n        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>\n        <DropdownMenuSeparator />\n        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>\n          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>\n          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>\n          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>\n        </DropdownMenuRadioGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleDropdownMenuRadioGroup />
    </div>
  ),
};
