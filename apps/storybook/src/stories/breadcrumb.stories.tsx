import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@erbium/ui/components/breadcrumb";
import { BreadcrumbLinkDemo } from "../examples/upstream/breadcrumb-link";
import { BreadcrumbSeparatorDemo } from "../examples/upstream/breadcrumb-separator";
import { BreadcrumbDropdown } from "../examples/upstream/breadcrumb-dropdown";
import { BreadcrumbBasic } from "../examples/upstream/breadcrumb-basic";
import { BreadcrumbEllipsisDemo } from "../examples/upstream/breadcrumb-ellipsis";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Breadcrumb } from "@erbium/ui/components/breadcrumb";
import Demo from "../examples/breadcrumb-demo";

const meta = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays the path to the current resource using a hierarchy of links.\n\n**Import:** `@erbium/ui/components/breadcrumb`  \n\n**shadcn/ui page:** [Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb)\n\n### Usage\n\n```tsx\nimport {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb"\n```\n\n```tsx\n<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem>\n      <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>\n    </BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem>\n      <BreadcrumbLink render={<a href="/components" />}>\n        Components\n      </BreadcrumbLink>\n    </BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem>\n      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n    </BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>\n```\n\n### Composition\n\nUse the following composition to build a `Breadcrumb`:\n\n```text\nBreadcrumb\n└── BreadcrumbList\n    ├── BreadcrumbItem\n    │   └── BreadcrumbLink\n    ├── BreadcrumbSeparator\n    ├── BreadcrumbItem\n    │   └── BreadcrumbLink\n    ├── BreadcrumbSeparator\n    └── BreadcrumbItem\n        └── BreadcrumbPage\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{ separator: string; currentPage: string }> = {
  args: { separator: "/", currentPage: "Current page" },
  argTypes: { separator: { control: "text" }, currentPage: { control: "text" } },
  render: (args) => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{args.separator}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{args.currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb";\nexport default function Demo() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink href="/">Home</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbPage>Components</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Ellipsis: Story = {
  name: "Collapsed",
  parameters: {
    docs: {
      description: {
        story:
          "We provide a `<BreadcrumbEllipsis />` component to show a collapsed state when the breadcrumb is too long.",
      },
      source: {
        code: 'import {\n  Breadcrumb,\n  BreadcrumbEllipsis,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb";\n\nexport function BreadcrumbEllipsisDemo() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbEllipsis />\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="/docs/components" />}>Components</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  );\n}\n',
      },
    },
  },
  render: () => <BreadcrumbEllipsisDemo />,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A basic breadcrumb with a home link and a components link." },
      source: {
        code: 'import {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb";\n\nexport function BreadcrumbBasic() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink href="#">Home</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbLink href="#">Components</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  );\n}\n',
      },
    },
  },
  render: () => <BreadcrumbBasic />,
};

export const Dropdown: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can compose `<BreadcrumbItem />` with a `<DropdownMenu />` to create a dropdown in the breadcrumb.",
      },
      source: {
        code: 'import { ChevronDownIcon, DotIcon } from "lucide-react";\n\nimport {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function BreadcrumbDropdown() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator>\n          <DotIcon />\n        </BreadcrumbSeparator>\n        <BreadcrumbItem>\n          <DropdownMenu>\n            <DropdownMenuTrigger render={<button className="flex items-center gap-1" />}>\n              Components\n              <ChevronDownIcon data-icon="inline-end" className="size-3.5" />\n            </DropdownMenuTrigger>\n            <DropdownMenuContent align="start">\n              <DropdownMenuGroup>\n                <DropdownMenuItem>Documentation</DropdownMenuItem>\n                <DropdownMenuItem>Themes</DropdownMenuItem>\n                <DropdownMenuItem>GitHub</DropdownMenuItem>\n              </DropdownMenuGroup>\n            </DropdownMenuContent>\n          </DropdownMenu>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator>\n          <DotIcon />\n        </BreadcrumbSeparator>\n        <BreadcrumbItem>\n          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  );\n}\n',
      },
    },
  },
  render: () => <BreadcrumbDropdown />,
};

export const CustomSeparator: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use a custom component as `children` for `<BreadcrumbSeparator />` to create a custom separator.",
      },
      source: {
        code: 'import { DotIcon } from "lucide-react";\n\nimport {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb";\n\nexport function BreadcrumbSeparatorDemo() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator>\n          <DotIcon />\n        </BreadcrumbSeparator>\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="/components" />}>Components</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator>\n          <DotIcon />\n        </BreadcrumbSeparator>\n        <BreadcrumbItem>\n          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  );\n}\n',
      },
    },
  },
  render: () => <BreadcrumbSeparatorDemo />,
};

export const LinkComponent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "To use a custom link component from your routing library, you can use the `render` prop on `<BreadcrumbLink />`.",
      },
      source: {
        code: 'import {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb";\n\nexport function BreadcrumbLinkDemo() {\n  return (\n    <Breadcrumb>\n      <BreadcrumbList>\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="#link-component" />}>Home</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbLink render={<a href="#link-component" />}>Components</BreadcrumbLink>\n        </BreadcrumbItem>\n        <BreadcrumbSeparator />\n        <BreadcrumbItem>\n          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n        </BreadcrumbItem>\n      </BreadcrumbList>\n    </Breadcrumb>\n  );\n}\n',
      },
    },
  },
  render: () => <BreadcrumbLinkDemo />,
};
