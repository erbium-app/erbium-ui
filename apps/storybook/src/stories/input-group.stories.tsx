import {
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@erbium/ui/components/input-group";
import InputGroupCustom from "../examples/upstream/input-group-custom";
import InputGroupButtonExample from "../examples/upstream/input-group-button";
import InputGroupTextareaExample from "../examples/upstream/input-group-textarea";
import { InputGroupInlineStart } from "../examples/upstream/input-group-inline-start";
import { InputGroupInlineEnd } from "../examples/upstream/input-group-inline-end";
import { InputGroupBlockStart } from "../examples/upstream/input-group-block-start";
import { InputGroupBlockEnd } from "../examples/upstream/input-group-block-end";
import { InputGroupKbd } from "../examples/upstream/input-group-kbd";
import ExampleInputGroupIcon from "../examples/input-group-icon";
import ExampleInputGroupText from "../examples/input-group-text";
import ExampleInputGroupDropdown from "../examples/input-group-dropdown";
import ExampleInputGroupSpinner from "../examples/input-group-spinner";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { InputGroup } from "@erbium/ui/components/input-group";
import Demo from "../examples/input-group-demo";

const meta = {
  title: "UI/Input Group",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Add addons, buttons, and helper content to inputs.\n\n**Import:** `@erbium/ui/components/input-group`  \n\n**shadcn/ui page:** [Input Group](https://ui.shadcn.com/docs/components/base/input-group)\n\n### Usage\n\n```tsx\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n  InputGroupText,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group"\n```\n\n```tsx\n<InputGroup>\n  <InputGroupInput placeholder="Search..." />\n  <InputGroupAddon>\n    <SearchIcon />\n  </InputGroupAddon>\n</InputGroup>\n```\n\n### Composition\n\nUse the following composition to build an `InputGroup`:\n\n```text\nInputGroup\n├── InputGroupInput or InputGroupTextarea\n├── InputGroupAddon\n├── InputGroupButton\n└── InputGroupText\n```\n\nFor proper focus management, place `InputGroupAddon` after `InputGroupInput` or `InputGroupTextarea` in the DOM. Use `align` to position it visually.',
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  align: "inline-start" | "inline-end" | "block-start" | "block-end";
  placeholder: string;
  buttonSize: "xs" | "sm" | "icon-xs" | "icon-sm";
  buttonVariant: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  className: string;
}> = {
  args: {
    align: "inline-start",
    placeholder: "Search",
    buttonSize: "xs",
    buttonVariant: "ghost",
    className: "",
  },
  argTypes: {
    align: {
      control: "select",
      options: ["inline-start", "inline-end", "block-start", "block-end"],
    },
    placeholder: { control: "text" },
    buttonSize: { control: "select", options: ["xs", "sm", "icon-xs", "icon-sm"] },
    buttonVariant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "link"],
    },
    className: { control: "text" },
  },
  render: (args) => (
    <InputGroup className={`w-72 ${args.className}`}>
      <InputGroupAddon align={args.align}>
        <InputGroupText>⌕</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder={args.placeholder} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size={args.buttonSize} variant={args.buttonVariant}>
          Go
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

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
      description: { story: "Place icons beside an input." },

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
      description: { story: "Add text prefixes or suffixes to an input." },

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
      description: { story: "Add a dropdown action inside an input group." },

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
      description: { story: "Show progress inside an input group." },

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

export const InlineStart: Story = {
  parameters: {
    docs: {
      description: { story: "Position an addon at the inline start of the input." },
      source: {
        code: 'import { SearchIcon } from "lucide-react";\n\nimport { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";\n\nexport function InputGroupInlineStart() {\n  return (\n    <Field className="max-w-sm">\n      <FieldLabel htmlFor="inline-start-input">Input</FieldLabel>\n      <InputGroup>\n        <InputGroupInput id="inline-start-input" placeholder="Search..." />\n        <InputGroupAddon align="inline-start">\n          <SearchIcon className="text-muted-foreground" />\n        </InputGroupAddon>\n      </InputGroup>\n      <FieldDescription>Icon positioned at the start.</FieldDescription>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupInlineStart />,
};
export const InlineEnd: Story = {
  parameters: {
    docs: {
      description: { story: "Position an addon at the inline end of the input." },
      source: {
        code: 'import { EyeOffIcon } from "lucide-react";\n\nimport { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";\nimport { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";\n\nexport function InputGroupInlineEnd() {\n  return (\n    <Field className="max-w-sm">\n      <FieldLabel htmlFor="inline-end-input">Input</FieldLabel>\n      <InputGroup>\n        <InputGroupInput id="inline-end-input" type="password" placeholder="Enter password" />\n        <InputGroupAddon align="inline-end">\n          <EyeOffIcon />\n        </InputGroupAddon>\n      </InputGroup>\n      <FieldDescription>Icon positioned at the end.</FieldDescription>\n    </Field>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupInlineEnd />,
};
export const BlockStart: Story = {
  parameters: {
    docs: {
      description: { story: "Position an addon above the input." },
      source: {
        code: 'import { CopyIcon, FileCodeIcon } from "lucide-react";\n\nimport { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n  InputGroupText,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group";\n\nexport function InputGroupBlockStart() {\n  return (\n    <FieldGroup className="max-w-sm">\n      <Field>\n        <FieldLabel htmlFor="block-start-input">Input</FieldLabel>\n        <InputGroup className="h-auto">\n          <InputGroupInput id="block-start-input" placeholder="Enter your name" />\n          <InputGroupAddon align="block-start">\n            <InputGroupText>Full Name</InputGroupText>\n          </InputGroupAddon>\n        </InputGroup>\n        <FieldDescription>Header positioned above the input.</FieldDescription>\n      </Field>\n      <Field>\n        <FieldLabel htmlFor="block-start-textarea">Textarea</FieldLabel>\n        <InputGroup>\n          <InputGroupTextarea\n            id="block-start-textarea"\n            placeholder="console.log(\'Hello, world!\');"\n            className="font-mono text-sm"\n          />\n          <InputGroupAddon align="block-start">\n            <FileCodeIcon className="text-muted-foreground" />\n            <InputGroupText className="font-mono">script.js</InputGroupText>\n            <InputGroupButton size="icon-xs" className="ml-auto">\n              <CopyIcon />\n              <span className="sr-only">Copy</span>\n            </InputGroupButton>\n          </InputGroupAddon>\n        </InputGroup>\n        <FieldDescription>Header positioned above the textarea.</FieldDescription>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupBlockStart />,
};
export const BlockEnd: Story = {
  parameters: {
    docs: {
      description: { story: "Position an addon below the input." },
      source: {
        code: 'import { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n  InputGroupText,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group";\n\nexport function InputGroupBlockEnd() {\n  return (\n    <FieldGroup className="max-w-sm">\n      <Field>\n        <FieldLabel htmlFor="block-end-input">Input</FieldLabel>\n        <InputGroup className="h-auto">\n          <InputGroupInput id="block-end-input" placeholder="Enter amount" />\n          <InputGroupAddon align="block-end">\n            <InputGroupText>USD</InputGroupText>\n          </InputGroupAddon>\n        </InputGroup>\n        <FieldDescription>Footer positioned below the input.</FieldDescription>\n      </Field>\n      <Field>\n        <FieldLabel htmlFor="block-end-textarea">Textarea</FieldLabel>\n        <InputGroup>\n          <InputGroupTextarea id="block-end-textarea" placeholder="Write a comment..." />\n          <InputGroupAddon align="block-end">\n            <InputGroupText>0/280</InputGroupText>\n            <InputGroupButton variant="default" size="sm" className="ml-auto">\n              Post\n            </InputGroupButton>\n          </InputGroupAddon>\n        </InputGroup>\n        <FieldDescription>Footer positioned below the textarea.</FieldDescription>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupBlockEnd />,
};
export const Kbd: Story = {
  parameters: {
    docs: {
      description: { story: "Show a keyboard shortcut inside an input group." },

      source: {
        code: 'import { SearchIcon } from "lucide-react";\n\nimport { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";\nimport { Kbd } from "@erbium/ui/components/kbd";\n\nexport function InputGroupKbd() {\n  return (\n    <InputGroup className="max-w-sm">\n      <InputGroupInput placeholder="Search..." />\n      <InputGroupAddon>\n        <SearchIcon className="text-muted-foreground" />\n      </InputGroupAddon>\n      <InputGroupAddon align="inline-end">\n        <Kbd>⌘K</Kbd>\n      </InputGroupAddon>\n    </InputGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupKbd />,
};

export const Textarea: Story = {
  parameters: {
    docs: {
      description: { story: "Compose a textarea with addons." },

      source: {
        code: 'import { FileCodeIcon, CopyIcon, CornerDownLeftIcon, RefreshCcwIcon } from "lucide-react";\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupText,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group";\n\nexport default function InputGroupTextareaExample() {\n  return (\n    <div className="grid w-full max-w-md gap-4">\n      <InputGroup>\n        <InputGroupTextarea\n          id="textarea-code-32"\n          placeholder="console.log(\'Hello, world!\');"\n          className="min-h-[200px]"\n        />\n        <InputGroupAddon align="block-end" className="border-t">\n          <InputGroupText>Line 1, Column 1</InputGroupText>\n          <InputGroupButton size="sm" className="ml-auto" variant="default">\n            Run <CornerDownLeftIcon />\n          </InputGroupButton>\n        </InputGroupAddon>\n        <InputGroupAddon align="block-start" className="border-b">\n          <InputGroupText className="font-mono font-medium">\n            <FileCodeIcon />\n            script.js\n          </InputGroupText>\n          <InputGroupButton className="ml-auto" size="icon-xs">\n            <RefreshCcwIcon />\n          </InputGroupButton>\n          <InputGroupButton variant="ghost" size="icon-xs">\n            <CopyIcon />\n          </InputGroupButton>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupTextareaExample />,
};

export const Button: Story = {
  parameters: {
    docs: {
      description: { story: "Place an action button inside an input group." },

      source: {
        code: 'import * as React from "react";\nimport { CheckIcon, CopyIcon, InfoIcon, StarIcon } from "lucide-react";\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group";\nimport { Popover, PopoverContent, PopoverTrigger } from "@erbium/ui/components/popover";\n\nexport default function InputGroupButtonExample() {\n  const [isCopied, setIsCopied] = React.useState(false);\n  async function copyToClipboard(value: string) {\n    await navigator.clipboard.writeText(value);\n    setIsCopied(true);\n  }\n  const [isFavorite, setIsFavorite] = React.useState(false);\n\n  return (\n    <div className="grid w-full max-w-sm gap-6">\n      <InputGroup>\n        <InputGroupInput placeholder="https://x.com/shadcn" readOnly />\n        <InputGroupAddon align="inline-end">\n          <InputGroupButton\n            aria-label="Copy"\n            title="Copy"\n            size="icon-xs"\n            onClick={() => {\n              void copyToClipboard("https://x.com/shadcn");\n            }}\n          >\n            {isCopied ? <CheckIcon /> : <CopyIcon />}\n          </InputGroupButton>\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup className="[--radius:9999px]">\n        <Popover>\n          <PopoverTrigger render={<InputGroupAddon />}>\n            <InputGroupButton variant="secondary" size="icon-xs">\n              <InfoIcon />\n            </InputGroupButton>\n          </PopoverTrigger>\n          <PopoverContent align="start" className="flex flex-col gap-1 rounded-xl text-sm">\n            <p className="font-medium">Your connection is not secure.</p>\n            <p>You should not enter any sensitive information on this site.</p>\n          </PopoverContent>\n        </Popover>\n        <InputGroupAddon className="pl-1.5 text-muted-foreground">https://</InputGroupAddon>\n        <InputGroupInput id="input-secure-19" />\n        <InputGroupAddon align="inline-end">\n          <InputGroupButton onClick={() => setIsFavorite(!isFavorite)} size="icon-xs">\n            <StarIcon\n              data-favorite={isFavorite}\n              className="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600"\n            />\n          </InputGroupButton>\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupInput placeholder="Type to search..." />\n        <InputGroupAddon align="inline-end">\n          <InputGroupButton variant="secondary">Search</InputGroupButton>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupButtonExample />,
};

export const Custom: Story = {
  name: "Custom Input",
  parameters: {
    docs: {
      description: {
        story:
          'Add the `data-slot="input-group-control"` attribute to your custom input for automatic focus state handling.\n\nHere\'s an example of a custom resizable textarea from a third-party library.',
      },
      source: {
        code: 'import TextareaAutosize from "react-textarea-autosize";\n\nimport { InputGroup, InputGroupAddon, InputGroupButton } from "@erbium/ui/components/input-group";\n\nexport default function InputGroupCustom() {\n  return (\n    <div className="grid w-full max-w-sm gap-6">\n      <InputGroup>\n        <TextareaAutosize\n          data-slot="input-group-control"\n          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"\n          placeholder="Autoresize textarea..."\n        />\n        <InputGroupAddon align="block-end">\n          <InputGroupButton className="ml-auto" size="sm" variant="default">\n            Submit\n          </InputGroupButton>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <InputGroupCustom />,
};
