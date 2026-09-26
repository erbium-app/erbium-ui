import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@erbium/ui/components/command";
import { CommandBasic } from "../examples/upstream/command-basic";
import { CommandWithShortcuts } from "../examples/upstream/command-shortcuts";
import { CommandWithGroups } from "../examples/upstream/command-groups";
import { CommandManyItems } from "../examples/upstream/command-scrollable";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Command } from "@erbium/ui/components/command";
import Demo from "../examples/command-demo";

const meta = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Command menu for search and quick actions.\n\n**Import:** `@erbium/ui/components/command`  \n\n**shadcn/ui page:** [Command](https://ui.shadcn.com/docs/components/base/command)\n\n### About\n\nThe `<Command />` component uses the [`cmdk`](https://github.com/dip/cmdk) component by [Dip](https://www.dip.org/).\n\n### Usage\n\n```tsx\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command"\n```\n\n```tsx\n<Command className="max-w-sm rounded-lg border">\n  <CommandInput placeholder="Type a command or search..." />\n  <CommandList>\n    <CommandEmpty>No results found.</CommandEmpty>\n    <CommandGroup heading="Suggestions">\n      <CommandItem>Calendar</CommandItem>\n      <CommandItem>Search Emoji</CommandItem>\n      <CommandItem>Calculator</CommandItem>\n    </CommandGroup>\n    <CommandSeparator />\n    <CommandGroup heading="Settings">\n      <CommandItem>Profile</CommandItem>\n      <CommandItem>Billing</CommandItem>\n      <CommandItem>Settings</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>\n```\n\n### Composition\n\nUse the following composition to build a `Command`:\n\n```text\nCommand\n├── CommandInput\n└── CommandList\n    ├── CommandEmpty\n    ├── CommandGroup\n    │   ├── CommandItem\n    │   └── CommandItem\n    ├── CommandSeparator\n    └── CommandGroup\n        ├── CommandItem\n        └── CommandItem\n```',
      },
    },
  },
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{ placeholder: string; disabled: boolean }> = {
  args: { placeholder: "Search commands", disabled: false },
  argTypes: { placeholder: { control: "text" }, disabled: { control: "boolean" } },
  render: (args) => (
    <Command className="w-72 rounded border">
      <CommandInput placeholder={args.placeholder} disabled={args.disabled} />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>Open file</CommandItem>
          <CommandItem>Open settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Calculator, Calendar, CreditCard, Settings, Smile, User } from "lucide-react";\n\nimport {\n  Command,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport default function CommandDemo() {\n  return (\n    <Command className="rounded-lg border shadow-md md:min-w-[450px]">\n      <CommandInput placeholder="Type a command or search..." />\n      <CommandList>\n        <CommandEmpty>No results found.</CommandEmpty>\n        <CommandGroup heading="Suggestions">\n          <CommandItem>\n            <Calendar />\n            <span>Calendar</span>\n          </CommandItem>\n          <CommandItem>\n            <Smile />\n            <span>Search Emoji</span>\n          </CommandItem>\n          <CommandItem disabled>\n            <Calculator />\n            <span>Calculator</span>\n          </CommandItem>\n        </CommandGroup>\n        <CommandSeparator />\n        <CommandGroup heading="Settings">\n          <CommandItem>\n            <User />\n            <span>Profile</span>\n            <CommandShortcut>⌘P</CommandShortcut>\n          </CommandItem>\n          <CommandItem>\n            <CreditCard />\n            <span>Billing</span>\n            <CommandShortcut>⌘B</CommandShortcut>\n          </CommandItem>\n          <CommandItem>\n            <Settings />\n            <span>Settings</span>\n            <CommandShortcut>⌘S</CommandShortcut>\n          </CommandItem>\n        </CommandGroup>\n      </CommandList>\n    </Command>\n  );\n}\n',
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
      description: { story: "A simple command menu in a dialog." },
      source: {
        code: 'import * as React from "react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n} from "@erbium/ui/components/command";\n\nexport function CommandBasic() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Suggestions">\n              <CommandItem>Calendar</CommandItem>\n              <CommandItem>Search Emoji</CommandItem>\n              <CommandItem>Calculator</CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CommandBasic />,
};
export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: "Display keyboard shortcuts alongside command items." },

      source: {
        code: 'import * as React from "react";\nimport { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport function CommandWithShortcuts() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Settings">\n              <CommandItem>\n                <UserIcon />\n                <span>Profile</span>\n                <CommandShortcut>⌘P</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <CreditCardIcon />\n                <span>Billing</span>\n                <CommandShortcut>⌘B</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <SettingsIcon />\n                <span>Settings</span>\n                <CommandShortcut>⌘S</CommandShortcut>\n              </CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CommandWithShortcuts />,
};
export const Groups: Story = {
  parameters: {
    docs: {
      description: { story: "A command menu with groups, icons and separators." },
      source: {
        code: 'import * as React from "react";\nimport {\n  CalculatorIcon,\n  CalendarIcon,\n  CreditCardIcon,\n  SettingsIcon,\n  SmileIcon,\n  UserIcon,\n} from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport function CommandWithGroups() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Suggestions">\n              <CommandItem>\n                <CalendarIcon />\n                <span>Calendar</span>\n              </CommandItem>\n              <CommandItem>\n                <SmileIcon />\n                <span>Search Emoji</span>\n              </CommandItem>\n              <CommandItem>\n                <CalculatorIcon />\n                <span>Calculator</span>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Settings">\n              <CommandItem>\n                <UserIcon />\n                <span>Profile</span>\n                <CommandShortcut>⌘P</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <CreditCardIcon />\n                <span>Billing</span>\n                <CommandShortcut>⌘B</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <SettingsIcon />\n                <span>Settings</span>\n                <CommandShortcut>⌘S</CommandShortcut>\n              </CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CommandWithGroups />,
};
export const Scrollable: Story = {
  parameters: {
    docs: {
      description: { story: "Scrollable command menu with multiple items." },
      source: {
        code: 'import * as React from "react";\nimport {\n  BellIcon,\n  CalculatorIcon,\n  CalendarIcon,\n  ClipboardPasteIcon,\n  CodeIcon,\n  CopyIcon,\n  CreditCardIcon,\n  FileTextIcon,\n  FolderIcon,\n  FolderPlusIcon,\n  HelpCircleIcon,\n  HomeIcon,\n  ImageIcon,\n  InboxIcon,\n  LayoutGridIcon,\n  ListIcon,\n  PlusIcon,\n  ScissorsIcon,\n  SettingsIcon,\n  TrashIcon,\n  UserIcon,\n  ZoomInIcon,\n  ZoomOutIcon,\n} from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport function CommandManyItems() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Navigation">\n              <CommandItem>\n                <HomeIcon />\n                <span>Home</span>\n                <CommandShortcut>⌘H</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <InboxIcon />\n                <span>Inbox</span>\n                <CommandShortcut>⌘I</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <FileTextIcon />\n                <span>Documents</span>\n                <CommandShortcut>⌘D</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <FolderIcon />\n                <span>Folders</span>\n                <CommandShortcut>⌘F</CommandShortcut>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Actions">\n              <CommandItem>\n                <PlusIcon />\n                <span>New File</span>\n                <CommandShortcut>⌘N</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <FolderPlusIcon />\n                <span>New Folder</span>\n                <CommandShortcut>⇧⌘N</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <CopyIcon />\n                <span>Copy</span>\n                <CommandShortcut>⌘C</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <ScissorsIcon />\n                <span>Cut</span>\n                <CommandShortcut>⌘X</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <ClipboardPasteIcon />\n                <span>Paste</span>\n                <CommandShortcut>⌘V</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <TrashIcon />\n                <span>Delete</span>\n                <CommandShortcut>⌫</CommandShortcut>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="View">\n              <CommandItem>\n                <LayoutGridIcon />\n                <span>Grid View</span>\n              </CommandItem>\n              <CommandItem>\n                <ListIcon />\n                <span>List View</span>\n              </CommandItem>\n              <CommandItem>\n                <ZoomInIcon />\n                <span>Zoom In</span>\n                <CommandShortcut>⌘+</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <ZoomOutIcon />\n                <span>Zoom Out</span>\n                <CommandShortcut>⌘-</CommandShortcut>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Account">\n              <CommandItem>\n                <UserIcon />\n                <span>Profile</span>\n                <CommandShortcut>⌘P</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <CreditCardIcon />\n                <span>Billing</span>\n                <CommandShortcut>⌘B</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <SettingsIcon />\n                <span>Settings</span>\n                <CommandShortcut>⌘S</CommandShortcut>\n              </CommandItem>\n              <CommandItem>\n                <BellIcon />\n                <span>Notifications</span>\n              </CommandItem>\n              <CommandItem>\n                <HelpCircleIcon />\n                <span>Help & Support</span>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Tools">\n              <CommandItem>\n                <CalculatorIcon />\n                <span>Calculator</span>\n              </CommandItem>\n              <CommandItem>\n                <CalendarIcon />\n                <span>Calendar</span>\n              </CommandItem>\n              <CommandItem>\n                <ImageIcon />\n                <span>Image Editor</span>\n              </CommandItem>\n              <CommandItem>\n                <CodeIcon />\n                <span>Code Editor</span>\n              </CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CommandManyItems />,
};
