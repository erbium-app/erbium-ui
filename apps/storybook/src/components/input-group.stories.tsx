import ExampleInputGroupIcon from "./examples/input-group-icon";
import ExampleInputGroupText from "./examples/input-group-text";
import ExampleInputGroupDropdown from "./examples/input-group-dropdown";
import ExampleInputGroupSpinner from "./examples/input-group-spinner";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { InputGroup } from "@erbium/ui/components/input-group";
import Demo from "./examples/input-group-demo";

const meta = {
  title: "UI/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Add addons, buttons, and helper content to inputs.\n\n**Import:** `@erbium/ui/components/input-group`  \n\n**shadcn/ui page:** [Input Group](https://ui.shadcn.com/docs/components/base/input-group)\n\n### Usage\n\n```tsx\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n  InputGroupText,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group"\n```\n\n```tsx\n<InputGroup>\n  <InputGroupInput placeholder="Search..." />\n  <InputGroupAddon>\n    <SearchIcon />\n  </InputGroupAddon>\n</InputGroup>\n```\n\n### Composition\n\nUse the following composition to build an `InputGroup`:\n\n```text\nInputGroup\n├── InputGroupInput or InputGroupTextarea\n├── InputGroupAddon\n├── InputGroupButton\n└── InputGroupText\n```\n\n### Align\n\nUse the `align` prop on `InputGroupAddon` to position the addon relative to the input.\n\nFor proper focus management, `InputGroupAddon` should always be placed after\n\n`InputGroupInput` or `InputGroupTextarea` in the DOM. Use the `align` prop to\n\nvisually position the addon.\n\nUse `align="inline-start"` to position the addon at the start of the input. This is the default.\n\nstyleName="base-nova"\n\nname="input-group-inline-start"\n\npreviewClassName="h-48"\n\n/>\n\nUse `align="inline-end"` to position the addon at the end of the input.\n\nstyleName="base-nova"\n\nname="input-group-inline-end"\n\npreviewClassName="h-48"\n\n/>\n\nUse `align="block-start"` to position the addon above the input.\n\nstyleName="base-nova"\n\nname="input-group-block-start"\n\npreviewClassName="h-96"\n\n/>\n\nUse `align="block-end"` to position the addon below the input.\n\nstyleName="base-nova"\n\nname="input-group-block-end"\n\npreviewClassName="h-[26rem]"\n\n/>\n\n### Icon\n\nstyleName="base-nova"\n\nname="input-group-icon"\n\npreviewClassName="h-80"\n\n/>\n\n### Text\n\nstyleName="base-nova"\n\nname="input-group-text"\n\npreviewClassName="h-80"\n\n/>\n\n### Button\n\nstyleName="base-nova"\n\nname="input-group-button"\n\npreviewClassName="h-72"\n\n/>\n\n### Kbd\n\nstyleName="base-nova"\n\nname="input-group-kbd"\n\npreviewClassName="h-40"\n\n/>\n\n### Dropdown\n\nstyleName="base-nova"\n\nname="input-group-dropdown"\n\npreviewClassName="h-56"\n\n/>\n\n### Spinner\n\nstyleName="base-nova"\n\nname="input-group-spinner"\n\npreviewClassName="h-80"\n\n/>\n\n### Textarea\n\nstyleName="base-nova"\n\nname="input-group-textarea"\n\npreviewClassName="h-96"\n\n/>\n\n### Custom Input\n\nAdd the `data-slot="input-group-control"` attribute to your custom input for automatic focus state handling.\n\nHere\'s an example of a custom resizable textarea from a third-party library.\n\nstyleName="base-nova"\n\nname="input-group-custom"\n\npreviewClassName="h-56"\n\n/>',
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
        code: 'import {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n  InputGroupText,\n} from "@erbium/ui/components/input-group";\nexport default function Demo() {\n  return (\n    <InputGroup className="w-80">\n      <InputGroupAddon>\n        <InputGroupText>https://</InputGroupText>\n      </InputGroupAddon>\n      <InputGroupInput aria-label="Website" placeholder="example.com" />\n    </InputGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Icon: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  CheckIcon,\n  CreditCardIcon,\n  InfoIcon,\n  MailIcon,\n  SearchIcon,\n  StarIcon,\n} from "lucide-react"\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\n\nexport default function InputGroupIcon() {\n  return (\n    <div className="grid w-full max-w-sm gap-6">\n      <InputGroup>\n        <InputGroupInput placeholder="Search..." />\n        <InputGroupAddon>\n          <SearchIcon />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupInput type="email" placeholder="Enter your email" />\n        <InputGroupAddon>\n          <MailIcon />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupInput placeholder="Card number" />\n        <InputGroupAddon>\n          <CreditCardIcon />\n        </InputGroupAddon>\n        <InputGroupAddon align="inline-end">\n          <CheckIcon />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupInput placeholder="Card number" />\n        <InputGroupAddon align="inline-end">\n          <StarIcon />\n          <InfoIcon />\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputGroupIcon />
    </div>
  ),
};
export const Text: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n  InputGroupText,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group"\n\nexport default function InputGroupTextExample() {\n  return (\n    <div className="grid w-full max-w-sm gap-6">\n      <InputGroup>\n        <InputGroupAddon>\n          <InputGroupText>$</InputGroupText>\n        </InputGroupAddon>\n        <InputGroupInput placeholder="0.00" />\n        <InputGroupAddon align="inline-end">\n          <InputGroupText>USD</InputGroupText>\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupAddon>\n          <InputGroupText>https://</InputGroupText>\n        </InputGroupAddon>\n        <InputGroupInput placeholder="example.com" className="pl-0.5!" />\n        <InputGroupAddon align="inline-end">\n          <InputGroupText>.com</InputGroupText>\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupInput placeholder="Enter your username" />\n        <InputGroupAddon align="inline-end">\n          <InputGroupText>@company.com</InputGroupText>\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupTextarea placeholder="Enter your message" />\n        <InputGroupAddon align="block-end">\n          <InputGroupText className="text-xs text-muted-foreground">\n            120 characters left\n          </InputGroupText>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputGroupText />
    </div>
  ),
};
export const Dropdown: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { ChevronDownIcon, MoreHorizontal } from "lucide-react"\n\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\n\nexport default function InputGroupDropdown() {\n  return (\n    <div className="grid w-full max-w-sm gap-4">\n      <InputGroup>\n        <InputGroupInput placeholder="Enter file name" />\n        <InputGroupAddon align="inline-end">\n          <DropdownMenu>\n            <DropdownMenuTrigger render={<InputGroupButton\n                variant="ghost"\n                aria-label="More"\n                size="icon-xs"\n              >\n                <MoreHorizontal />\n              </InputGroupButton>} />\n            <DropdownMenuContent align="end">\n              <DropdownMenuItem>Settings</DropdownMenuItem>\n              <DropdownMenuItem>Copy path</DropdownMenuItem>\n              <DropdownMenuItem>Open location</DropdownMenuItem>\n            </DropdownMenuContent>\n          </DropdownMenu>\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup className="[--radius:1rem]">\n        <InputGroupInput placeholder="Enter search query" />\n        <InputGroupAddon align="inline-end">\n          <DropdownMenu>\n            <DropdownMenuTrigger render={<InputGroupButton variant="ghost" className="pr-1.5! text-xs">\n                Search In... <ChevronDownIcon className="size-3" />\n              </InputGroupButton>} />\n            <DropdownMenuContent align="end" className="[--radius:0.95rem]">\n              <DropdownMenuItem>Documentation</DropdownMenuItem>\n              <DropdownMenuItem>Blog Posts</DropdownMenuItem>\n              <DropdownMenuItem>Changelog</DropdownMenuItem>\n            </DropdownMenuContent>\n          </DropdownMenu>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputGroupDropdown />
    </div>
  ),
};
export const Spinner: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { LoaderIcon } from "lucide-react"\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n  InputGroupText,\n} from "@erbium/ui/components/input-group"\nimport { Spinner } from "@erbium/ui/components/spinner"\n\nexport default function InputGroupSpinner() {\n  return (\n    <div className="grid w-full max-w-sm gap-4">\n      <InputGroup data-disabled>\n        <InputGroupInput placeholder="Searching..." disabled />\n        <InputGroupAddon align="inline-end">\n          <Spinner />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup data-disabled>\n        <InputGroupInput placeholder="Processing..." disabled />\n        <InputGroupAddon>\n          <Spinner />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup data-disabled>\n        <InputGroupInput placeholder="Saving changes..." disabled />\n        <InputGroupAddon align="inline-end">\n          <InputGroupText>Saving...</InputGroupText>\n          <Spinner />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup data-disabled>\n        <InputGroupInput placeholder="Refreshing data..." disabled />\n        <InputGroupAddon>\n          <LoaderIcon className="animate-spin" />\n        </InputGroupAddon>\n        <InputGroupAddon align="inline-end">\n          <InputGroupText className="text-muted-foreground">\n            Please wait...\n          </InputGroupText>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleInputGroupSpinner />
    </div>
  ),
};
