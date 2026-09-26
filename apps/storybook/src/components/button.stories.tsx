import ExampleButtonSize from "./examples/button-size";
import ExampleButtonDefault from "./examples/button-default";
import ExampleButtonOutline from "./examples/button-outline";
import ExampleButtonSecondary from "./examples/button-secondary";
import ExampleButtonGhost from "./examples/button-ghost";
import ExampleButtonDestructive from "./examples/button-destructive";
import ExampleButtonLink from "./examples/button-link";
import ExampleButtonIcon from "./examples/button-icon";
import ExampleButtonRounded from "./examples/button-rounded";
import ExampleButtonGroupDemo from "./examples/button-group-demo";
import { Spinner } from "@erbium/ui/components/spinner";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@erbium/ui/components/button";
import Demo from "./examples/button-demo";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a button or a component that looks like a button.\n\n**Import:** `@erbium/ui/components/button`  \n\n**shadcn/ui page:** [Button](https://ui.shadcn.com/docs/components/base/button)\n\n### Usage\n\n```tsx\nimport { Button } from "@erbium/ui/components/button"\n```\n\n```tsx\n<Button variant="outline">Button</Button>\n```\n\n### Cursor\n\nTailwind v4 [switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.\n\nIf you want to keep the `cursor: pointer` behavior, add the following code to your CSS file:\n\nYou can also enable this during project setup with `npx shadcn@latest init --pointer`.\n\n### Size\n\nUse the `size` prop to change the size of the button.\n\n### Default\n\n### Outline\n\n### Secondary\n\n### Ghost\n\n### Destructive\n\n### Link\n\n### Icon\n\n### With Icon\n\nRemember to add the `data-icon="inline-start"` or `data-icon="inline-end"` attribute to the icon for the correct spacing.\n\n### Rounded\n\nUse the `rounded-full` class to make the button rounded.\n\n### Spinner\n\nRender a `<Spinner />` component inside the button to show a loading state. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` attribute to the spinner for the correct spacing.\n\n### Button Group\n\nTo create a button group, use the `ButtonGroup` component. See the [Button Group](https://ui.shadcn.com/docs/components/base/button-group) documentation for more details.\n\n### As Link\n\nYou can use the `buttonVariants` helper to make a link look like a button.\n\n**Do not use `<Button render={<a />} nativeButton={false} />` for links.** The Base UI `Button` component always applies `role="button"`, which overrides the semantic link role on `<a>` elements. Use `buttonVariants` with a plain `<a>` tag instead.',
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
        code: 'import { ArrowUpIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\n\nexport default function ButtonDemo() {\n  return (\n    <div className="flex flex-wrap items-center gap-2 md:flex-row">\n      <Button variant="outline">Button</Button>\n      <Button variant="outline" size="icon" aria-label="Submit">\n        <ArrowUpIcon />\n      </Button>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(["default", "secondary", "outline", "ghost", "destructive", "link"] as const).map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};
export const Disabled: Story = { render: () => <Button disabled>Unavailable</Button> };
export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Spinner data-icon="inline-start" />
      Saving
    </Button>
  ),
};

