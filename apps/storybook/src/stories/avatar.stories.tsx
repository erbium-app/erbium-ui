import { AvatarSizeExample } from "../examples/upstream/avatar-size";
import { AvatarGroupCountIconExample } from "../examples/upstream/avatar-group-count-icon";
import { AvatarGroupCountExample } from "../examples/upstream/avatar-group-count";
import { AvatarGroupExample } from "../examples/upstream/avatar-group";
import { AvatarBadgeIconExample } from "../examples/upstream/avatar-badge-icon";
import AvatarDemo from "../examples/upstream/avatar-basic";
import { AvatarWithBadge } from "../examples/upstream/avatar-badge";
import { AvatarDropdown } from "../examples/upstream/avatar-dropdown";
import { AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar } from "@erbium/ui/components/avatar";
import Demo from "../examples/avatar-demo";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An image element with a fallback for representing the user.\n\n**Import:** `@erbium/ui/components/avatar`  \n\n**shadcn/ui page:** [Avatar](https://ui.shadcn.com/docs/components/base/avatar)\n\n### Usage\n\n```tsx\nimport { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar"\n```\n\n```tsx\n<Avatar>\n  <AvatarImage src="https://github.com/shadcn.png" />\n  <AvatarFallback>CN</AvatarFallback>\n</Avatar>\n```\n\n### Composition\n\nUse the following composition to build an `Avatar`:\n\nUse the following composition to build an `AvatarGroup`:\n\n```text\nAvatar\n├── AvatarImage\n├── AvatarFallback\n└── AvatarBadge\n```\n\n```text\nAvatarGroup\n├── Avatar\n│   ├── AvatarImage\n│   ├── AvatarFallback\n│   └── AvatarBadge\n├── Avatar\n│   ├── AvatarImage\n│   ├── AvatarFallback\n│   └── AvatarBadge\n└── AvatarGroupCount\n```',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  size: "default" | "sm" | "lg";
  src: string;
  alt: string;
  fallback: string;
  className: string;
}> = {
  args: { size: "default", src: "", alt: "Profile photo", fallback: "AN", className: "" },
  argTypes: {
    size: { control: "select", options: ["default", "sm", "lg"] },
    src: { control: "text" },
    alt: { control: "text" },
    fallback: { control: "text" },
    className: { control: "text" },
  },
  render: (args) => (
    <Avatar size={args.size} className={args.className}>
      {args.src && <AvatarImage src={args.src} alt={args.alt} />}
      <AvatarFallback>{args.fallback}</AvatarFallback>
    </Avatar>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\n\nexport default function AvatarDemo() {\n  return (\n    <div className="flex flex-row flex-wrap items-center gap-12">\n      <Avatar>\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar className="rounded-lg">\n        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />\n        <AvatarFallback>ER</AvatarFallback>\n      </Avatar>\n      <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">\n        <Avatar>\n          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n          <AvatarFallback>CN</AvatarFallback>\n        </Avatar>\n        <Avatar>\n          <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />\n          <AvatarFallback>LR</AvatarFallback>\n        </Avatar>\n        <Avatar>\n          <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />\n          <AvatarFallback>ER</AvatarFallback>\n        </Avatar>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Fallback: Story = {
  parameters: {
    docs: {
      description: { story: "Display initials when an avatar image is unavailable." },
    },
  },

  render: () => (
    <Avatar>
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
  ),
};
export const Image: Story = {
  parameters: {
    docs: {
      description: { story: "Display an image with fallback content." },
    },
  },

  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A basic avatar component with an image and a fallback." },
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\n\nexport default function AvatarDemo() {\n  return (\n    <Avatar>\n      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" className="grayscale" />\n      <AvatarFallback>CN</AvatarFallback>\n    </Avatar>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarDemo />,
};
export const Badge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `AvatarBadge` component to add a badge to the avatar. The badge is positioned at the bottom right of the avatar.\n\nUse a theme token such as `bg-success` to set the badge color.\n\n```tsx\n<Avatar>\n  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n  <AvatarFallback>CN</AvatarFallback>\n  <AvatarBadge className="bg-success" />\n</Avatar>\n```',
      },
      source: {
        code: 'import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\n\nexport function AvatarWithBadge() {\n  return (\n    <Avatar>\n      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n      <AvatarFallback>CN</AvatarFallback>\n      <AvatarBadge className="bg-success" />\n    </Avatar>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarWithBadge />,
};
export const Dropdown: Story = {
  parameters: {
    docs: {
      description: {
        story: "You can use the `Avatar` component as a trigger for a dropdown menu.",
      },
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function AvatarDropdown() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>\n        <Avatar>\n          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />\n          <AvatarFallback>CN</AvatarFallback>\n        </Avatar>\n      </DropdownMenuTrigger>\n      <DropdownMenuContent className="w-32">\n        <DropdownMenuGroup>\n          <DropdownMenuItem>Profile</DropdownMenuItem>\n          <DropdownMenuItem>Billing</DropdownMenuItem>\n          <DropdownMenuItem>Settings</DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarDropdown />,
};

export const BadgeWithIcon: Story = {
  parameters: {
    docs: {
      description: { story: "You can also use an icon inside `<AvatarBadge>`." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport PlusIcon from "@hugeicons/core-free-icons/PlusIcon";\n\n\nimport { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\n\nexport function AvatarBadgeIconExample() {\n  return (\n    <Avatar className="grayscale">\n      <AvatarImage src="https://github.com/pranathip.png" alt="@pranathip" />\n      <AvatarFallback>PP</AvatarFallback>\n      <AvatarBadge>\n        <HugeiconsIcon icon={PlusIcon} />\n      </AvatarBadge>\n    </Avatar>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarBadgeIconExample />,
};

export const AvatarGroup: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `AvatarGroup` component to add a group of avatars." },
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@erbium/ui/components/avatar";\n\nexport function AvatarGroupExample() {\n  return (\n    <AvatarGroup className="grayscale">\n      <Avatar>\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />\n        <AvatarFallback>LR</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />\n        <AvatarFallback>ER</AvatarFallback>\n      </Avatar>\n    </AvatarGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarGroupExample />,
};

export const AvatarGroupCount: Story = {
  parameters: {
    docs: {
      description: { story: "Use `<AvatarGroupCount>` to add a count to the group." },
      source: {
        code: 'import {\n  Avatar,\n  AvatarFallback,\n  AvatarGroup,\n  AvatarGroupCount,\n  AvatarImage,\n} from "@erbium/ui/components/avatar";\n\nexport function AvatarGroupCountExample() {\n  return (\n    <AvatarGroup className="grayscale">\n      <Avatar>\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />\n        <AvatarFallback>LR</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />\n        <AvatarFallback>ER</AvatarFallback>\n      </Avatar>\n      <AvatarGroupCount>+3</AvatarGroupCount>\n    </AvatarGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarGroupCountExample />,
};

export const AvatarGroupWithIcon: Story = {
  parameters: {
    docs: {
      description: { story: "You can also use an icon inside `<AvatarGroupCount>`." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport PlusIcon from "@hugeicons/core-free-icons/PlusIcon";\n\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarGroup,\n  AvatarGroupCount,\n  AvatarImage,\n} from "@erbium/ui/components/avatar";\n\nexport function AvatarGroupCountIconExample() {\n  return (\n    <AvatarGroup className="grayscale">\n      <Avatar>\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />\n        <AvatarFallback>LR</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />\n        <AvatarFallback>ER</AvatarFallback>\n      </Avatar>\n      <AvatarGroupCount>\n        <HugeiconsIcon icon={PlusIcon} />\n      </AvatarGroupCount>\n    </AvatarGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarGroupCountIconExample />,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `size` prop to change the size of the avatar." },
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\n\nexport function AvatarSizeExample() {\n  return (\n    <div className="flex flex-wrap items-center gap-2 grayscale">\n      <Avatar size="sm">\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar>\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n      <Avatar size="lg">\n        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n        <AvatarFallback>CN</AvatarFallback>\n      </Avatar>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <AvatarSizeExample />,
};
