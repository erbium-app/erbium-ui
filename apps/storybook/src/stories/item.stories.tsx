import { ItemContent, ItemTitle, ItemDescription, ItemMedia } from "@erbium/ui/components/item";
import { ItemImage } from "../examples/upstream/item-image";
import { ItemHeaderDemo } from "../examples/upstream/item-header";
import ExampleItemVariant from "../examples/item-variant";
import ExampleItemSize from "../examples/item-size";
import ExampleItemIcon from "../examples/item-icon";
import ExampleItemAvatar from "../examples/item-avatar";
import ExampleItemGroup from "../examples/item-group";
import ExampleItemLink from "../examples/item-link";
import ExampleItemDropdown from "../examples/item-dropdown";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Item } from "@erbium/ui/components/item";
import Demo from "../examples/item-demo";

const meta = {
  title: "UI/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A versatile component for displaying content with media, title, description, and actions.\n\n**Import:** `@erbium/ui/components/item`  \n\n**shadcn/ui page:** [Item](https://ui.shadcn.com/docs/components/base/item)\n\n### Usage\n\n```tsx\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n```\n\n```tsx\n<Item>\n  <ItemMedia variant="icon">\n    <Icon />\n  </ItemMedia>\n  <ItemContent>\n    <ItemTitle>Title</ItemTitle>\n    <ItemDescription>Description</ItemDescription>\n  </ItemContent>\n  <ItemActions>\n    <Button>Action</Button>\n  </ItemActions>\n</Item>\n```\n\n### Composition\n\nUse the following composition to build an `Item`:\n\n```text\nItemGroup\n└── Item\n    ├── ItemHeader\n    ├── ItemMedia\n    ├── ItemContent\n    │   ├── ItemTitle\n    │   └── ItemDescription\n    ├── ItemActions\n    └── ItemFooter\n```\n\n### Item vs Field\n\nUse `Field` if you need to display a form input such as a checkbox, input, radio, or select.\n\nIf you only need to display content such as a title, description, and actions, use `Item`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  variant: "default" | "outline" | "muted";
  size: "default" | "sm" | "xs";
  mediaVariant: "default" | "icon" | "image";
  asLink: boolean;
  className: string;
}> = {
  args: {
    variant: "default",
    size: "default",
    mediaVariant: "icon",
    asLink: false,
    className: "",
  },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "muted"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
    mediaVariant: { control: "select", options: ["default", "icon", "image"] },
    asLink: { control: "boolean" },
    className: { control: "text" },
  },
  render: (args) => (
    <Item
      variant={args.variant}
      size={args.size}
      render={args.asLink ? <a href="#" /> : undefined}
      className={`w-80 ${args.className}`}
    >
      <ItemMedia variant={args.mediaVariant}>☆</ItemMedia>
      <ItemContent>
        <ItemTitle>Item title</ItemTitle>
        <ItemDescription>Item description</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item";\n\nexport default function ItemDemo() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <Item variant="outline">\n        <ItemContent>\n          <ItemTitle>Basic Item</ItemTitle>\n          <ItemDescription>A simple item with title and description.</ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Action\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item\n        variant="outline"\n        size="sm"\n        render={\n          <a href="#">\n            <ItemMedia>\n              <BadgeCheckIcon className="size-5" />\n            </ItemMedia>\n            <ItemContent>\n              <ItemTitle>Your profile has been verified.</ItemTitle>\n            </ItemContent>\n            <ItemActions>\n              <ChevronRightIcon className="size-4" />\n            </ItemActions>\n          </a>\n        }\n      />\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Variant: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `variant` prop to change the visual style of the item." },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemVariant() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Item>\n        <ItemContent>\n          <ItemTitle>Default Variant</ItemTitle>\n          <ItemDescription>\n            Standard styling with subtle background and borders.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Open\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="outline">\n        <ItemContent>\n          <ItemTitle>Outline Variant</ItemTitle>\n          <ItemDescription>\n            Outlined style with clear borders and transparent background.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Open\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="muted">\n        <ItemContent>\n          <ItemTitle>Muted Variant</ItemTitle>\n          <ItemDescription>\n            Subdued appearance with muted colors for secondary content.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Open\n          </Button>\n        </ItemActions>\n      </Item>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemVariant />
    </div>
  ),
};
export const Size: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `size` prop to change the size of the item. Available sizes are `default`, `sm`, and `xs`.",
      },

      source: {
        code: 'import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemSizeDemo() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <Item variant="outline">\n        <ItemContent>\n          <ItemTitle>Basic Item</ItemTitle>\n          <ItemDescription>\n            A simple item with title and description.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Action\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="outline" size="sm" render={<a href="#">\n          <ItemMedia>\n            <BadgeCheckIcon className="size-5" />\n          </ItemMedia>\n          <ItemContent>\n            <ItemTitle>Your profile has been verified.</ItemTitle>\n          </ItemContent>\n          <ItemActions>\n            <ChevronRightIcon className="size-4" />\n          </ItemActions>\n        </a>} />\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemSize />
    </div>
  ),
};
export const Icon: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `ItemMedia` with `variant="icon"` to display an icon.' },

      source: {
        code: 'import { ShieldAlertIcon } from "lucide-react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemIcon() {\n  return (\n    <div className="flex w-full max-w-lg flex-col gap-6">\n      <Item variant="outline">\n        <ItemMedia variant="icon">\n          <ShieldAlertIcon />\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle>Security Alert</ItemTitle>\n          <ItemDescription>\n            New login detected from unknown device.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button size="sm" variant="outline">\n            Review\n          </Button>\n        </ItemActions>\n      </Item>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemIcon />
    </div>
  ),
};
export const Avatar: Story = {
  parameters: {
    docs: {
      description: {
        story: 'You can use `ItemMedia` with `variant="avatar"` to display an avatar.',
      },

      source: {
        code: 'import { Plus } from "lucide-react"\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemAvatar() {\n  return (\n    <div className="flex w-full max-w-lg flex-col gap-6">\n      <Item variant="outline">\n        <ItemMedia>\n          <Avatar className="size-10">\n            <AvatarImage src="https://github.com/evilrabbit.png" />\n            <AvatarFallback>ER</AvatarFallback>\n          </Avatar>\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle>Evil Rabbit</ItemTitle>\n          <ItemDescription>Last seen 5 months ago</ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button\n            size="icon-sm"\n            variant="outline"\n            className="rounded-full"\n            aria-label="Invite"\n          >\n            <Plus />\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="outline">\n        <ItemMedia>\n          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">\n            <Avatar className="hidden sm:flex">\n              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n              <AvatarFallback>CN</AvatarFallback>\n            </Avatar>\n            <Avatar className="hidden sm:flex">\n              <AvatarImage\n                src="https://github.com/maxleiter.png"\n                alt="@maxleiter"\n              />\n              <AvatarFallback>LR</AvatarFallback>\n            </Avatar>\n            <Avatar>\n              <AvatarImage\n                src="https://github.com/evilrabbit.png"\n                alt="@evilrabbit"\n              />\n              <AvatarFallback>ER</AvatarFallback>\n            </Avatar>\n          </div>\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle>No Team Members</ItemTitle>\n          <ItemDescription>\n            Invite your team to collaborate on this project.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button size="sm" variant="outline">\n            Invite\n          </Button>\n        </ItemActions>\n      </Item>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemAvatar />
    </div>
  ),
};
export const Group: Story = {
  parameters: {
    docs: {
      description: { story: "Use `ItemGroup` to group related items together." },

      source: {
        code: 'import * as React from "react"\nimport { PlusIcon } from "lucide-react"\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemGroup,\n  ItemMedia,\n  ItemSeparator,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nconst people = [\n  {\n    username: "shadcn",\n    avatar: "https://github.com/shadcn.png",\n    email: "shadcn@vercel.com",\n  },\n  {\n    username: "maxleiter",\n    avatar: "https://github.com/maxleiter.png",\n    email: "maxleiter@vercel.com",\n  },\n  {\n    username: "evilrabbit",\n    avatar: "https://github.com/evilrabbit.png",\n    email: "evilrabbit@vercel.com",\n  },\n]\n\nexport default function ItemGroupExample() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <ItemGroup>\n        {people.map((person, index) => (\n          <React.Fragment key={person.username}>\n            <Item>\n              <ItemMedia>\n                <Avatar>\n                  <AvatarImage src={person.avatar} className="grayscale" />\n                  <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>\n                </Avatar>\n              </ItemMedia>\n              <ItemContent className="gap-1">\n                <ItemTitle>{person.username}</ItemTitle>\n                <ItemDescription>{person.email}</ItemDescription>\n              </ItemContent>\n              <ItemActions>\n                <Button variant="ghost" size="icon" className="rounded-full">\n                  <PlusIcon />\n                </Button>\n              </ItemActions>\n            </Item>\n            {index !== people.length - 1 && <ItemSeparator />}\n          </React.Fragment>\n        ))}\n      </ItemGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemGroup />
    </div>
  ),
};
export const Link: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `render` prop to render the item as a link. The hover and focus states will be applied to the anchor element.\n\n```tsx\n<Item render={<a href="/dashboard" />}>\n  <ItemMedia variant="icon">\n    <HomeIcon />\n  </ItemMedia>\n  <ItemContent>\n    <ItemTitle>Dashboard</ItemTitle>\n    <ItemDescription>Overview of your account and activity.</ItemDescription>\n  </ItemContent>\n</Item>\n```',
      },

      source: {
        code: 'import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react"\n\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemLink() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-4">\n      <Item render={<a href="#">\n          <ItemContent>\n            <ItemTitle>Visit our documentation</ItemTitle>\n            <ItemDescription>\n              Learn how to get started with our components.\n            </ItemDescription>\n          </ItemContent>\n          <ItemActions>\n            <ChevronRightIcon className="size-4" />\n          </ItemActions>\n        </a>} />\n      <Item variant="outline" render={<a href="#" target="_blank" rel="noopener noreferrer">\n          <ItemContent>\n            <ItemTitle>External resource</ItemTitle>\n            <ItemDescription>\n              Opens in a new tab with security attributes.\n            </ItemDescription>\n          </ItemContent>\n          <ItemActions>\n            <ExternalLinkIcon className="size-4" />\n          </ItemActions>\n        </a>} />\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemLink />
    </div>
  ),
};
export const Dropdown: Story = {
  parameters: {
    docs: {
      description: { story: "Add a dropdown action to an item." },

      source: {
        code: '\nimport { ChevronDownIcon } from "lucide-react"\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\nimport {\n  Item,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nconst people = [\n  {\n    username: "shadcn",\n    avatar: "https://github.com/shadcn.png",\n    email: "shadcn@vercel.com",\n  },\n  {\n    username: "maxleiter",\n    avatar: "https://github.com/maxleiter.png",\n    email: "maxleiter@vercel.com",\n  },\n  {\n    username: "evilrabbit",\n    avatar: "https://github.com/evilrabbit.png",\n    email: "evilrabbit@vercel.com",\n  },\n]\n\nexport default function ItemDropdown() {\n  return (\n    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-6">\n      <DropdownMenu>\n        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="w-fit">\n            Select <ChevronDownIcon />\n          </Button>} />\n        <DropdownMenuContent className="w-72 [--radius:0.65rem]" align="end">\n          {people.map((person) => (\n            <DropdownMenuItem key={person.username} className="p-0">\n              <Item size="sm" className="w-full p-2">\n                <ItemMedia>\n                  <Avatar className="size-8">\n                    <AvatarImage src={person.avatar} className="grayscale" />\n                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>\n                  </Avatar>\n                </ItemMedia>\n                <ItemContent className="gap-0.5">\n                  <ItemTitle>{person.username}</ItemTitle>\n                  <ItemDescription>{person.email}</ItemDescription>\n                </ItemContent>\n              </Item>\n            </DropdownMenuItem>\n          ))}\n        </DropdownMenuContent>\n      </DropdownMenu>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemDropdown />
    </div>
  ),
};

export const Header: Story = {
  parameters: {
    docs: {
      description: { story: "Use `ItemHeader` to add a header above the item content." },
      source: {
        code: 'import {\n  Item,\n  ItemContent,\n  ItemDescription,\n  ItemGroup,\n  ItemHeader,\n  ItemTitle,\n} from "@erbium/ui/components/item";\n\nconst models = [\n  {\n    name: "v0-1.5-sm",\n    description: "Everyday tasks and UI generation.",\n    image:\n      "https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?q=80&w=640&auto=format&fit=crop",\n    credit: "Valeria Reverdo on Unsplash",\n  },\n  {\n    name: "v0-1.5-lg",\n    description: "Advanced thinking or reasoning.",\n    image:\n      "https://images.unsplash.com/photo-1610280777472-54133d004c8c?q=80&w=640&auto=format&fit=crop",\n    credit: "Michael Oeser on Unsplash",\n  },\n  {\n    name: "v0-2.0-mini",\n    description: "Open Source model for everyone.",\n    image:\n      "https://images.unsplash.com/photo-1602146057681-08560aee8cde?q=80&w=640&auto=format&fit=crop",\n    credit: "Cherry Laithang on Unsplash",\n  },\n];\n\nexport function ItemHeaderDemo() {\n  return (\n    <div className="flex w-full max-w-xl flex-col gap-6">\n      <ItemGroup className="grid grid-cols-3 gap-4">\n        {models.map((model) => (\n          <Item key={model.name} variant="outline">\n            <ItemHeader>\n              <img\n                src={model.image}\n                alt={model.name}\n                width={128}\n                height={128}\n                className="aspect-square w-full rounded-sm object-cover"\n              />\n            </ItemHeader>\n            <ItemContent>\n              <ItemTitle>{model.name}</ItemTitle>\n              <ItemDescription>{model.description}</ItemDescription>\n            </ItemContent>\n          </Item>\n        ))}\n      </ItemGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ItemHeaderDemo />,
};

export const Image: Story = {
  parameters: {
    docs: {
      description: { story: 'Use `ItemMedia` with `variant="image"` to display an image.' },
      source: {
        code: 'import {\n  Item,\n  ItemContent,\n  ItemDescription,\n  ItemGroup,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item";\n\nconst music = [\n  {\n    title: "Midnight City Lights",\n    artist: "Neon Dreams",\n    album: "Electric Nights",\n    duration: "3:45",\n  },\n  {\n    title: "Coffee Shop Conversations",\n    artist: "The Morning Brew",\n    album: "Urban Stories",\n    duration: "4:05",\n  },\n  {\n    title: "Digital Rain",\n    artist: "Cyber Symphony",\n    album: "Binary Beats",\n    duration: "3:30",\n  },\n];\n\nexport function ItemImage() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <ItemGroup className="gap-4">\n        {music.map((song) => (\n          <Item key={song.title} variant="outline" render={<a href="#" />} role="listitem">\n            <ItemMedia variant="image">\n              <img\n                src={`https://avatar.vercel.sh/${song.title}`}\n                alt={song.title}\n                width={32}\n                height={32}\n                className="object-cover grayscale"\n              />\n            </ItemMedia>\n            <ItemContent>\n              <ItemTitle className="line-clamp-1">\n                {song.title} - <span className="text-muted-foreground">{song.album}</span>\n              </ItemTitle>\n              <ItemDescription>{song.artist}</ItemDescription>\n            </ItemContent>\n            <ItemContent className="flex-none text-center">\n              <ItemDescription>{song.duration}</ItemDescription>\n            </ItemContent>\n          </Item>\n        ))}\n      </ItemGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ItemImage />,
};