export const Size: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { ArrowUpRightIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonSize() {\n  return (\n    <div className="flex flex-col items-start gap-8 sm:flex-row">\n      <div className="flex items-start gap-2">\n        <Button size="sm" variant="outline">\n          Small\n        </Button>\n        <Button size="icon-sm" aria-label="Submit" variant="outline">\n          <ArrowUpRightIcon />\n        </Button>\n      </div>\n      <div className="flex items-start gap-2">\n        <Button variant="outline">Default</Button>\n        <Button size="icon" aria-label="Submit" variant="outline">\n          <ArrowUpRightIcon />\n        </Button>\n      </div>\n      <div className="flex items-start gap-2">\n        <Button variant="outline" size="lg">\n          Large\n        </Button>\n        <Button size="icon-lg" aria-label="Submit" variant="outline">\n          <ArrowUpRightIcon />\n        </Button>\n      </div>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonSize />,
};
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonDefault() {\n  return <Button>Button</Button>\n}\n',
      },
    },
  },
  render: () => <ExampleButtonDefault />,
};
export const Outline: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonOutline() {\n  return <Button variant="outline">Outline</Button>\n}\n',
      },
    },
  },
  render: () => <ExampleButtonOutline />,
};
export const Secondary: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonSecondary() {\n  return <Button variant="secondary">Secondary</Button>\n}\n',
      },
    },
  },
  render: () => <ExampleButtonSecondary />,
};
export const Ghost: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonGhost() {\n  return <Button variant="ghost">Ghost</Button>\n}\n',
      },
    },
  },
  render: () => <ExampleButtonGhost />,
};
export const Destructive: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonDestructive() {\n  return <Button variant="destructive">Destructive</Button>\n}\n',
      },
    },
  },
  render: () => <ExampleButtonDestructive />,
};
export const Link: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonLink() {\n  return <Button variant="link">Link</Button>\n}\n',
      },
    },
  },
  render: () => <ExampleButtonLink />,
};
export const Icon: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { CircleFadingArrowUpIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonIcon() {\n  return (\n    <Button variant="outline" size="icon">\n      <CircleFadingArrowUpIcon />\n    </Button>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonIcon />,
};
export const Rounded: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { ArrowUpIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonRounded() {\n  return (\n    <div className="flex flex-col gap-8">\n      <Button variant="outline" size="icon" className="rounded-full">\n        <ArrowUpIcon />\n      </Button>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonRounded />,
};
export const ButtonGroup: Story = {
  parameters: {
    docs: {
      source: {
        code: '\nimport * as React from "react"\nimport {\n  ArchiveIcon,\n  ArrowLeftIcon,\n  CalendarPlusIcon,\n  ClockIcon,\n  ListFilterIcon,\n  MailCheckIcon,\n  MoreHorizontalIcon,\n  TagIcon,\n  Trash2Icon,\n} from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuSeparator,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\n\nexport default function ButtonGroupDemo() {\n  const [label, setLabel] = React.useState("personal")\n\n  return (\n    <ButtonGroup>\n      <ButtonGroup className="hidden sm:flex">\n        <Button variant="outline" size="icon" aria-label="Go Back">\n          <ArrowLeftIcon />\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Archive</Button>\n        <Button variant="outline">Report</Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Snooze</Button>\n        <DropdownMenu>\n          <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More Options">\n              <MoreHorizontalIcon />\n            </Button>} />\n          <DropdownMenuContent align="end" className="w-52">\n            <DropdownMenuGroup>\n              <DropdownMenuItem>\n                <MailCheckIcon />\n                Mark as Read\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <ArchiveIcon />\n                Archive\n              </DropdownMenuItem>\n            </DropdownMenuGroup>\n            <DropdownMenuSeparator />\n            <DropdownMenuGroup>\n              <DropdownMenuItem>\n                <ClockIcon />\n                Snooze\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <CalendarPlusIcon />\n                Add to Calendar\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <ListFilterIcon />\n                Add to List\n              </DropdownMenuItem>\n              <DropdownMenuSub>\n                <DropdownMenuSubTrigger>\n                  <TagIcon />\n                  Label As...\n                </DropdownMenuSubTrigger>\n                <DropdownMenuSubContent>\n                  <DropdownMenuRadioGroup\n                    value={label}\n                    onValueChange={setLabel}\n                  >\n                    <DropdownMenuRadioItem value="personal">\n                      Personal\n                    </DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="work">\n                      Work\n                    </DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="other">\n                      Other\n                    </DropdownMenuRadioItem>\n                  </DropdownMenuRadioGroup>\n                </DropdownMenuSubContent>\n              </DropdownMenuSub>\n            </DropdownMenuGroup>\n            <DropdownMenuSeparator />\n            <DropdownMenuGroup>\n              <DropdownMenuItem variant="destructive">\n                <Trash2Icon />\n                Trash\n              </DropdownMenuItem>\n            </DropdownMenuGroup>\n          </DropdownMenuContent>\n        </DropdownMenu>\n      </ButtonGroup>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonGroupDemo />,
};
