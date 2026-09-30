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
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";\nimport Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";\nimport SmileIcon from "@hugeicons/core-free-icons/SmileIcon";\nimport UserIcon from "@hugeicons/core-free-icons/UserIcon";\n\n\nimport {\n  Command,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport default function CommandDemo() {\n  return (\n    <Command className="rounded-lg border shadow-md md:min-w-[450px]">\n      <CommandInput placeholder="Type a command or search..." />\n      <CommandList>\n        <CommandEmpty>No results found.</CommandEmpty>\n        <CommandGroup heading="Suggestions">\n          <CommandItem>\n            <HugeiconsIcon icon={Calendar01Icon} />\n            <span>Calendar</span>\n          </CommandItem>\n          <CommandItem>\n            <HugeiconsIcon icon={SmileIcon} />\n            <span>Search Emoji</span>\n          </CommandItem>\n          <CommandItem disabled>\n            <HugeiconsIcon icon={CalculatorIcon} />\n            <span>Calculator</span>\n          </CommandItem>\n        </CommandGroup>\n        <CommandSeparator />\n        <CommandGroup heading="Settings">\n          <CommandItem>\n            <HugeiconsIcon icon={UserIcon} />\n            <span>Profile</span>\n            <CommandShortcut hotkey="Mod+P" />\n          </CommandItem>\n          <CommandItem>\n            <HugeiconsIcon icon={CreditCardIcon} />\n            <span>Billing</span>\n            <CommandShortcut hotkey="Mod+B" />\n          </CommandItem>\n          <CommandItem>\n            <HugeiconsIcon icon={Settings01Icon} />\n            <span>Settings</span>\n            <CommandShortcut hotkey="Mod+S" />\n          </CommandItem>\n        </CommandGroup>\n      </CommandList>\n    </Command>\n  );\n}\n',
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
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";\nimport UserIcon from "@hugeicons/core-free-icons/UserIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport function CommandWithShortcuts() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Settings">\n              <CommandItem>\n                <HugeiconsIcon icon={UserIcon} />\n                <span>Profile</span>\n                <CommandShortcut hotkey="Mod+P" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={CreditCardIcon} />\n                <span>Billing</span>\n                <CommandShortcut hotkey="Mod+B" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={Settings01Icon} />\n                <span>Settings</span>\n                <CommandShortcut hotkey="Mod+S" />\n              </CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
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
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";\nimport Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";\nimport SmileIcon from "@hugeicons/core-free-icons/SmileIcon";\nimport UserIcon from "@hugeicons/core-free-icons/UserIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport function CommandWithGroups() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Suggestions">\n              <CommandItem>\n                <HugeiconsIcon icon={Calendar01Icon} />\n                <span>Calendar</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={SmileIcon} />\n                <span>Search Emoji</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={CalculatorIcon} />\n                <span>Calculator</span>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Settings">\n              <CommandItem>\n                <HugeiconsIcon icon={UserIcon} />\n                <span>Profile</span>\n                <CommandShortcut hotkey="Mod+P" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={CreditCardIcon} />\n                <span>Billing</span>\n                <CommandShortcut hotkey="Mod+B" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={Settings01Icon} />\n                <span>Settings</span>\n                <CommandShortcut hotkey="Mod+S" />\n              </CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
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
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport BellIcon from "@hugeicons/core-free-icons/BellIcon";\nimport CalculatorIcon from "@hugeicons/core-free-icons/CalculatorIcon";\nimport Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";\nimport ClipboardPasteIcon from "@hugeicons/core-free-icons/ClipboardPasteIcon";\nimport CodeIcon from "@hugeicons/core-free-icons/CodeIcon";\nimport CopyIcon from "@hugeicons/core-free-icons/CopyIcon";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\nimport Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";\nimport FolderPlusIcon from "@hugeicons/core-free-icons/FolderPlusIcon";\nimport HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";\nimport Home01Icon from "@hugeicons/core-free-icons/Home01Icon";\nimport Image01Icon from "@hugeicons/core-free-icons/Image01Icon";\nimport InboxIcon from "@hugeicons/core-free-icons/InboxIcon";\nimport LayoutGridIcon from "@hugeicons/core-free-icons/LayoutGridIcon";\nimport ListIcon from "@hugeicons/core-free-icons/ListIcon";\nimport PlusIcon from "@hugeicons/core-free-icons/PlusIcon";\nimport ScissorsIcon from "@hugeicons/core-free-icons/ScissorsIcon";\nimport Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";\nimport TrashIcon from "@hugeicons/core-free-icons/TrashIcon";\nimport UserIcon from "@hugeicons/core-free-icons/UserIcon";\nimport ZoomInIcon from "@hugeicons/core-free-icons/ZoomInIcon";\nimport ZoomOutIcon from "@hugeicons/core-free-icons/ZoomOutIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command";\n\nexport function CommandManyItems() {\n  const [open, setOpen] = React.useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">\n        Open Menu\n      </Button>\n      <CommandDialog open={open} onOpenChange={setOpen}>\n        <Command>\n          <CommandInput placeholder="Type a command or search..." />\n          <CommandList>\n            <CommandEmpty>No results found.</CommandEmpty>\n            <CommandGroup heading="Navigation">\n              <CommandItem>\n                <HugeiconsIcon icon={Home01Icon} />\n                <span>Home</span>\n                <CommandShortcut hotkey="Mod+H" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={InboxIcon} />\n                <span>Inbox</span>\n                <CommandShortcut hotkey="Mod+I" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={FileTextIcon} />\n                <span>Documents</span>\n                <CommandShortcut hotkey="Mod+D" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={Folder01Icon} />\n                <span>Folders</span>\n                <CommandShortcut hotkey="Mod+F" />\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Actions">\n              <CommandItem>\n                <HugeiconsIcon icon={PlusIcon} />\n                <span>New File</span>\n                <CommandShortcut hotkey="Mod+N" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={FolderPlusIcon} />\n                <span>New Folder</span>\n                <CommandShortcut hotkey="Shift+Mod+N" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={CopyIcon} />\n                <span>Copy</span>\n                <CommandShortcut hotkey="Mod+C" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={ScissorsIcon} />\n                <span>Cut</span>\n                <CommandShortcut hotkey="Mod+X" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={ClipboardPasteIcon} />\n                <span>Paste</span>\n                <CommandShortcut hotkey="Mod+V" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={TrashIcon} />\n                <span>Delete</span>\n                <CommandShortcut hotkey="Backspace" />\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="View">\n              <CommandItem>\n                <HugeiconsIcon icon={LayoutGridIcon} />\n                <span>Grid View</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={ListIcon} />\n                <span>List View</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={ZoomInIcon} />\n                <span>Zoom In</span>\n                <CommandShortcut hotkey="Mod+Plus" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={ZoomOutIcon} />\n                <span>Zoom Out</span>\n                <CommandShortcut hotkey="Mod+-" />\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Account">\n              <CommandItem>\n                <HugeiconsIcon icon={UserIcon} />\n                <span>Profile</span>\n                <CommandShortcut hotkey="Mod+P" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={CreditCardIcon} />\n                <span>Billing</span>\n                <CommandShortcut hotkey="Mod+B" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={Settings01Icon} />\n                <span>Settings</span>\n                <CommandShortcut hotkey="Mod+S" />\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={BellIcon} />\n                <span>Notifications</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={HelpCircleIcon} />\n                <span>Help & Support</span>\n              </CommandItem>\n            </CommandGroup>\n            <CommandSeparator />\n            <CommandGroup heading="Tools">\n              <CommandItem>\n                <HugeiconsIcon icon={CalculatorIcon} />\n                <span>Calculator</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={Calendar01Icon} />\n                <span>Calendar</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={Image01Icon} />\n                <span>Image Editor</span>\n              </CommandItem>\n              <CommandItem>\n                <HugeiconsIcon icon={CodeIcon} />\n                <span>Code Editor</span>\n              </CommandItem>\n            </CommandGroup>\n          </CommandList>\n        </Command>\n      </CommandDialog>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <CommandManyItems />,
};
