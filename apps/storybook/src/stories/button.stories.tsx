import ButtonWithIcon from "../examples/upstream/button-with-icon";
import ButtonLoading from "../examples/upstream/button-spinner";
import ExampleButtonSize from "../examples/button-size";
import ExampleButtonDefault from "../examples/button-default";
import ExampleButtonOutline from "../examples/button-outline";
import ExampleButtonSecondary from "../examples/button-secondary";
import ExampleButtonGhost from "../examples/button-ghost";
import ExampleButtonDestructive from "../examples/button-destructive";
import ExampleButtonLink from "../examples/button-link";
import ExampleButtonIcon from "../examples/button-icon";
import ExampleButtonRounded from "../examples/button-rounded";
import ExampleButtonGroupDemo from "../examples/button-group-demo";
import ButtonShortcutDemo from "../examples/kbd-button";
import { Spinner } from "@erbium/ui/components/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";

import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button, buttonVariants } from "@erbium/ui/components/button";
import Demo from "../examples/button-demo";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a button or a component that looks like a button.\n\n**Import:** `@erbium/ui/components/button`  \n\n**shadcn/ui page:** [Button](https://ui.shadcn.com/docs/components/base/button)\n\n### Usage\n\n```tsx\nimport { Button } from "@erbium/ui/components/button"\n```\n\n```tsx\n<Button variant="outline">Button</Button>\n```\n\n### Cursor\n\nTailwind v4 [switched](https://tailwindcss.com/docs/upgrade-guide#buttons-use-the-default-cursor) from `cursor: pointer` to `cursor: default` for the button component.\n\nIf you want to keep the `cursor: pointer` behavior, add the following code to your CSS file:\n\nYou can also enable this during project setup with `npx shadcn@latest init --pointer`.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Button> = {
  args: {
    variant: "default",
    size: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "ghost",
        "destructive",
        "ghost-destructive",
        "ghost-success",
        "ghost-warning",
        "ghost-info",
        "secondary",
        "link",
      ],
      description: "Visual style of the button.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
      description: "Button size, including icon-only sizes.",
      table: { defaultValue: { summary: "default" } },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the Controls panel to try every `variant` and `size` in the Button API reference.",
      },
    },
  },
  render: (args) => {
    const iconOnly = typeof args.size === "string" && args.size.startsWith("icon");

    return (
      <Button {...args} aria-label={iconOnly ? "Submit" : undefined}>
        {iconOnly ? <HugeiconsIcon icon={ArrowUp01Icon} /> : "Button"}
      </Button>
    );
  },
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";\n\n\nimport { Button } from "@erbium/ui/components/button";\n\nexport default function ButtonDemo() {\n  return (\n    <div className="flex flex-wrap items-center gap-2 md:flex-row">\n      <Button variant="outline">Button</Button>\n      <Button variant="outline" size="icon" aria-label="Submit">\n        <HugeiconsIcon icon={ArrowUp01Icon} />\n      </Button>\n    </div>\n  );\n}\n',
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
  parameters: {
    docs: {
      description: { story: "Compare the available button variants." },
    },
  },

  render: () => (
    <div className="flex flex-wrap gap-2">
      {(
        [
          "default",
          "secondary",
          "outline",
          "ghost",
          "destructive",
          "ghost-destructive",
          "ghost-success",
          "ghost-warning",
          "ghost-info",
          "link",
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: "Compare the available button sizes." },
    },
  },

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
export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Place `ButtonShortcut` after the label. Button owns its spacing in both LTR and RTL layouts; the binding determines the platform label.",
      },
    },
  },
  render: () => <ButtonShortcutDemo />,
};
export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: "Disable a button to prevent interaction." },
    },
  },
  render: () => <Button disabled>Unavailable</Button>,
};
export const Loading: Story = {
  parameters: {
    docs: {
      description: { story: "Show a spinner while an action is in progress." },
    },
  },

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
      description: { story: "Use the `size` prop to change the size of the button." },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";\n\n\nimport { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonSize() {\n  return (\n    <div className="flex flex-col items-start gap-8 sm:flex-row">\n      <div className="flex items-start gap-2">\n        <Button size="sm" variant="outline">\n          Small\n        </Button>\n        <Button size="icon-sm" aria-label="Submit" variant="outline">\n          <HugeiconsIcon icon={ArrowUpRight01Icon} />\n        </Button>\n      </div>\n      <div className="flex items-start gap-2">\n        <Button variant="outline">Default</Button>\n        <Button size="icon" aria-label="Submit" variant="outline">\n          <HugeiconsIcon icon={ArrowUpRight01Icon} />\n        </Button>\n      </div>\n      <div className="flex items-start gap-2">\n        <Button variant="outline" size="lg">\n          Large\n        </Button>\n        <Button size="icon-lg" aria-label="Submit" variant="outline">\n          <HugeiconsIcon icon={ArrowUpRight01Icon} />\n        </Button>\n      </div>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonSize />,
};
export const Default: Story = {
  parameters: {
    docs: {
      description: { story: "The default button style." },

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
      description: { story: "Use the outline variant for a lower-emphasis action." },

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
      description: { story: "Use the secondary variant for an alternative action." },

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
      description: { story: "Use the ghost variant for a subtle action." },

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
      description: { story: "Use the destructive variant for an irreversible action." },

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
      description: { story: "Style a button as a link." },

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
      description: {
        story: "Pair an icon with a button label, or label an icon-only button for accessibility.",
      },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport CircleFadingArrowUpIcon from "@hugeicons/core-free-icons/CircleFadingArrowUpIcon";\n\n\nimport { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonIcon() {\n  return (\n    <Button variant="outline" size="icon">\n      <HugeiconsIcon icon={CircleFadingArrowUpIcon} />\n    </Button>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonIcon />,
};
export const Rounded: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `rounded-full` class to make the button rounded." },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ArrowUp01Icon from "@hugeicons/core-free-icons/ArrowUp01Icon";\n\n\nimport { Button } from "@erbium/ui/components/button"\n\nexport default function ButtonRounded() {\n  return (\n    <div className="flex flex-col gap-8">\n      <Button variant="outline" size="icon" className="rounded-full">\n        <HugeiconsIcon icon={ArrowUp01Icon} />\n      </Button>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonRounded />,
};
export const ButtonGroup: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "To create a button group, use the `ButtonGroup` component. See the [Button Group](https://ui.shadcn.com/docs/components/base/button-group) documentation for more details.",
      },

      source: {
        code: '\nimport * as React from "react"\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport ArchiveIcon from "@hugeicons/core-free-icons/ArchiveIcon";\nimport ArrowLeft01Icon from "@hugeicons/core-free-icons/ArrowLeft01Icon";\nimport CalendarPlusIcon from "@hugeicons/core-free-icons/CalendarPlusIcon";\nimport Clock01Icon from "@hugeicons/core-free-icons/Clock01Icon";\nimport Delete02Icon from "@hugeicons/core-free-icons/Delete02Icon";\nimport ListFilterIcon from "@hugeicons/core-free-icons/ListFilterIcon";\nimport MailCheckIcon from "@hugeicons/core-free-icons/MailCheckIcon";\nimport MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";\nimport Tag01Icon from "@hugeicons/core-free-icons/Tag01Icon";\n\n\nimport { Button } from "@erbium/ui/components/button"\nimport { ButtonGroup } from "@erbium/ui/components/button-group"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuSeparator,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\n\nexport default function ButtonGroupDemo() {\n  const [label, setLabel] = React.useState("personal")\n\n  return (\n    <ButtonGroup>\n      <ButtonGroup className="hidden sm:flex">\n        <Button variant="outline" size="icon" aria-label="Go Back">\n          <HugeiconsIcon icon={ArrowLeft01Icon} />\n        </Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Archive</Button>\n        <Button variant="outline">Report</Button>\n      </ButtonGroup>\n      <ButtonGroup>\n        <Button variant="outline">Snooze</Button>\n        <DropdownMenu>\n          <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More Options">\n              <HugeiconsIcon icon={MoreHorizontalIcon} />\n            </Button>} />\n          <DropdownMenuContent align="end" className="w-52">\n            <DropdownMenuGroup>\n              <DropdownMenuItem>\n                <HugeiconsIcon icon={MailCheckIcon} />\n                Mark as Read\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <HugeiconsIcon icon={ArchiveIcon} />\n                Archive\n              </DropdownMenuItem>\n            </DropdownMenuGroup>\n            <DropdownMenuSeparator />\n            <DropdownMenuGroup>\n              <DropdownMenuItem>\n                <HugeiconsIcon icon={Clock01Icon} />\n                Snooze\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <HugeiconsIcon icon={CalendarPlusIcon} />\n                Add to Calendar\n              </DropdownMenuItem>\n              <DropdownMenuItem>\n                <HugeiconsIcon icon={ListFilterIcon} />\n                Add to List\n              </DropdownMenuItem>\n              <DropdownMenuSub>\n                <DropdownMenuSubTrigger>\n                  <HugeiconsIcon icon={Tag01Icon} />\n                  Label As...\n                </DropdownMenuSubTrigger>\n                <DropdownMenuSubContent>\n                  <DropdownMenuRadioGroup\n                    value={label}\n                    onValueChange={setLabel}\n                  >\n                    <DropdownMenuRadioItem value="personal">\n                      Personal\n                    </DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="work">\n                      Work\n                    </DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="other">\n                      Other\n                    </DropdownMenuRadioItem>\n                  </DropdownMenuRadioGroup>\n                </DropdownMenuSubContent>\n              </DropdownMenuSub>\n            </DropdownMenuGroup>\n            <DropdownMenuSeparator />\n            <DropdownMenuGroup>\n              <DropdownMenuItem variant="destructive">\n                <HugeiconsIcon icon={Delete02Icon} />\n                Trash\n              </DropdownMenuItem>\n            </DropdownMenuGroup>\n          </DropdownMenuContent>\n        </DropdownMenu>\n      </ButtonGroup>\n    </ButtonGroup>\n  )\n}\n',
      },
    },
  },
  render: () => <ExampleButtonGroupDemo />,
};

