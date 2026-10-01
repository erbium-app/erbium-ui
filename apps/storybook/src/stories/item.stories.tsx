import { ItemContent, ItemTitle, ItemDescription, ItemMedia } from "@erbium/ui/components/item";
import { ItemImage } from "../examples/upstream/item-image";
import { ItemHeaderDemo } from "../examples/upstream/item-header";
import ExampleItemVariant from "../examples/item-variant";
import ExampleItemSize from "../examples/item-size";
import ExampleItemIcon from "../examples/item-icon";
import ExampleItemAvatar from "../examples/item-avatar";
import ExampleItemGroup from "../examples/item-group";
import ExampleItemBookLibrary from "../examples/item-book-library";
import ExampleItemJoinedSelection from "../examples/item-joined-selection";
import ExampleItemLink from "../examples/item-link";
import ExampleItemDropdown from "../examples/item-dropdown";
import ExampleItemSettingsPanel from "../examples/item-settings-panel";
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
          'A versatile component for displaying content with media, title, description, and actions.\n\n**Import:** `@erbium/ui/components/item`  \n\n**shadcn/ui page:** [Item](https://ui.shadcn.com/docs/components/base/item)\n\n### Usage\n\n```tsx\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n```\n\n```tsx\n<Item>\n  <ItemMedia variant="icon">\n    <Icon />\n  </ItemMedia>\n  <ItemContent>\n    <ItemTitle>Title</ItemTitle>\n    <ItemDescription>Description</ItemDescription>\n  </ItemContent>\n  <ItemActions>\n    <Button>Action</Button>\n  </ItemActions>\n</Item>\n```\n\n### Composition\n\nUse the following composition to build an `Item`:\n\n```text\nItemGroup\n└── Item\n    ├── ItemHeader\n    ├── ItemMedia\n    ├── ItemContent\n    │   ├── ItemTitle\n    │   └── ItemDescription\n    ├── ItemActions\n    └── ItemFooter\n```\n\n### Item vs Field\n\nUse `Field` when you need form layout and validation semantics. `Item` can also lay out a settings row when its control is separately labeled. Use `ItemGroup variant="panel"` for a shared panel surface with inset dividers.',
      },
    },
  },
} satisfies Meta<typeof Item>;

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
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport BadgeCheckIcon from "@hugeicons/core-free-icons/BadgeCheckIcon";\nimport ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item";\n\nexport default function ItemDemo() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <Item variant="outline">\n        <ItemContent>\n          <ItemTitle>Basic Item</ItemTitle>\n          <ItemDescription>A simple item with title and description.</ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Action\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item\n        variant="outline"\n        size="sm"\n        render={\n          <a href="#">\n            <ItemMedia>\n              <HugeiconsIcon icon={BadgeCheckIcon} className="size-5" />\n            </ItemMedia>\n            <ItemContent>\n              <ItemTitle>Your profile has been verified.</ItemTitle>\n            </ItemContent>\n            <ItemActions>\n              <HugeiconsIcon icon={ChevronRightIcon} className="size-4" />\n            </ItemActions>\n          </a>\n        }\n      />\n    </div>\n  );\n}\n',
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
        code: 'import { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemVariant() {\n  return (\n    <div className="flex flex-col gap-6">\n      <Item>\n        <ItemContent>\n          <ItemTitle>Default Variant</ItemTitle>\n          <ItemDescription>\n            Flat styling that inherits its surrounding surface.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Open\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="outline">\n        <ItemContent>\n          <ItemTitle>Outline Variant</ItemTitle>\n          <ItemDescription>\n            Raised panel styling with a subtle edge and shadow.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Open\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="muted">\n        <ItemContent>\n          <ItemTitle>Muted Variant</ItemTitle>\n          <ItemDescription>\n            A softer panel surface for secondary content.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Open\n          </Button>\n        </ItemActions>\n      </Item>\n    </div>\n  )\n}\n',
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
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport BadgeCheckIcon from "@hugeicons/core-free-icons/BadgeCheckIcon";\nimport ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";\n\n\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemSizeDemo() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <Item variant="outline">\n        <ItemContent>\n          <ItemTitle>Basic Item</ItemTitle>\n          <ItemDescription>\n            A simple item with title and description.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button variant="outline" size="sm">\n            Action\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="outline" size="sm" render={<a href="#">\n          <ItemMedia>\n            <HugeiconsIcon icon={BadgeCheckIcon} className="size-5" />\n          </ItemMedia>\n          <ItemContent>\n            <ItemTitle>Your profile has been verified.</ItemTitle>\n          </ItemContent>\n          <ItemActions>\n            <HugeiconsIcon icon={ChevronRightIcon} className="size-4" />\n          </ItemActions>\n        </a>} />\n    </div>\n  )\n}\n',
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
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ShieldAlertIcon from "@hugeicons/core-free-icons/ShieldAlertIcon";\n\n\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemIcon() {\n  return (\n    <div className="flex w-full max-w-lg flex-col gap-6">\n      <Item variant="outline">\n        <ItemMedia variant="icon">\n          <HugeiconsIcon icon={ShieldAlertIcon} />\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle>Security Alert</ItemTitle>\n          <ItemDescription>\n            New login detected from unknown device.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button size="sm" variant="outline">\n            Review\n          </Button>\n        </ItemActions>\n      </Item>\n    </div>\n  )\n}\n',
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
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport PlusIcon from "@hugeicons/core-free-icons/PlusIcon";\n\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemAvatar() {\n  return (\n    <div className="flex w-full max-w-lg flex-col gap-6">\n      <Item variant="outline">\n        <ItemMedia>\n          <Avatar className="size-10">\n            <AvatarImage src="https://github.com/evilrabbit.png" />\n            <AvatarFallback>ER</AvatarFallback>\n          </Avatar>\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle>Evil Rabbit</ItemTitle>\n          <ItemDescription>Last seen 5 months ago</ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button\n            size="icon-sm"\n            variant="outline"\n            className="rounded-full"\n            aria-label="Invite"\n          >\n            <HugeiconsIcon icon={PlusIcon} />\n          </Button>\n        </ItemActions>\n      </Item>\n      <Item variant="outline">\n        <ItemMedia>\n          <div className="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:grayscale">\n            <Avatar className="hidden sm:flex">\n              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />\n              <AvatarFallback>CN</AvatarFallback>\n            </Avatar>\n            <Avatar className="hidden sm:flex">\n              <AvatarImage\n                src="https://github.com/maxleiter.png"\n                alt="@maxleiter"\n              />\n              <AvatarFallback>LR</AvatarFallback>\n            </Avatar>\n            <Avatar>\n              <AvatarImage\n                src="https://github.com/evilrabbit.png"\n                alt="@evilrabbit"\n              />\n              <AvatarFallback>ER</AvatarFallback>\n            </Avatar>\n          </div>\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle>No Team Members</ItemTitle>\n          <ItemDescription>\n            Invite your team to collaborate on this project.\n          </ItemDescription>\n        </ItemContent>\n        <ItemActions>\n          <Button size="sm" variant="outline">\n            Invite\n          </Button>\n        </ItemActions>\n      </Item>\n    </div>\n  )\n}\n',
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
        code: 'import * as React from "react"\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport PlusIcon from "@hugeicons/core-free-icons/PlusIcon";\n\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemGroup,\n  ItemMedia,\n  ItemSeparator,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nconst people = [\n  {\n    username: "shadcn",\n    avatar: "https://github.com/shadcn.png",\n    email: "shadcn@vercel.com",\n  },\n  {\n    username: "maxleiter",\n    avatar: "https://github.com/maxleiter.png",\n    email: "maxleiter@vercel.com",\n  },\n  {\n    username: "evilrabbit",\n    avatar: "https://github.com/evilrabbit.png",\n    email: "evilrabbit@vercel.com",\n  },\n]\n\nexport default function ItemGroupExample() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-6">\n      <ItemGroup>\n        {people.map((person, index) => (\n          <React.Fragment key={person.username}>\n            <Item>\n              <ItemMedia>\n                <Avatar>\n                  <AvatarImage src={person.avatar} className="grayscale" />\n                  <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>\n                </Avatar>\n              </ItemMedia>\n              <ItemContent className="gap-1">\n                <ItemTitle>{person.username}</ItemTitle>\n                <ItemDescription>{person.email}</ItemDescription>\n              </ItemContent>\n              <ItemActions>\n                <Button variant="ghost" size="icon" className="rounded-full">\n                  <HugeiconsIcon icon={PlusIcon} />\n                </Button>\n              </ItemActions>\n            </Item>\n            {index !== people.length - 1 && <ItemSeparator />}\n          </React.Fragment>\n        ))}\n      </ItemGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleItemGroup />
    </div>
  ),
};
export const SettingsPanel: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          'Use `ItemGroup variant="panel"` for a shared panel surface. Each `Item` supplies the row layout, while `ItemSeparator` provides inset dividers. Controls belong in `ItemActions` and need accessible labels.',
      },
    },
  },
  render: () => (
    <div className="flex min-h-dvh justify-center bg-surface-canvas p-6 text-foreground">
      <ExampleItemSettingsPanel />
    </div>
  ),
};
export const BookLibrary: Story = {
  name: "Book Library",
  parameters: {
    docs: {
      description: {
        story:
          "Compose a selectable list with `ItemGroup`, `Item`, `ItemMedia`, and Base UI checkboxes. Select individual books or use the indeterminate select-all control to explore partial and complete selection states. The group joins adjacent selected rows.",
      },
      source: {
        code: 'import { useId, useState } from "react";\nimport { Badge } from "@erbium/ui/components/badge";\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemGroup,\n  ItemMedia,\n  ItemSeparator,\n  ItemTitle,\n} from "@erbium/ui/components/item";\nimport { Label } from "@erbium/ui/components/label";\n\nconst books = [\n  {\n    id: "left-hand-of-darkness",\n    title: "The Left Hand of Darkness",\n    author: "Ursula K. Le Guin",\n    year: 1969,\n    status: "Reading",\n    badgeVariant: "info",\n    cover: "bg-sky-900 text-sky-100",\n    monogram: "LH",\n  },\n  {\n    id: "a-room-of-ones-own",\n    title: "A Room of One’s Own",\n    author: "Virginia Woolf",\n    year: 1929,\n    status: "Finished",\n    badgeVariant: "success",\n    cover: "bg-amber-800 text-amber-100",\n    monogram: "AR",\n  },\n  {\n    id: "the-dispossessed",\n    title: "The Dispossessed",\n    author: "Ursula K. Le Guin",\n    year: 1974,\n    status: "To read",\n    badgeVariant: "secondary",\n    cover: "bg-rose-900 text-rose-100",\n    monogram: "TD",\n  },\n  {\n    id: "braiding-sweetgrass",\n    title: "Braiding Sweetgrass",\n    author: "Robin Wall Kimmerer",\n    year: 2013,\n    status: "To read",\n    badgeVariant: "secondary",\n    cover: "bg-emerald-900 text-emerald-100",\n    monogram: "BS",\n  },\n] as const;\n\nexport default function ItemBookLibrary() {\n  const [selected, setSelected] = useState<string[]>([books[0].id, books[1].id]);\n  const idPrefix = useId();\n  const allSelected = selected.length === books.length;\n  const someSelected = selected.length > 0 && !allSelected;\n\n  return (\n    <section className="w-[min(42rem,90vw)] space-y-4" aria-label="Book library">\n      <div className="flex flex-wrap items-end justify-between gap-3">\n        <div>\n          <h2 className="text-base font-semibold">My library</h2>\n          <p className="text-sm text-muted-foreground">Books on your shelf</p>\n        </div>\n        <p className="text-sm text-muted-foreground" role="status">\n          {selected.length} of {books.length} selected\n        </p>\n      </div>\n\n      <div className="flex items-center gap-2 px-4">\n        <Checkbox\n          id={`${idPrefix}-all`}\n          checked={allSelected}\n          indeterminate={someSelected}\n          onCheckedChange={(checked) => setSelected(checked ? books.map((book) => book.id) : [])}\n        />\n        <Label htmlFor={`${idPrefix}-all`}>Select all books</Label>\n      </div>\n\n      <ItemGroup variant="panel" selection="joined">\n        {books.map((book, index) => {\n          const checked = selected.includes(book.id);\n          const checkboxId = `${idPrefix}-${book.id}`;\n\n          return (\n            <Item key={book.id} role="listitem" data-selected={checked} className="relative">\n              {index > 0 && (\n                <ItemSeparator className="absolute inset-x-4 top-0 mx-0! my-0! w-auto" />\n              )}\n              <Checkbox\n                id={checkboxId}\n                checked={checked}\n                aria-label={`Select ${book.title}`}\n                onCheckedChange={(nextChecked) =>\n                  setSelected((current) =>\n                    nextChecked\n                      ? [...current, book.id]\n                      : current.filter((selectedId) => selectedId !== book.id),\n                  )\n                }\n              />\n              <ItemMedia variant="image" className="h-14 w-10 rounded-sm shadow-sm">\n                <span\n                  aria-hidden="true"\n                  className={`flex size-full items-end border-s-4 border-black/20 p-1 text-[10px] font-semibold tracking-wider ${book.cover}`}\n                >\n                  {book.monogram}\n                </span>\n              </ItemMedia>\n              <ItemContent>\n                <ItemTitle>\n                  <Label htmlFor={checkboxId} className="cursor-pointer">\n                    {book.title}\n                  </Label>\n                </ItemTitle>\n                <ItemDescription>\n                  {book.author} · {book.year}\n                </ItemDescription>\n              </ItemContent>\n              <ItemActions>\n                <Badge variant={book.badgeVariant}>{book.status}</Badge>\n              </ItemActions>\n            </Item>\n          );\n        })}\n      </ItemGroup>\n    </section>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleItemBookLibrary />,
};
export const JoinedSelection: Story = {
  name: "Joined Selection",
  parameters: {
    docs: {
      description: {
        story:
          'Use `ItemGroup selection="joined"` with direct `Item` children marked `data-selected` to turn each adjacent selected run into one rounded surface. The checkboxes own selection state; the item group owns the visual grouping.',
      },
      source: {
        code: 'import CloudIcon from "@hugeicons/core-free-icons/CloudIcon";\nimport CubeIcon from "@hugeicons/core-free-icons/CubeIcon";\nimport BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";\nimport Link01Icon from "@hugeicons/core-free-icons/Link01Icon";\nimport DashboardSquare01Icon from "@hugeicons/core-free-icons/DashboardSquare01Icon";\nimport Database01Icon from "@hugeicons/core-free-icons/Database01Icon";\nimport MagicWand01Icon from "@hugeicons/core-free-icons/MagicWand01Icon";\nimport Globe02Icon from "@hugeicons/core-free-icons/Globe02Icon";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport { useId, useState } from "react";\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemGroup,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item";\nimport { Label } from "@erbium/ui/components/label";\n\nconst projects = [\n  { id: "gateway", name: "Cloud gateway", icon: CloudIcon, color: "text-orange-500", issues: 30 },\n  { id: "reader", name: "Read platform", icon: CubeIcon, color: "text-blue-500", issues: 13 },\n  {\n    id: "knowledge",\n    name: "Knowledge hub",\n    icon: BookOpen01Icon,\n    color: "text-red-500",\n    issues: 9,\n  },\n  {\n    id: "integrations",\n    name: "Integrations",\n    icon: Link01Icon,\n    color: "text-purple-500",\n    issues: 27,\n  },\n  {\n    id: "admin",\n    name: "Admin panel",\n    icon: DashboardSquare01Icon,\n    color: "text-rose-500",\n    issues: 27,\n  },\n  { id: "data", name: "Data layer", icon: Database01Icon, color: "text-cyan-500", issues: 29 },\n  {\n    id: "generate",\n    name: "Generate",\n    icon: MagicWand01Icon,\n    color: "text-emerald-500",\n    issues: 15,\n  },\n  { id: "website", name: "Website", icon: Globe02Icon, color: "text-sky-500", issues: 15 },\n] as const;\n\nexport default function ItemJoinedSelection() {\n  const [selected, setSelected] = useState<string[]>([\n    "gateway",\n    "reader",\n    "integrations",\n    "admin",\n    "generate",\n    "website",\n  ]);\n  const idPrefix = useId();\n\n  return (\n    <section className="w-[min(48rem,92vw)]" aria-label="Projects">\n      <div className="flex justify-between px-3 pb-2 text-xs text-muted-foreground">\n        <span>Name</span>\n        <span>Issues</span>\n      </div>\n      <ItemGroup selection="joined">\n        {projects.map((project) => {\n          const checkboxId = `${idPrefix}-${project.id}`;\n\n          return (\n            <Item\n              key={project.id}\n              role="listitem"\n              size="sm"\n              data-selected={selected.includes(project.id)}\n              className="min-h-12"\n            >\n              <Checkbox\n                id={checkboxId}\n                checked={selected.includes(project.id)}\n                aria-label={`Select ${project.name}`}\n                onCheckedChange={(checked) =>\n                  setSelected((current) =>\n                    checked\n                      ? [...current, project.id]\n                      : current.filter((selectedId) => selectedId !== project.id),\n                  )\n                }\n              />\n              <ItemMedia variant="icon">\n                <HugeiconsIcon\n                  icon={project.icon}\n                  className={`size-4 ${project.color}`}\n                  aria-hidden="true"\n                />\n              </ItemMedia>\n              <ItemContent>\n                <ItemTitle>\n                  <Label htmlFor={checkboxId} className="cursor-pointer">\n                    {project.name}\n                  </Label>\n                </ItemTitle>\n              </ItemContent>\n              <ItemActions>\n                <span className="tabular-nums text-muted-foreground">{project.issues}</span>\n              </ItemActions>\n            </Item>\n          );\n        })}\n      </ItemGroup>\n    </section>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleItemJoinedSelection />,
};
export const Link: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `render` prop to render the item as a link. The hover and focus states will be applied to the anchor element.\n\n```tsx\n<Item render={<a href="/dashboard" />}>\n  <ItemMedia variant="icon">\n    <HomeIcon />\n  </ItemMedia>\n  <ItemContent>\n    <ItemTitle>Dashboard</ItemTitle>\n    <ItemDescription>Overview of your account and activity.</ItemDescription>\n  </ItemContent>\n</Item>\n```',
      },

      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";\nimport ExternalLinkIcon from "@hugeicons/core-free-icons/ExternalLinkIcon";\n\n\nimport {\n  Item,\n  ItemActions,\n  ItemContent,\n  ItemDescription,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nexport default function ItemLink() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-4">\n      <Item render={<a href="#">\n          <ItemContent>\n            <ItemTitle>Visit our documentation</ItemTitle>\n            <ItemDescription>\n              Learn how to get started with our components.\n            </ItemDescription>\n          </ItemContent>\n          <ItemActions>\n            <HugeiconsIcon icon={ChevronRightIcon} className="size-4" />\n          </ItemActions>\n        </a>} />\n      <Item variant="outline" render={<a href="#" target="_blank" rel="noopener noreferrer">\n          <ItemContent>\n            <ItemTitle>External resource</ItemTitle>\n            <ItemDescription>\n              Opens in a new tab with security attributes.\n            </ItemDescription>\n          </ItemContent>\n          <ItemActions>\n            <HugeiconsIcon icon={ExternalLinkIcon} className="size-4" />\n          </ItemActions>\n        </a>} />\n    </div>\n  )\n}\n',
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
        code: '\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";\n\n\nimport {\n  Avatar,\n  AvatarFallback,\n  AvatarImage,\n} from "@erbium/ui/components/avatar"\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\nimport {\n  Item,\n  ItemContent,\n  ItemDescription,\n  ItemMedia,\n  ItemTitle,\n} from "@erbium/ui/components/item"\n\nconst people = [\n  {\n    username: "shadcn",\n    avatar: "https://github.com/shadcn.png",\n    email: "shadcn@vercel.com",\n  },\n  {\n    username: "maxleiter",\n    avatar: "https://github.com/maxleiter.png",\n    email: "maxleiter@vercel.com",\n  },\n  {\n    username: "evilrabbit",\n    avatar: "https://github.com/evilrabbit.png",\n    email: "evilrabbit@vercel.com",\n  },\n]\n\nexport default function ItemDropdown() {\n  return (\n    <div className="flex min-h-64 w-full max-w-md flex-col items-center gap-6">\n      <DropdownMenu>\n        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="w-fit">\n            Select <HugeiconsIcon icon={ChevronDownIcon} />\n          </Button>} />\n        <DropdownMenuContent className="w-72 [--radius:0.65rem]" align="end">\n          {people.map((person) => (\n            <DropdownMenuItem key={person.username} className="p-0">\n              <Item size="sm" className="w-full p-2">\n                <ItemMedia>\n                  <Avatar className="size-8">\n                    <AvatarImage src={person.avatar} className="grayscale" />\n                    <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>\n                  </Avatar>\n                </ItemMedia>\n                <ItemContent className="gap-0.5">\n                  <ItemTitle>{person.username}</ItemTitle>\n                  <ItemDescription>{person.email}</ItemDescription>\n                </ItemContent>\n              </Item>\n            </DropdownMenuItem>\n          ))}\n        </DropdownMenuContent>\n      </DropdownMenu>\n    </div>\n  )\n}\n',
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
