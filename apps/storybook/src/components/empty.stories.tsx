import ExampleEmptyAvatar from "./examples/empty-avatar";
import ExampleEmptyAvatarGroup from "./examples/empty-avatar-group";
import ExampleEmptyInputGroup from "./examples/empty-input-group";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Empty } from "@erbium/ui/components/empty";
import Demo from "./examples/empty-demo";

const meta = {
  title: "UI/Empty",
  component: Empty,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Use the Empty component to display an empty state.\n\n**Import:** `@erbium/ui/components/empty`  \n\n**shadcn/ui page:** [Empty](https://ui.shadcn.com/docs/components/base/empty)\n\n### Usage\n\n```tsx\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\n```\n\n```tsx\n<Empty>\n  <EmptyHeader>\n    <EmptyMedia variant="icon">\n      <Icon />\n    </EmptyMedia>\n    <EmptyTitle>No data</EmptyTitle>\n    <EmptyDescription>No data found</EmptyDescription>\n  </EmptyHeader>\n  <EmptyContent>\n    <Button>Add data</Button>\n  </EmptyContent>\n</Empty>\n```\n\n### Composition\n\nUse the following composition to build an `Empty` state:\n\n```text\nEmpty\n├── EmptyHeader\n│   ├── EmptyMedia\n│   ├── EmptyTitle\n│   └── EmptyDescription\n└── EmptyContent\n```\n\n### Outline\n\nUse the `border` utility class to create an outline empty state.\n\nstyleName="base-nova"\n\nname="empty-outline"\n\npreviewClassName="h-96 p-6 md:p-10"\n\n/>\n\n### Background\n\nUse the `bg-*` and `bg-gradient-*` utilities to add a background to the empty state.\n\nstyleName="base-nova"\n\nname="empty-background"\n\npreviewClassName="h-96 p-0"\n\n/>\n\n### Avatar\n\nUse the `EmptyMedia` component to display an avatar in the empty state.\n\nstyleName="base-nova"\n\nname="empty-avatar"\n\npreviewClassName="h-96 p-0"\n\n/>\n\n### Avatar Group\n\nUse the `EmptyMedia` component to display an avatar group in the empty state.\n\nstyleName="base-nova"\n\nname="empty-avatar-group"\n\npreviewClassName="h-96 p-0"\n\n/>\n\n### InputGroup\n\nYou can add an `InputGroup` component to the `EmptyContent` component.\n\nstyleName="base-nova"\n\nname="empty-input-group"\n\npreviewClassName="h-96 p-0"\n\n/>',
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
      source: {
        code: 'import { PlusIcon } from "lucide-react"\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\n\nexport default function EmptyAvatarGroup() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyMedia>\n          <div className="flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">\n            <Avatar>\n              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n              <AvatarFallback>CN</AvatarFallback>\n            </Avatar>\n            <Avatar>\n              <AvatarImage\n                src="https://github.com/maxleiter.png"\n                alt="@maxleiter"\n              />\n              <AvatarFallback>LR</AvatarFallback>\n            </Avatar>\n            <Avatar>\n              <AvatarImage\n                src="https://github.com/evilrabbit.png"\n                alt="@evilrabbit"\n              />\n              <AvatarFallback>ER</AvatarFallback>\n            </Avatar>\n          </div>\n        </EmptyMedia>\n        <EmptyTitle>No Team Members</EmptyTitle>\n        <EmptyDescription>\n          Invite your team to collaborate on this project.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button size="sm">\n          <PlusIcon />\n          Invite Members\n        </Button>\n      </EmptyContent>\n    </Empty>\n  )\n}\n',
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
      source: {
        code: 'import { SearchIcon } from "lucide-react"\n\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupInput,\n} from "@erbium/ui/components/input-group"\nimport { Kbd } from "@erbium/ui/components/kbd"\n\nexport default function EmptyInputGroup() {\n  return (\n    <Empty>\n      <EmptyHeader>\n        <EmptyTitle>404 - Not Found</EmptyTitle>\n        <EmptyDescription>\n          The page you&apos;re looking for doesn&apos;t exist. Try searching for\n          what you need below.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <InputGroup className="sm:w-3/4">\n          <InputGroupInput placeholder="Try searching for pages..." />\n          <InputGroupAddon>\n            <SearchIcon />\n          </InputGroupAddon>\n          <InputGroupAddon align="inline-end">\n            <Kbd>/</Kbd>\n          </InputGroupAddon>\n        </InputGroup>\n        <EmptyDescription>\n          Need help? <a href="#">Contact support</a>\n        </EmptyDescription>\n      </EmptyContent>\n    </Empty>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleEmptyInputGroup />
    </div>
  ),
};