export const WithSpinner: Story = {
  name: "Spinner",
  parameters: {
    docs: {
      description: {
        story:
          'Render a `<Spinner />` component inside the button to show a loading state. Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` attribute to the spinner for the correct spacing.',
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Spinner } from "@erbium/ui/components/spinner";\n\nexport default function ButtonLoading() {\n  return (\n    <div className="flex gap-2">\n      <Button variant="outline" disabled>\n        <Spinner data-icon="inline-start" />\n        Generating\n      </Button>\n      <Button variant="secondary" disabled>\n        Downloading\n        <Spinner data-icon="inline-start" />\n      </Button>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ButtonLoading />,
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Remember to add the `data-icon="inline-start"` or `data-icon="inline-end"` attribute to the icon for the correct spacing.',
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport GitBranchIcon from "@hugeicons/core-free-icons/GitBranchIcon";\nimport GitForkIcon from "@hugeicons/core-free-icons/GitForkIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\n\nexport default function ButtonWithIcon() {\n  return (\n    <div className="flex gap-2">\n      <Button variant="outline">\n        <HugeiconsIcon icon={GitBranchIcon} data-icon="inline-start" /> New Branch\n      </Button>\n      <Button variant="outline">\n        Fork\n        <HugeiconsIcon icon={GitForkIcon} data-icon="inline-end" />\n      </Button>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ButtonWithIcon />,
};
export const AsLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'You can use the `buttonVariants` helper to make a link look like a button.\n\n**Do not use `<Button render={<a />} nativeButton={false} />` for links.** The Base UI `Button` component always applies `role="button"`, which overrides the semantic link role on `<a>` elements. Use `buttonVariants` with a plain `<a>` tag instead.',
      },
    },
  },

  render: () => (
    <a className={buttonVariants({ variant: "outline" })} href="#button-as-link">
      Open section
    </a>
  ),
};
