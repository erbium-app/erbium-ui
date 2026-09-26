import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@erbium/ui/components/menubar";
import { MenubarIcons } from "../examples/upstream/menubar-icons";
import { MenubarCheckbox } from "../examples/upstream/menubar-checkbox";
import { MenubarRadio } from "../examples/upstream/menubar-radio";
import { MenubarSubmenu } from "../examples/upstream/menubar-submenu";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/menubar-demo";

const meta = {
  title: "UI/Menubar",
  component: Menubar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.\n\n**Import:** `@erbium/ui/components/menubar`  \n\n**shadcn/ui page:** [Menubar](https://ui.shadcn.com/docs/components/base/menubar)\n\n### Usage\n\n```tsx\nimport {\n  Menubar,\n  MenubarContent,\n  MenubarGroup,\n  MenubarItem,\n  MenubarMenu,\n  MenubarSeparator,\n  MenubarShortcut,\n  MenubarTrigger,\n} from "@erbium/ui/components/menubar"\n```\n\n```tsx\n<Menubar>\n  <MenubarMenu>\n    <MenubarTrigger>File</MenubarTrigger>\n    <MenubarContent>\n      <MenubarGroup>\n        <MenubarItem>\n          New Tab <MenubarShortcut>⌘T</MenubarShortcut>\n        </MenubarItem>\n        <MenubarItem>New Window</MenubarItem>\n      </MenubarGroup>\n      <MenubarSeparator />\n      <MenubarGroup>\n        <MenubarItem>Share</MenubarItem>\n        <MenubarItem>Print</MenubarItem>\n      </MenubarGroup>\n    </MenubarContent>\n  </MenubarMenu>\n</Menubar>\n```\n\n### Composition\n\nUse the following composition to build a `Menubar`:\n\n```text\nMenubar\n├── MenubarMenu\n│   ├── MenubarTrigger\n│   └── MenubarContent\n│       ├── MenubarGroup\n│       │   ├── MenubarLabel\n│       │   ├── MenubarItem\n│       │   └── MenubarItem\n│       ├── MenubarSeparator\n│       ├── MenubarGroup\n│       │   ├── MenubarLabel\n│       │   ├── MenubarCheckboxItem\n│       │   └── MenubarCheckboxItem\n│       ├── MenubarSeparator\n│       ├── MenubarGroup\n│       │   ├── MenubarLabel\n│       │   └── MenubarRadioGroup\n│       │       ├── MenubarRadioItem\n│       │       └── MenubarRadioItem\n│       └── MenubarSub\n│           ├── MenubarSubTrigger\n│           └── MenubarSubContent\n│               └── MenubarGroup\n│                   ├── MenubarLabel\n│                   ├── MenubarItem\n│                   └── MenubarItem\n└── MenubarMenu\n    ├── MenubarTrigger\n    └── MenubarContent\n        └── MenubarGroup\n            ├── MenubarLabel\n            ├── MenubarItem\n            └── MenubarItem\n```',
      },
    },
  },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  className: string;
  align: "start" | "center" | "end";
  itemVariant: "default" | "destructive";
  disabled: boolean;
}> = {
  args: { className: "", align: "start", itemVariant: "default", disabled: false },
  argTypes: {
    className: { control: "text" },
    align: { control: "select", options: ["start", "center", "end"] },
    itemVariant: { control: "select", options: ["default", "destructive"] },
    disabled: { control: "boolean" },
  },
  render: (args) => (
    <Menubar className={args.className}>
      <MenubarMenu>
        <MenubarTrigger disabled={args.disabled}>File</MenubarTrigger>
        <MenubarContent align={args.align}>
          <MenubarItem variant={args.itemVariant}>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Menubar,\n  MenubarCheckboxItem,\n  MenubarContent,\n  MenubarItem,\n  MenubarMenu,\n  MenubarRadioGroup,\n  MenubarRadioItem,\n  MenubarSeparator,\n  MenubarShortcut,\n  MenubarSub,\n  MenubarSubContent,\n  MenubarSubTrigger,\n  MenubarTrigger,\n} from "@erbium/ui/components/menubar";\n\nexport default function MenubarDemo() {\n  return (\n    <Menubar>\n      <MenubarMenu>\n        <MenubarTrigger>File</MenubarTrigger>\n        <MenubarContent>\n          <MenubarItem>\n            New Tab <MenubarShortcut>⌘T</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem>\n            New Window <MenubarShortcut>⌘N</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem disabled>New Incognito Window</MenubarItem>\n          <MenubarSeparator />\n          <MenubarSub>\n            <MenubarSubTrigger>Share</MenubarSubTrigger>\n            <MenubarSubContent>\n              <MenubarItem>Email link</MenubarItem>\n              <MenubarItem>Messages</MenubarItem>\n              <MenubarItem>Notes</MenubarItem>\n            </MenubarSubContent>\n          </MenubarSub>\n          <MenubarSeparator />\n          <MenubarItem>\n            Print... <MenubarShortcut>⌘P</MenubarShortcut>\n          </MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>Edit</MenubarTrigger>\n        <MenubarContent>\n          <MenubarItem>\n            Undo <MenubarShortcut>⌘Z</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem>\n            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>\n          </MenubarItem>\n          <MenubarSeparator />\n          <MenubarSub>\n            <MenubarSubTrigger>Find</MenubarSubTrigger>\n            <MenubarSubContent>\n              <MenubarItem>Search the web</MenubarItem>\n              <MenubarSeparator />\n              <MenubarItem>Find...</MenubarItem>\n              <MenubarItem>Find Next</MenubarItem>\n              <MenubarItem>Find Previous</MenubarItem>\n            </MenubarSubContent>\n          </MenubarSub>\n          <MenubarSeparator />\n          <MenubarItem>Cut</MenubarItem>\n          <MenubarItem>Copy</MenubarItem>\n          <MenubarItem>Paste</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>View</MenubarTrigger>\n        <MenubarContent>\n          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>\n          <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>\n          <MenubarSeparator />\n          <MenubarItem inset>\n            Reload <MenubarShortcut>⌘R</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem disabled inset>\n            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>\n          </MenubarItem>\n          <MenubarSeparator />\n          <MenubarItem inset>Toggle Fullscreen</MenubarItem>\n          <MenubarSeparator />\n          <MenubarItem inset>Hide Sidebar</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>Profiles</MenubarTrigger>\n        <MenubarContent>\n          <MenubarRadioGroup value="benoit">\n            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>\n            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>\n            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>\n          </MenubarRadioGroup>\n          <MenubarSeparator />\n          <MenubarItem inset>Edit...</MenubarItem>\n          <MenubarSeparator />\n          <MenubarItem inset>Add Profile...</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n    </Menubar>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Checkbox: Story = {
  parameters: {
    docs: {
      description: { story: "Use `MenubarCheckboxItem` for toggleable options." },
      source: {
        code: 'import {\n  Menubar,\n  MenubarCheckboxItem,\n  MenubarContent,\n  MenubarItem,\n  MenubarMenu,\n  MenubarSeparator,\n  MenubarShortcut,\n  MenubarTrigger,\n} from "@erbium/ui/components/menubar";\n\nexport function MenubarCheckbox() {\n  return (\n    <Menubar className="w-72">\n      <MenubarMenu>\n        <MenubarTrigger>View</MenubarTrigger>\n        <MenubarContent className="w-64">\n          <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>\n          <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>\n          <MenubarSeparator />\n          <MenubarItem inset>\n            Reload <MenubarShortcut>⌘R</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem disabled inset>\n            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>\n          </MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>Format</MenubarTrigger>\n        <MenubarContent>\n          <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>\n          <MenubarCheckboxItem>Code</MenubarCheckboxItem>\n          <MenubarCheckboxItem>Superscript</MenubarCheckboxItem>\n        </MenubarContent>\n      </MenubarMenu>\n    </Menubar>\n  );\n}\n',
      },
    },
  },
  render: () => <MenubarCheckbox />,
};
export const Radio: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `MenubarRadioGroup` and `MenubarRadioItem` for single-select options.",
      },
      source: {
        code: 'import * as React from "react";\n\nimport {\n  Menubar,\n  MenubarContent,\n  MenubarItem,\n  MenubarMenu,\n  MenubarRadioGroup,\n  MenubarRadioItem,\n  MenubarSeparator,\n  MenubarTrigger,\n} from "@erbium/ui/components/menubar";\n\nexport function MenubarRadio() {\n  const [user, setUser] = React.useState("benoit");\n  const [theme, setTheme] = React.useState("system");\n\n  return (\n    <Menubar className="w-72">\n      <MenubarMenu>\n        <MenubarTrigger>Profiles</MenubarTrigger>\n        <MenubarContent>\n          <MenubarRadioGroup value={user} onValueChange={setUser}>\n            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>\n            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>\n            <MenubarRadioItem value="luis">Luis</MenubarRadioItem>\n          </MenubarRadioGroup>\n          <MenubarSeparator />\n          <MenubarItem inset>Edit...</MenubarItem>\n          <MenubarItem inset>Add Profile...</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>Theme</MenubarTrigger>\n        <MenubarContent>\n          <MenubarRadioGroup value={theme} onValueChange={setTheme}>\n            <MenubarRadioItem value="light">Light</MenubarRadioItem>\n            <MenubarRadioItem value="dark">Dark</MenubarRadioItem>\n            <MenubarRadioItem value="system">System</MenubarRadioItem>\n          </MenubarRadioGroup>\n        </MenubarContent>\n      </MenubarMenu>\n    </Menubar>\n  );\n}\n',
      },
    },
  },
  render: () => <MenubarRadio />,
};
export const Submenu: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use `MenubarSub`, `MenubarSubTrigger`, and `MenubarSubContent` for nested menus.",
      },
      source: {
        code: 'import {\n  Menubar,\n  MenubarContent,\n  MenubarItem,\n  MenubarMenu,\n  MenubarSeparator,\n  MenubarShortcut,\n  MenubarSub,\n  MenubarSubContent,\n  MenubarSubTrigger,\n  MenubarTrigger,\n} from "@erbium/ui/components/menubar";\n\nexport function MenubarSubmenu() {\n  return (\n    <Menubar className="w-72">\n      <MenubarMenu>\n        <MenubarTrigger>File</MenubarTrigger>\n        <MenubarContent>\n          <MenubarSub>\n            <MenubarSubTrigger>Share</MenubarSubTrigger>\n            <MenubarSubContent>\n              <MenubarItem>Email link</MenubarItem>\n              <MenubarItem>Messages</MenubarItem>\n              <MenubarItem>Notes</MenubarItem>\n            </MenubarSubContent>\n          </MenubarSub>\n          <MenubarSeparator />\n          <MenubarItem>\n            Print... <MenubarShortcut>⌘P</MenubarShortcut>\n          </MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>Edit</MenubarTrigger>\n        <MenubarContent>\n          <MenubarItem>\n            Undo <MenubarShortcut>⌘Z</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem>\n            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>\n          </MenubarItem>\n          <MenubarSeparator />\n          <MenubarSub>\n            <MenubarSubTrigger>Find</MenubarSubTrigger>\n            <MenubarSubContent>\n              <MenubarItem>Find...</MenubarItem>\n              <MenubarItem>Find Next</MenubarItem>\n              <MenubarItem>Find Previous</MenubarItem>\n            </MenubarSubContent>\n          </MenubarSub>\n          <MenubarSeparator />\n          <MenubarItem>Cut</MenubarItem>\n          <MenubarItem>Copy</MenubarItem>\n          <MenubarItem>Paste</MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n    </Menubar>\n  );\n}\n',
      },
    },
  },
  render: () => <MenubarSubmenu />,
};

