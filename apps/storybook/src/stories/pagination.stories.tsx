import { PaginationSimple } from "../examples/upstream/pagination-simple";
import { PaginationIconsOnly } from "../examples/upstream/pagination-icons-only";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Pagination } from "@erbium/ui/components/pagination";
import Demo from "../examples/pagination-demo";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Pagination with page navigation, next and previous links.\n\n**Import:** `@erbium/ui/components/pagination`  \n\n**shadcn/ui page:** [Pagination](https://ui.shadcn.com/docs/components/base/pagination)\n\n### Usage\n\n```tsx\nimport {\n  Pagination,\n  PaginationContent,\n  PaginationEllipsis,\n  PaginationItem,\n  PaginationLink,\n  PaginationNext,\n  PaginationPrevious,\n} from "@erbium/ui/components/pagination"\n```\n\n```tsx\n<Pagination>\n  <PaginationContent>\n    <PaginationItem>\n      <PaginationPrevious href="#" />\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationLink href="#">1</PaginationLink>\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationLink href="#" isActive>\n        2\n      </PaginationLink>\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationLink href="#">3</PaginationLink>\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationEllipsis />\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationNext href="#" />\n    </PaginationItem>\n  </PaginationContent>\n</Pagination>\n```\n\n### Composition\n\nUse the following composition to build a `Pagination`:\n\n```text\nPagination\n└── PaginationContent\n    ├── PaginationItem\n    │   └── PaginationPrevious\n    ├── PaginationItem\n    │   └── PaginationLink\n    ├── PaginationItem\n    │   └── PaginationEllipsis\n    └── PaginationItem\n        └── PaginationNext\n```\n\n### Next.js\n\nBy default the `<PaginationLink />` component will render an `<a />` tag.\n\nTo use the Next.js `<Link />` component, make the following updates to `pagination.tsx`.\n\n**Note:** We are making updates to the cli to automatically do this for you.\n\n### Changelog\n\nIf you\'re upgrading from a previous version of the `Pagination` component, you\'ll need to apply the following updates to add the `text` prop:',
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
        code: 'import {\n  Pagination,\n  PaginationContent,\n  PaginationEllipsis,\n  PaginationItem,\n  PaginationLink,\n  PaginationNext,\n  PaginationPrevious,\n} from "@erbium/ui/components/pagination";\n\nexport default function PaginationDemo() {\n  return (\n    <Pagination>\n      <PaginationContent>\n        <PaginationItem>\n          <PaginationPrevious href="#" />\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#">1</PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#" isActive>\n            2\n          </PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#">3</PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationEllipsis />\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationNext href="#" />\n        </PaginationItem>\n      </PaginationContent>\n    </Pagination>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Simple: Story = {
  parameters: {
    docs: {
      description: { story: "A simple pagination with only page numbers." },
      source: {
        code: 'import {\n  Pagination,\n  PaginationContent,\n  PaginationItem,\n  PaginationLink,\n} from "@erbium/ui/components/pagination";\n\nexport function PaginationSimple() {\n  return (\n    <Pagination>\n      <PaginationContent>\n        <PaginationItem>\n          <PaginationLink href="#">1</PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#" isActive>\n            2\n          </PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#">3</PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#">4</PaginationLink>\n        </PaginationItem>\n        <PaginationItem>\n          <PaginationLink href="#">5</PaginationLink>\n        </PaginationItem>\n      </PaginationContent>\n    </Pagination>\n  );\n}\n',
      },
    },
  },
  render: () => <PaginationSimple />,
};
export const IconsOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use just the previous and next buttons without page numbers. This is useful for data tables with a rows per page selector.",
      },
      source: {
        code: 'import { Field, FieldLabel } from "@erbium/ui/components/field";\nimport {\n  Pagination,\n  PaginationContent,\n  PaginationItem,\n  PaginationNext,\n  PaginationPrevious,\n} from "@erbium/ui/components/pagination";\nimport {\n  Select,\n  SelectContent,\n  SelectGroup,\n  SelectItem,\n  SelectTrigger,\n  SelectValue,\n} from "@erbium/ui/components/select";\n\nexport function PaginationIconsOnly() {\n  return (\n    <div className="flex items-center justify-between gap-4">\n      <Field orientation="horizontal" className="w-fit">\n        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>\n        <Select defaultValue="25">\n          <SelectTrigger className="w-20" id="select-rows-per-page">\n            <SelectValue />\n          </SelectTrigger>\n          <SelectContent align="start">\n            <SelectGroup>\n              <SelectItem value="10">10</SelectItem>\n              <SelectItem value="25">25</SelectItem>\n              <SelectItem value="50">50</SelectItem>\n              <SelectItem value="100">100</SelectItem>\n            </SelectGroup>\n          </SelectContent>\n        </Select>\n      </Field>\n      <Pagination className="mx-0 w-auto">\n        <PaginationContent>\n          <PaginationItem>\n            <PaginationPrevious href="#" />\n          </PaginationItem>\n          <PaginationItem>\n            <PaginationNext href="#" />\n          </PaginationItem>\n        </PaginationContent>\n      </Pagination>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <PaginationIconsOnly />,
};
