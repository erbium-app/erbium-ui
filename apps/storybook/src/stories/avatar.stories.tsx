import { AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar } from "@erbium/ui/components/avatar";
import Demo from "../examples/avatar-demo";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An image element with a fallback for representing the user.\n\n**Import:** `@erbium/ui/components/avatar`  \n\n**shadcn/ui page:** [Avatar](https://ui.shadcn.com/docs/components/base/avatar)\n\n### Usage\n\n```tsx\nimport { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar"\n```\n\n```tsx\n<Avatar>\n  <AvatarImage src="https://github.com/shadcn.png" />\n  <AvatarFallback>CN</AvatarFallback>\n</Avatar>\n```\n\n### Composition\n\nUse the following composition to build an `Avatar`:\n\nUse the following composition to build an `AvatarGroup`:\n\n```text\nAvatar\n├── AvatarImage\n├── AvatarFallback\n└── AvatarBadge\n```\n\n```text\nAvatarGroup\n├── Avatar\n│   ├── AvatarImage\n│   ├── AvatarFallback\n│   └── AvatarBadge\n├── Avatar\n│   ├── AvatarImage\n│   ├── AvatarFallback\n│   └── AvatarBadge\n└── AvatarGroupCount\n```\n\n### Basic\n\nA basic avatar component with an image and a fallback.\n\n### Badge\n\nUse the `AvatarBadge` component to add a badge to the avatar. The badge is positioned at the bottom right of the avatar.\n\nUse the `className` prop to add custom styles to the badge such as custom colors, sizes, etc.\n\n```tsx\n<Avatar>\n  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n  <AvatarFallback>CN</AvatarFallback>\n  <AvatarBadge className="bg-green-600 dark:bg-green-800" />\n</Avatar>\n```\n\n### Badge with Icon\n\nYou can also use an icon inside `<AvatarBadge>`.\n\n### Avatar Group\n\nUse the `AvatarGroup` component to add a group of avatars.\n\n### Avatar Group Count\n\nUse `<AvatarGroupCount>` to add a count to the group.\n\n### Avatar Group with Icon\n\nYou can also use an icon inside `<AvatarGroupCount>`.\n\n### Sizes\n\nUse the `size` prop to change the size of the avatar.\n\n### Dropdown\n\nYou can use the `Avatar` component as a trigger for a dropdown menu.',
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
  render: () => (
    <Avatar>
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
  ),
};
export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
      <AvatarFallback>AN</AvatarFallback>
    </Avatar>
  ),
};
