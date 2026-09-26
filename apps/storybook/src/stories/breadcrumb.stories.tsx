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
          'Displays the path to the current resource using a hierarchy of links.\n\n**Import:** `@erbium/ui/components/breadcrumb`  \n\n**shadcn/ui page:** [Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb)\n\n### Usage\n\n```tsx\nimport {\n  Breadcrumb,\n  BreadcrumbItem,\n  BreadcrumbLink,\n  BreadcrumbList,\n  BreadcrumbPage,\n  BreadcrumbSeparator,\n} from "@erbium/ui/components/breadcrumb"\n```\n\n```tsx\n<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem>\n      <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>\n    </BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem>\n      <BreadcrumbLink render={<a href="/components" />}>\n        Components\n      </BreadcrumbLink>\n    </BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem>\n      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>\n    </BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>\n```\n\n### Composition\n\nUse the following composition to build a `Breadcrumb`:\n\n```text\nBreadcrumb\n└── BreadcrumbList\n    ├── BreadcrumbItem\n    │   └── BreadcrumbLink\n    ├── BreadcrumbSeparator\n    ├── BreadcrumbItem\n    │   └── BreadcrumbLink\n    ├── BreadcrumbSeparator\n    └── BreadcrumbItem\n        └── BreadcrumbPage\n```\n\n### Basic\n\nA basic breadcrumb with a home link and a components link.\n\n### Custom separator\n\nUse a custom component as `children` for `<BreadcrumbSeparator />` to create a custom separator.\n\n### Dropdown\n\nYou can compose `<BreadcrumbItem />` with a `<DropdownMenu />` to create a dropdown in the breadcrumb.\n\n### Collapsed\n\nWe provide a `<BreadcrumbEllipsis />` component to show a collapsed state when the breadcrumb is too long.\n\nstyleName="base-nova"\n\nname="breadcrumb-ellipsis"\n\npreviewClassName="p-2"\n\n/>\n\n### Link component\n\nTo use a custom link component from your routing library, you can use the `render` prop on `<BreadcrumbLink />`.',
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
