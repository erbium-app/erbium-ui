import ButtonGroupSplit from "../examples/upstream/button-group-split";
import ExampleButtonGroupOrientation from "../examples/button-group-orientation";
import ExampleButtonGroupSize from "../examples/button-group-size";
import ExampleButtonGroupNested from "../examples/button-group-nested";
import ExampleButtonGroupSeparator from "../examples/button-group-separator";
import ExampleButtonGroupInput from "../examples/button-group-input";
import ExampleButtonGroupInputGroup from "../examples/button-group-input-group";
import ExampleButtonGroupDropdown from "../examples/button-group-dropdown";
import ExampleButtonGroupSelect from "../examples/button-group-select";
import ExampleButtonGroupPopover from "../examples/button-group-popover";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { ButtonGroupText } from "@erbium/ui/components/button-group";
import { Button } from "@erbium/ui/components/button";
import Demo from "../examples/button-group-demo";

const meta = {
  title: "UI/Button Group",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A container that groups related buttons together with consistent styling.\n\n**Import:** `@erbium/ui/components/button-group`  \n\n**shadcn/ui page:** [Button Group](https://ui.shadcn.com/docs/components/base/button-group)\n\n### Usage\n\n```tsx\nimport {\n  ButtonGroup,\n  ButtonGroupSeparator,\n  ButtonGroupText,\n} from "@erbium/ui/components/button-group"\n```\n\n```tsx\n<ButtonGroup>\n  <Button>Button 1</Button>\n  <Button>Button 2</Button>\n</ButtonGroup>\n```\n\n### Composition\n\nUse the following composition to build a `ButtonGroup`:\n\n```text\nButtonGroup\n├── Button or Input\n├── ButtonGroupSeparator\n└── ButtonGroupText\n```\n\n### Accessibility\n\n- The `ButtonGroup` component has the `role` attribute set to `group`.\n\n- Use <Kbd>Tab</Kbd> to navigate between the buttons in the group.\n\n- Use `aria-label` or `aria-labelledby` to label the button group.\n\n```tsx\n<ButtonGroup aria-label="Button group">\n  <Button>Button 1</Button>\n  <Button>Button 2</Button>\n</ButtonGroup>\n```\n\n### ButtonGroup vs ToggleGroup\n\n- Use the `ButtonGroup` component when you want to group buttons that perform an action.\n\n- Use the `ToggleGroup` component when you want to group buttons that toggle a state.',
      },
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  orientation: "horizontal" | "vertical";
  size: "default" | "xs" | "sm" | "lg";
  textAsSpan: boolean;
}> = {
  args: { orientation: "horizontal", size: "default", textAsSpan: false },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    size: { control: "select", options: ["default", "xs", "sm", "lg"] },
    textAsSpan: { control: "boolean" },
  },
  render: (args) => (
    <ButtonGroup orientation={args.orientation}>
      <Button variant="outline" size={args.size}>
        First
      </Button>
      <Button variant="outline" size={args.size}>
        Second
      </Button>
      <ButtonGroupText render={args.textAsSpan ? <span /> : undefined}>Group</ButtonGroupText>
    </ButtonGroup>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import * as React from "react";\nimport {\n  ArchiveIcon,\n  ArrowLeftIcon,\n  CalendarPlusIcon,\n  ClockIcon,\n  ListFilterIcon,\n  MailCheckIcon,\n  MoreHorizontalIcon,\n  TagIcon,\n  Trash2Icon,\n} from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport { ButtonGroup } from "@erbium/ui/components/button-group";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuSeparator,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport default function ButtonGroupDemo() {\n  const [label, setLabel] = React.useState("personal");\n\n  return (\n    <ButtonGroup>\n      <ButtonGroup className="hidden sm:flex">\n        <Button variant="outline" size="icon" aria-label="Go Back">\n          <ArrowLeftIcon />\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Archive</Button>\n        <Button variant="outline">Report</Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Snooze</Button>\n        <DropdownMenu>\n          <DropdownMenuTrigger\n            render={\n              <Button variant="outline" size="icon" aria-label="More Options">\n                <MoreHorizontalIcon />\n              </Button>\n            }\n          />\n          <DropdownMenuContent align="end" className="w-52">\n            <DropdownMenuGroup>\n              <DropdownMenuItem>\n                <MailCheckIcon />\n                Mark as Read\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <ArchiveIcon />\n                Archive\n              </DropdownMenuItem>\n            </DropdownMenuGroup>\n            <DropdownMenuSeparator />\n            <DropdownMenuGroup>\n              <DropdownMenuItem>\n                <ClockIcon />\n                Snooze\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <CalendarPlusIcon />\n                Add to Calendar\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <ListFilterIcon />\n                Add to List\n              </DropdownMenuItem>\n              <DropdownMenuSub>\n                <DropdownMenuSubTrigger>\n                  <TagIcon />\n                  Label As...\n                </DropdownMenuSubTrigger>\n                <DropdownMenuSubContent>\n                  <DropdownMenuRadioGroup value={label} onValueChange={setLabel}>\n                    <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>\n                  </DropdownMenuRadioGroup>\n                </DropdownMenuSubContent>\n              </DropdownMenuSub>\n            </DropdownMenuGroup>\n            <DropdownMenuSeparator />\n            <DropdownMenuGroup>\n              <DropdownMenuItem variant="destructive">\n                <Trash2Icon />\n                Trash\n              </DropdownMenuItem>\n            </DropdownMenuGroup>\n          </DropdownMenuContent>\n        </DropdownMenu>\n      </ButtonGroup>\n    </ButtonGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Orientation: Story = {
  parameters: {
    docs: {
      description: { story: "Set the `orientation` prop to change the button group layout." },

      source: {
        code: 'import { MinusIcon, PlusIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\n\nexport default function ButtonGroupOrientation() {\n  return (\n    <ButtonGroup\n      orientation="vertical"\n      aria-label="Media controls"\n      className="h-fit"\n    >\n      <Button variant="outline" size="icon">\n        <PlusIcon />\n      </Button>\n      <Button variant="outline" size="icon">\n        <MinusIcon />\n      </Button>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupOrientation />
    </div>
  ),
};
export const Size: Story = {
  parameters: {
    docs: {
      description: {
        story: "Control the size of buttons using the `size` prop on individual buttons.",
      },

      source: {
        code: 'import { PlusIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\n\nexport default function ButtonGroupSize() {\n  return (\n    <div className="flex flex-col items-start gap-8">\n      <ButtonGroup>\n        <Button variant="outline" size="sm">\n          Small\n        </Button>\n        <Button variant="outline" size="sm">\n          Button\n        </Button>\n        <Button variant="outline" size="sm">\n          Group\n        </Button>\n        <Button variant="outline" size="icon-sm">\n          <PlusIcon />\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Default</Button>\n        <Button variant="outline">Button</Button>\n        <Button variant="outline">Group</Button>\n        <Button variant="outline" size="icon">\n          <PlusIcon />\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline" size="lg">\n          Large\n        </Button>\n        <Button variant="outline" size="lg">\n          Button\n        </Button>\n        <Button variant="outline" size="lg">\n          Group\n        </Button>\n        <Button variant="outline" size="icon-lg">\n          <PlusIcon />\n        </Button>\n      </ButtonGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupSize />
    </div>
  ),
};
export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story: "Nest `<ButtonGroup>` components to create button groups with spacing.",
      },

      source: {
        code: '\nimport { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\n\nexport default function ButtonGroupNested() {\n  return (\n    <ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline" size="sm">\n          1\n        </Button>\n        <Button variant="outline" size="sm">\n          2\n        </Button>\n        <Button variant="outline" size="sm">\n          3\n        </Button>\n        <Button variant="outline" size="sm">\n          4\n        </Button>\n        <Button variant="outline" size="sm">\n          5\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline" size="icon-sm" aria-label="Previous">\n          <ArrowLeftIcon />\n        </Button>\n        <Button variant="outline" size="icon-sm" aria-label="Next">\n          <ArrowRightIcon />\n        </Button>\n      </ButtonGroup>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupNested />
    </div>
  ),
};
export const Separator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The `ButtonGroupSeparator` component visually divides buttons within a group.\n\nButtons with variant `outline` do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.",
      },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport {\n  ButtonGroup,\n  ButtonGroupSeparator,\n} from "@erbium/ui/components/button-group"\n\nexport default function ButtonGroupSeparatorDemo() {\n  return (\n    <ButtonGroup>\n      <Button variant="secondary" size="sm">\n        Copy\n      </Button>\n      <ButtonGroupSeparator />\n      <Button variant="secondary" size="sm">\n        Paste\n      </Button>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupSeparator />
    </div>
  ),
};
export const Input: Story = {
  parameters: {
    docs: {
      description: { story: "Wrap an `Input` component with buttons." },

      source: {
        code: 'import { SearchIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport { Input } from "@erbium/ui/components/input"\n\nexport default function ButtonGroupInput() {\n  return (\n    <ButtonGroup>\n      <Input placeholder="Search..." />\n      <Button variant="outline" aria-label="Search">\n        <SearchIcon />\n      </Button>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupInput />
    </div>
  ),
};
export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: "Wrap an `InputGroup` component to create complex input layouts." },

      source: {
        code: '\nimport * as React from "react"\nimport { AudioLinesIcon, PlusIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\nimport {\n  Tooltip,\n  TooltipContent,\n  TooltipTrigger,\n} from "@erbium/ui/components/tooltip"\n\nexport default function ButtonGroupInputGroup() {\n  const [voiceEnabled, setVoiceEnabled] = React.useState(false)\n\n  return (\n    <ButtonGroup className="[--radius:9999rem]">\n      <ButtonGroup>\n        <Button variant="outline" size="icon">\n          <PlusIcon />\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <InputGroup>\n          <InputGroupInput\n            placeholder={\n              voiceEnabled ? "Record and send audio..." : "Send a message..."\n            }\n            disabled={voiceEnabled}\n          />\n          <InputGroupAddon align="inline-end">\n            <Tooltip>\n              <TooltipTrigger render={<InputGroupButton\n                  onClick={() => setVoiceEnabled(!voiceEnabled)}\n                  size="icon-xs"\n                  data-active={voiceEnabled}\n                  className="data-[active=true]:bg-warning-soft data-[active=true]:text-warning-soft-foreground"\n                  aria-pressed={voiceEnabled}\n                >\n                  <AudioLinesIcon />\n                </InputGroupButton>} />\n              <TooltipContent>Voice Mode</TooltipContent>\n            </Tooltip>\n          </InputGroupAddon>\n        </InputGroup>\n      </ButtonGroup>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupInputGroup />
    </div>
  ),
};
export const DropdownMenu: Story = {
  parameters: {
    docs: {
      description: { story: "Create a split button group with a `DropdownMenu` component." },

      source: {
        code: '\nimport {\n  AlertTriangleIcon,\n  CheckIcon,\n  ChevronDownIcon,\n  CopyIcon,\n  ShareIcon,\n  TrashIcon,\n  UserRoundXIcon,\n  VolumeOffIcon,\n} from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\n\nexport default function ButtonGroupDropdown() {\n  return (\n    <ButtonGroup>\n      <Button variant="outline">Follow</Button>\n      <DropdownMenu>\n        <DropdownMenuTrigger render={<Button variant="outline" className="pl-2!">\n            <ChevronDownIcon />\n          </Button>} />\n        <DropdownMenuContent align="end" className="[--radius:1rem]">\n          <DropdownMenuGroup>\n            <DropdownMenuItem>\n              <VolumeOffIcon />\n              Mute Conversation\n            </DropdownMenuItem>\n            <DropdownMenuItem>\n              <CheckIcon />\n              Mark as Read\n            </DropdownMenuItem>\n            <DropdownMenuItem>\n              <AlertTriangleIcon />\n              Report Conversation\n            </DropdownMenuItem>\n            <DropdownMenuItem>\n              <UserRoundXIcon />\n              Block User\n            </DropdownMenuItem>\n            <DropdownMenuItem>\n              <ShareIcon />\n              Share Conversation\n            </DropdownMenuItem>\n            <DropdownMenuItem>\n              <CopyIcon />\n              Copy Conversation\n            </DropdownMenuItem>\n          </DropdownMenuGroup>\n          <DropdownMenuSeparator />\n          <DropdownMenuGroup>\n            <DropdownMenuItem variant="destructive">\n              <TrashIcon />\n              Delete Conversation\n            </DropdownMenuItem>\n          </DropdownMenuGroup>\n        </DropdownMenuContent>\n      </DropdownMenu>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupDropdown />
    </div>
  ),
};
export const Select: Story = {
  parameters: {
    docs: {
      description: { story: "Pair with a `Select` component." },

      source: {
        code: '\nimport * as React from "react"\nimport { ArrowRightIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport { Input } from "@erbium/ui/components/input"\nimport {\n  Select,\n  SelectContent,\n  SelectItem,\n  SelectTrigger,\n} from "@erbium/ui/components/select"\n\nconst CURRENCIES = [\n  {\n    value: "$",\n    label: "US Dollar",\n  },\n  {\n    value: "€",\n    label: "Euro",\n  },\n  {\n    value: "£",\n    label: "British Pound",\n  },\n]\n\nexport default function ButtonGroupSelect() {\n  const [currency, setCurrency] = React.useState("$")\n\n  return (\n    <ButtonGroup>\n      <ButtonGroup>\n        <Select value={currency} onValueChange={setCurrency}>\n          <SelectTrigger className="font-mono">{currency}</SelectTrigger>\n          <SelectContent className="min-w-24">\n            {CURRENCIES.map((currency) => (\n              <SelectItem key={currency.value} value={currency.value}>\n                {currency.value}{" "}\n                <span className="text-muted-foreground">{currency.label}</span>\n              </SelectItem>\n            ))}\n          </SelectContent>\n        </Select>\n        <Input placeholder="10.00" pattern="[0-9]*" />\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button aria-label="Send" size="icon" variant="outline">\n          <ArrowRightIcon />\n        </Button>\n      </ButtonGroup>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupSelect />
    </div>
  ),
};
export const Popover: Story = {
  parameters: {
    docs: {
      description: { story: "Use with a `Popover` component." },

      source: {
        code: 'import { BotIcon, ChevronDownIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport {\n  Popover,\n  PopoverContent,\n  PopoverTrigger,\n} from "@erbium/ui/components/popover"\nimport { Separator } from "@erbium/ui/components/separator"\nimport { Textarea } from "@erbium/ui/components/textarea"\n\nexport default function ButtonGroupPopover() {\n  return (\n    <ButtonGroup>\n      <Button variant="outline">\n        <BotIcon /> Copilot\n      </Button>\n      <Popover>\n        <PopoverTrigger render={<Button variant="outline" size="icon" aria-label="Open Popover">\n            <ChevronDownIcon />\n          </Button>} />\n        <PopoverContent align="end" className="rounded-xl p-0 text-sm">\n          <div className="px-4 py-3">\n            <div className="text-sm font-medium">Agent Tasks</div>\n          </div>\n          <Separator />\n          <div className="p-4 text-sm *:[p:not(:last-child)]:mb-2">\n            <Textarea\n              placeholder="Describe your task in natural language."\n              className="mb-4 resize-none"\n            />\n            <p className="font-medium">Start a new task with Copilot</p>\n            <p className="text-muted-foreground">\n              Describe your task in natural language. Copilot will work in the\n              background and open a pull request for your review.\n            </p>\n          </div>\n        </PopoverContent>\n      </Popover>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleButtonGroupPopover />
    </div>
  ),
};

export const Split: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Create a split button group by adding two buttons separated by a `ButtonGroupSeparator`.",
      },
      source: {
        code: 'import { PlusIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport { ButtonGroup, ButtonGroupSeparator } from "@erbium/ui/components/button-group";\n\nexport default function ButtonGroupSplit() {\n  return (\n    <ButtonGroup>\n      <Button variant="secondary">Button</Button>\n      <ButtonGroupSeparator />\n      <Button size="icon" variant="secondary">\n        <PlusIcon />\n      </Button>\n    </ButtonGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <ButtonGroupSplit />,
};
