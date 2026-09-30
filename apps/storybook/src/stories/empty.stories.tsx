import { EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@erbium/ui/components/empty";
import { EmptyMuted } from "../examples/upstream/empty-background";
import EmptyOutline from "../examples/upstream/empty-outline";
import EmptyInputGroup from "../examples/upstream/empty-input-group";
import ExampleEmptyAvatar from "../examples/empty-avatar";
import ExampleEmptyAvatarGroup from "../examples/empty-avatar-group";
import ExampleEmptyInputGroup from "../examples/empty-input-group";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Empty } from "@erbium/ui/components/empty";
import Demo from "../examples/empty-demo";

const meta = {
  title: "UI/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Use `Empty` for an absent item or an initial state. It includes a subtle dashed boundary and generous spacing by default. Place the icon, title, and description in `EmptyHeader`; place actions or inputs in `EmptyContent` as a sibling. Use `EmptyMedia` without a variant for larger artwork or avatars.\n\n**Import:** `@erbium/ui/components/empty`  \n\n### Usage\n\n```tsx\nimport { HugeiconsIcon } from "@hugeicons/react"\nimport Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\n\n<Empty>\n  <EmptyHeader>\n    <EmptyMedia variant="icon"><HugeiconsIcon icon={Folder01Icon} /></EmptyMedia>\n    <EmptyTitle>No projects yet</EmptyTitle>\n    <EmptyDescription>Create a project to get started.</EmptyDescription>\n  </EmptyHeader>\n  <EmptyContent>\n    <Button>Create project</Button>\n  </EmptyContent>\n</Empty>\n```',
      },
    },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  className: string;
  mediaVariant: "default" | "icon";
  title: string;
  description: string;
}> = {
  args: {
    className: "",
    mediaVariant: "icon",
    title: "No results",
    description: "Try another search.",
  },
  argTypes: {
    className: { control: "text" },
    mediaVariant: { control: "select", options: ["default", "icon"] },
    title: { control: "text" },
    description: { control: "text" },
  },
  render: (args) => (
    <Empty className={`w-80 ${args.className}`}>
      <EmptyHeader>
        <EmptyMedia variant={args.mediaVariant}>☆</EmptyMedia>
        <EmptyTitle>{args.title}</EmptyTitle>
        <EmptyDescription>{args.description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyTitle,\n} from "@erbium/ui/components/empty";\nimport { Button } from "@erbium/ui/components/button";\nexport default function Demo() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyTitle>No projects yet</EmptyTitle>\n        <EmptyDescription>Create a project to get started.</EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button>Create project</Button>\n      </EmptyContent>\n    </Empty>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Avatar: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `EmptyMedia` component to display an avatar in the empty state.",
      },

      source: {
        code: 'import {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\n\nexport default function EmptyAvatar() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyMedia variant="default">\n          <Avatar className="size-12">\n            <AvatarImage\n              src="https://github.com/shadcn.png"\n              className="grayscale"\n            />\n            <AvatarFallback>LR</AvatarFallback>\n          </Avatar>\n        </EmptyMedia>\n        <EmptyTitle>User Offline</EmptyTitle>\n        <EmptyDescription>\n          This user is currently offline. You can leave a message to notify them\n          or try again later.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button size="sm">Leave Message</Button>\n      </EmptyContent>\n    </Empty>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleEmptyAvatar />
    </div>
  ),
};
export const AvatarGroup: Story = {
  parameters: {
    docs: {
      description: {
        story: "Use the `EmptyMedia` component to display an avatar group in the empty state.",
      },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport PlusIcon from "@hugeicons/core-free-icons/PlusIcon";\n\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\n\nexport default function EmptyAvatarGroup() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyMedia>\n          <div className="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">\n            <Avatar>\n              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n              <AvatarFallback>CN</AvatarFallback>\n            </Avatar>\n            <Avatar>\n              <AvatarImage\n                src="https://github.com/maxleiter.png"\n                alt="@maxleiter"\n              />\n              <AvatarFallback>LR</AvatarFallback>\n            </Avatar>\n            <Avatar>\n              <AvatarImage\n                src="https://github.com/evilrabbit.png"\n                alt="@evilrabbit"\n              />\n              <AvatarFallback>ER</AvatarFallback>\n            </Avatar>\n          </div>\n        </EmptyMedia>\n        <EmptyTitle>No Team Members</EmptyTitle>\n        <EmptyDescription>\n          Invite your team to collaborate on this project.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button size="sm">\n          <HugeiconsIcon icon={PlusIcon} />\n          Invite Members\n        </Button>\n      </EmptyContent>\n    </Empty>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleEmptyAvatarGroup />
    </div>
  ),
};
export const Inputgroup: Story = {
  parameters: {
    docs: {
      description: {
        story: "You can add an `InputGroup` component to the `EmptyContent` component.",
      },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport Search01Icon from "@hugeicons/core-free-icons/Search01Icon";\n\n\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\nimport { Kbd } from "@erbium/ui/components/kbd"\n\nexport default function EmptyInputGroup() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyTitle>404 - Not Found</EmptyTitle>\n        <EmptyDescription>\n          The page you&apos;re looking for doesn&apos;t exist. Try searching for\n          what you need below.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <InputGroup className="sm:w-3/4">\n          <InputGroupInput placeholder="Try searching for pages..." />\n          <InputGroupAddon>\n            <HugeiconsIcon icon={Search01Icon} />\n          </InputGroupAddon>\n          <InputGroupAddon align="inline-end">\n            <Kbd>/</Kbd>\n          </InputGroupAddon>\n        </InputGroup>\n        <EmptyDescription>\n          Need help? <a href="#">Contact support</a>\n        </EmptyDescription>\n      </EmptyContent>\n    </Empty>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleEmptyInputGroup />
    </div>
  ),
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: "Use an input group as the action in an empty state." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport Search01Icon from "@hugeicons/core-free-icons/Search01Icon";\n\n\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyTitle,\n} from "@erbium/ui/components/empty";\nimport { InputGroup, InputGroupAddon, InputGroupInput } from "@erbium/ui/components/input-group";\nimport { Kbd } from "@erbium/ui/components/kbd";\n\nexport default function EmptyInputGroup() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyTitle>404 - Not Found</EmptyTitle>\n        <EmptyDescription>\n          The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need\n          below.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <InputGroup className="sm:w-3/4">\n          <InputGroupInput placeholder="Try searching for pages..." />\n          <InputGroupAddon>\n            <HugeiconsIcon icon={Search01Icon} />\n          </InputGroupAddon>\n          <InputGroupAddon align="inline-end">\n            <Kbd>/</Kbd>\n          </InputGroupAddon>\n        </InputGroup>\n        <EmptyDescription>\n          Need help? <a href="#">Contact support</a>\n        </EmptyDescription>\n      </EmptyContent>\n    </Empty>\n  );\n}\n',
      },
    },
  },
  render: () => <EmptyInputGroup />,
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: { story: "The default empty state includes a dashed border." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport CloudIcon from "@hugeicons/core-free-icons/CloudIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty";\n\nexport default function EmptyOutline() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyMedia variant="icon">\n          <HugeiconsIcon icon={CloudIcon} />\n        </EmptyMedia>\n        <EmptyTitle>Cloud Storage Empty</EmptyTitle>\n        <EmptyDescription>\n          Upload files to your cloud storage to access them anywhere.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button variant="outline" size="sm">\n          Upload Files\n        </Button>\n      </EmptyContent>\n    </Empty>\n  );\n}\n',
      },
    },
  },
  render: () => <EmptyOutline />,
};

export const Background: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.",
      },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport BellIcon from "@hugeicons/core-free-icons/BellIcon";\nimport RefreshCcwIcon from "@hugeicons/core-free-icons/RefreshCcwIcon";\n\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty";\n\nexport function EmptyMuted() {\n  return (\n    <Empty className="h-full bg-muted/30">\n      <EmptyHeader>\n        <EmptyMedia variant="icon">\n          <HugeiconsIcon icon={BellIcon} />\n        </EmptyMedia>\n        <EmptyTitle>No Notifications</EmptyTitle>\n        <EmptyDescription className="max-w-xs text-pretty">\n          You&apos;re all caught up. New notifications will appear here.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button variant="outline">\n          <HugeiconsIcon icon={RefreshCcwIcon} data-icon="inline-start" />\n          Refresh\n        </Button>\n      </EmptyContent>\n    </Empty>\n  );\n}\n',
      },
    },
  },
  render: () => <EmptyMuted />,
};
