import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Command } from "@erbium/ui/components/command";
import Demo from "./examples/command-demo";

const meta = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Command menu for search and quick actions.\n\n**Import:** `@erbium/ui/components/command`  \n\n**shadcn/ui page:** [Command](https://ui.shadcn.com/docs/components/base/command)\n\n### About\n\nThe `<Command />` component uses the [`cmdk`](https://github.com/dip/cmdk) component by [Dip](https://www.dip.org/).\n\n### Usage\n\n```tsx\nimport {\n  Command,\n  CommandDialog,\n  CommandEmpty,\n  CommandGroup,\n  CommandInput,\n  CommandItem,\n  CommandList,\n  CommandSeparator,\n  CommandShortcut,\n} from "@erbium/ui/components/command"\n```\n\n```tsx\n<Command className="max-w-sm rounded-lg border">\n  <CommandInput placeholder="Type a command or search..." />\n  <CommandList>\n    <CommandEmpty>No results found.</CommandEmpty>\n    <CommandGroup heading="Suggestions">\n      <CommandItem>Calendar</CommandItem>\n      <CommandItem>Search Emoji</CommandItem>\n      <CommandItem>Calculator</CommandItem>\n    </CommandGroup>\n    <CommandSeparator />\n    <CommandGroup heading="Settings">\n      <CommandItem>Profile</CommandItem>\n      <CommandItem>Billing</CommandItem>\n      <CommandItem>Settings</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>\n```\n\n### Composition\n\nUse the following composition to build a `Command`:\n\n```text\nCommand\n├── CommandInput\n└── CommandList\n    ├── CommandEmpty\n    ├── CommandGroup\n    │   ├── CommandItem\n    │   └── CommandItem\n    ├── CommandSeparator\n    └── CommandGroup\n        ├── CommandItem\n        └── CommandItem\n```\n\n### Basic\n\nA simple command menu in a dialog.\n\n### Shortcuts\n\n### Groups\n\nA command menu with groups, icons and separators.\n\n### Scrollable\n\nScrollable command menu with multiple items.',
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