export const WithIcons: Story = {
  parameters: {
    docs: {
      description: { story: "Add icons to menu items to make actions easier to scan." },

      source: {
        code: 'import {\n  FileIcon,\n  FolderIcon,\n  HelpCircleIcon,\n  SaveIcon,\n  SettingsIcon,\n  TrashIcon,\n} from "lucide-react";\n\nimport {\n  Menubar,\n  MenubarContent,\n  MenubarGroup,\n  MenubarItem,\n  MenubarMenu,\n  MenubarSeparator,\n  MenubarShortcut,\n  MenubarTrigger,\n} from "@erbium/ui/components/menubar";\n\nexport function MenubarIcons() {\n  return (\n    <Menubar className="w-72">\n      <MenubarMenu>\n        <MenubarTrigger>File</MenubarTrigger>\n        <MenubarContent>\n          <MenubarItem>\n            <FileIcon />\n            New File <MenubarShortcut>⌘N</MenubarShortcut>\n          </MenubarItem>\n          <MenubarItem>\n            <FolderIcon />\n            Open Folder\n          </MenubarItem>\n          <MenubarSeparator />\n          <MenubarItem>\n            <SaveIcon />\n            Save <MenubarShortcut>⌘S</MenubarShortcut>\n          </MenubarItem>\n        </MenubarContent>\n      </MenubarMenu>\n      <MenubarMenu>\n        <MenubarTrigger>More</MenubarTrigger>\n        <MenubarContent>\n          <MenubarGroup>\n            <MenubarItem>\n              <SettingsIcon />\n              Settings\n            </MenubarItem>\n            <MenubarItem>\n              <HelpCircleIcon />\n              Help\n            </MenubarItem>\n            <MenubarSeparator />\n            <MenubarItem variant="destructive">\n              <TrashIcon />\n              Delete\n            </MenubarItem>\n          </MenubarGroup>\n        </MenubarContent>\n      </MenubarMenu>\n    </Menubar>\n  );\n}\n',
      },
    },
  },
  render: () => <MenubarIcons />,
};
