import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@erbium/ui/components/context-menu";
import { ContextMenuBasic } from "../examples/upstream/context-menu-basic";
import { ContextMenuSubmenu } from "../examples/upstream/context-menu-submenu";
import { ContextMenuShortcuts } from "../examples/upstream/context-menu-shortcuts";
import { ContextMenuGroups } from "../examples/upstream/context-menu-groups";
import { ContextMenuIcons } from "../examples/upstream/context-menu-icons";
import { ContextMenuCheckboxes } from "../examples/upstream/context-menu-checkboxes";
import { ContextMenuRadio } from "../examples/upstream/context-menu-radio";
import { ContextMenuDestructive } from "../examples/upstream/context-menu-destructive";
import { ContextMenuSides } from "../examples/upstream/context-menu-sides";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/context-menu-demo";

const meta = {
  title: "UI/Context Menu",
  component: ContextMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a menu of actions triggered by a right click.\n\n**Import:** `@erbium/ui/components/context-menu`  \n\n**shadcn/ui page:** [Context Menu](https://ui.shadcn.com/docs/components/base/context-menu)\n\n### Usage\n\n```tsx\nimport {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuItem,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu"\n```\n\n```tsx\n<ContextMenu>\n  <ContextMenuTrigger>Right click here</ContextMenuTrigger>\n  <ContextMenuContent>\n    <ContextMenuItem>Profile</ContextMenuItem>\n    <ContextMenuItem>Billing</ContextMenuItem>\n    <ContextMenuItem>Team</ContextMenuItem>\n    <ContextMenuItem>Subscription</ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>\n```\n\n### Composition\n\nUse the following composition to build a `ContextMenu`:\n\n```text\nContextMenu\n├── ContextMenuTrigger\n└── ContextMenuContent\n    ├── ContextMenuGroup\n    │   ├── ContextMenuLabel\n    │   ├── ContextMenuItem\n    │   └── ContextMenuItem\n    ├── ContextMenuSeparator\n    ├── ContextMenuGroup\n    │   ├── ContextMenuLabel\n    │   ├── ContextMenuCheckboxItem\n    │   └── ContextMenuCheckboxItem\n    ├── ContextMenuSeparator\n    ├── ContextMenuGroup\n    │   ├── ContextMenuLabel\n    │   └── ContextMenuRadioGroup\n    │       ├── ContextMenuRadioItem\n    │       └── ContextMenuRadioItem\n    └── ContextMenuSub\n        ├── ContextMenuSubTrigger\n        └── ContextMenuSubContent\n            └── ContextMenuGroup\n                ├── ContextMenuItem\n                └── ContextMenuItem\n```',
      },
    },
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
}> = {
  args: { side: "bottom", align: "start" },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
  },
  render: (args) => (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-xl border border-dashed bg-surface-panel p-8">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent side={args.side} align={args.align}>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuCheckboxItem,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuLabel,\n  ContextMenuRadioGroup,\n  ContextMenuRadioItem,\n  ContextMenuSeparator,\n  ContextMenuShortcut,\n  ContextMenuSub,\n  ContextMenuSubContent,\n  ContextMenuSubTrigger,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport default function ContextMenuDemo() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        Right click here\n      </ContextMenuTrigger>\n      <ContextMenuContent className="w-52">\n        <ContextMenuItem inset>\n          Back\n          <ContextMenuShortcut hotkey="Mod+[" />\n        </ContextMenuItem>\n        <ContextMenuItem inset disabled>\n          Forward\n          <ContextMenuShortcut hotkey="Mod+]" />\n        </ContextMenuItem>\n        <ContextMenuItem inset>\n          Reload\n          <ContextMenuShortcut hotkey="Mod+R" />\n        </ContextMenuItem>\n        <ContextMenuSub>\n          <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>\n          <ContextMenuSubContent className="w-44">\n            <ContextMenuItem>Save Page...</ContextMenuItem>\n            <ContextMenuItem>Create Shortcut...</ContextMenuItem>\n            <ContextMenuItem>Name Window...</ContextMenuItem>\n            <ContextMenuSeparator />\n            <ContextMenuItem>Developer Tools</ContextMenuItem>\n            <ContextMenuSeparator />\n            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>\n          </ContextMenuSubContent>\n        </ContextMenuSub>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>\n          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuRadioGroup value="pedro">\n          <ContextMenuLabel inset>People</ContextMenuLabel>\n          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>\n          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>\n        </ContextMenuRadioGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A simple context menu with a few actions." },
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuBasic() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuItem>Back</ContextMenuItem>\n          <ContextMenuItem disabled>Forward</ContextMenuItem>\n          <ContextMenuItem>Reload</ContextMenuItem>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuBasic />,
};
export const Submenu: Story = {
  parameters: {
    docs: {
      description: { story: "Use `ContextMenuSub` to nest secondary actions." },
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuSeparator,\n  ContextMenuShortcut,\n  ContextMenuSub,\n  ContextMenuSubContent,\n  ContextMenuSubTrigger,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuSubmenu() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuItem>\n            Copy\n            <ContextMenuShortcut hotkey="Mod+C" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Cut\n            <ContextMenuShortcut hotkey="Mod+X" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSub>\n          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>\n          <ContextMenuSubContent>\n            <ContextMenuGroup>\n              <ContextMenuItem>Save Page...</ContextMenuItem>\n              <ContextMenuItem>Create Shortcut...</ContextMenuItem>\n              <ContextMenuItem>Name Window...</ContextMenuItem>\n            </ContextMenuGroup>\n            <ContextMenuSeparator />\n            <ContextMenuGroup>\n              <ContextMenuItem>Developer Tools</ContextMenuItem>\n            </ContextMenuGroup>\n            <ContextMenuSeparator />\n            <ContextMenuGroup>\n              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>\n            </ContextMenuGroup>\n          </ContextMenuSubContent>\n        </ContextMenuSub>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuSubmenu />,
};
export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: "Add `ContextMenuShortcut` to show keyboard hints." },
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuSeparator,\n  ContextMenuShortcut,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuShortcuts() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuItem>\n            Back\n            <ContextMenuShortcut hotkey="Mod+[" />\n          </ContextMenuItem>\n          <ContextMenuItem disabled>\n            Forward\n            <ContextMenuShortcut hotkey="Mod+]" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Reload\n            <ContextMenuShortcut hotkey="Mod+R" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuItem>\n            Save\n            <ContextMenuShortcut hotkey="Mod+S" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Save As...\n            <ContextMenuShortcut hotkey="Shift+Mod+S" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuShortcuts />,
};
export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: "Group related actions and separate them with dividers." },
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuLabel,\n  ContextMenuSeparator,\n  ContextMenuShortcut,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuGroups() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuLabel>File</ContextMenuLabel>\n          <ContextMenuItem>\n            New File\n            <ContextMenuShortcut hotkey="Mod+N" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Open File\n            <ContextMenuShortcut hotkey="Mod+O" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Save\n            <ContextMenuShortcut hotkey="Mod+S" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuLabel>Edit</ContextMenuLabel>\n          <ContextMenuItem>\n            Undo\n            <ContextMenuShortcut hotkey="Mod+Z" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Redo\n            <ContextMenuShortcut hotkey="Shift+Mod+Z" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuItem>\n            Cut\n            <ContextMenuShortcut hotkey="Mod+X" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Copy\n            <ContextMenuShortcut hotkey="Mod+C" />\n          </ContextMenuItem>\n          <ContextMenuItem>\n            Paste\n            <ContextMenuShortcut hotkey="Mod+V" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuItem variant="destructive">\n            Delete\n            <ContextMenuShortcut hotkey="Backspace" />\n          </ContextMenuItem>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuGroups />,
};
export const Icons: Story = {
  parameters: {
    docs: {
      description: { story: "Combine icons with labels for quick scanning." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ClipboardPasteIcon from "@hugeicons/core-free-icons/ClipboardPasteIcon";\nimport CopyIcon from "@hugeicons/core-free-icons/CopyIcon";\nimport ScissorsIcon from "@hugeicons/core-free-icons/ScissorsIcon";\nimport TrashIcon from "@hugeicons/core-free-icons/TrashIcon";\n\n\nimport {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuSeparator,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuIcons() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuItem>\n            <HugeiconsIcon icon={CopyIcon} />\n            Copy\n          </ContextMenuItem>\n          <ContextMenuItem>\n            <HugeiconsIcon icon={ScissorsIcon} />\n            Cut\n          </ContextMenuItem>\n          <ContextMenuItem>\n            <HugeiconsIcon icon={ClipboardPasteIcon} />\n            Paste\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuItem variant="destructive">\n            <HugeiconsIcon icon={TrashIcon} />\n            Delete\n          </ContextMenuItem>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuIcons />,
};
export const Checkboxes: Story = {
  parameters: {
    docs: {
      description: { story: "Use `ContextMenuCheckboxItem` for toggles." },
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuCheckboxItem,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuCheckboxes() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuCheckboxItem defaultChecked>Show Bookmarks Bar</ContextMenuCheckboxItem>\n          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>\n          <ContextMenuCheckboxItem defaultChecked>Show Developer Tools</ContextMenuCheckboxItem>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuCheckboxes />,
};
export const Radio: Story = {
  parameters: {
    docs: {
      description: { story: "Use `ContextMenuRadioItem` for exclusive choices." },
      source: {
        code: 'import * as React from "react";\n\nimport {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuLabel,\n  ContextMenuRadioGroup,\n  ContextMenuRadioItem,\n  ContextMenuSeparator,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuRadio() {\n  const [user, setUser] = React.useState("pedro");\n  const [theme, setTheme] = React.useState("light");\n\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuLabel>People</ContextMenuLabel>\n          <ContextMenuRadioGroup value={user} onValueChange={setUser}>\n            <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>\n            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>\n          </ContextMenuRadioGroup>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuLabel>Theme</ContextMenuLabel>\n          <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>\n            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>\n            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>\n            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>\n          </ContextMenuRadioGroup>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuRadio />,
};
export const Destructive: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `variant="destructive"` to style the menu item as destructive.' },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport PencilIcon from "@hugeicons/core-free-icons/PencilIcon";\nimport Share01Icon from "@hugeicons/core-free-icons/Share01Icon";\nimport TrashIcon from "@hugeicons/core-free-icons/TrashIcon";\n\n\nimport {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuSeparator,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuDestructive() {\n  return (\n    <ContextMenu>\n      <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n        <span className="hidden pointer-fine:inline-block">Right click here</span>\n        <span className="hidden pointer-coarse:inline-block">Long press here</span>\n      </ContextMenuTrigger>\n      <ContextMenuContent>\n        <ContextMenuGroup>\n          <ContextMenuItem>\n            <HugeiconsIcon icon={PencilIcon} />\n            Edit\n          </ContextMenuItem>\n          <ContextMenuItem>\n            <HugeiconsIcon icon={Share01Icon} />\n            Share\n          </ContextMenuItem>\n        </ContextMenuGroup>\n        <ContextMenuSeparator />\n        <ContextMenuGroup>\n          <ContextMenuItem variant="destructive">\n            <HugeiconsIcon icon={TrashIcon} />\n            Delete\n          </ContextMenuItem>\n        </ContextMenuGroup>\n      </ContextMenuContent>\n    </ContextMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuDestructive />,
};
export const Sides: Story = {
  parameters: {
    docs: {
      description: { story: "Control submenu placement with side and align props." },
      source: {
        code: 'import {\n  ContextMenu,\n  ContextMenuContent,\n  ContextMenuGroup,\n  ContextMenuItem,\n  ContextMenuTrigger,\n} from "@erbium/ui/components/context-menu";\n\nexport function ContextMenuSides() {\n  return (\n    <div className="grid w-full max-w-sm grid-cols-2 gap-4">\n      <ContextMenu>\n        <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n          <span className="hidden pointer-fine:inline-block">Right click (top)</span>\n          <span className="hidden pointer-coarse:inline-block">Long press (top)</span>\n        </ContextMenuTrigger>\n        <ContextMenuContent side="top">\n          <ContextMenuGroup>\n            <ContextMenuItem>Back</ContextMenuItem>\n            <ContextMenuItem>Forward</ContextMenuItem>\n            <ContextMenuItem>Reload</ContextMenuItem>\n          </ContextMenuGroup>\n        </ContextMenuContent>\n      </ContextMenu>\n      <ContextMenu>\n        <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n          <span className="hidden pointer-fine:inline-block">Right click (right)</span>\n          <span className="hidden pointer-coarse:inline-block">Long press (right)</span>\n        </ContextMenuTrigger>\n        <ContextMenuContent side="right">\n          <ContextMenuGroup>\n            <ContextMenuItem>Back</ContextMenuItem>\n            <ContextMenuItem>Forward</ContextMenuItem>\n            <ContextMenuItem>Reload</ContextMenuItem>\n          </ContextMenuGroup>\n        </ContextMenuContent>\n      </ContextMenu>\n      <ContextMenu>\n        <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n          <span className="hidden pointer-fine:inline-block">Right click (bottom)</span>\n          <span className="hidden pointer-coarse:inline-block">Long press (bottom)</span>\n        </ContextMenuTrigger>\n        <ContextMenuContent side="bottom">\n          <ContextMenuGroup>\n            <ContextMenuItem>Back</ContextMenuItem>\n            <ContextMenuItem>Forward</ContextMenuItem>\n            <ContextMenuItem>Reload</ContextMenuItem>\n          </ContextMenuGroup>\n        </ContextMenuContent>\n      </ContextMenu>\n      <ContextMenu>\n        <ContextMenuTrigger className="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed bg-surface-panel text-sm">\n          <span className="hidden pointer-fine:inline-block">Right click (left)</span>\n          <span className="hidden pointer-coarse:inline-block">Long press (left)</span>\n        </ContextMenuTrigger>\n        <ContextMenuContent side="left">\n          <ContextMenuGroup>\n            <ContextMenuItem>Back</ContextMenuItem>\n            <ContextMenuItem>Forward</ContextMenuItem>\n            <ContextMenuItem>Reload</ContextMenuItem>\n          </ContextMenuGroup>\n        </ContextMenuContent>\n      </ContextMenu>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ContextMenuSides />,
};
