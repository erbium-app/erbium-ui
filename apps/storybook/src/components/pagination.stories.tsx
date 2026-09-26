import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "@erbium/ui/components/pagination";
import Demo from "./examples/pagination-demo";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Pagination with page navigation, next and previous links.\n\n**Import:** `@erbium/ui/components/pagination`  \n\n**shadcn/ui page:** [Pagination](https://ui.shadcn.com/docs/components/base/pagination)\n\n### Usage\n\n```tsx\nimport {\n  Pagination,\n  PaginationContent,\n  PaginationEllipsis,\n  PaginationItem,\n  PaginationLink,\n  PaginationNext,\n  PaginationPrevious,\n} from "@erbium/ui/components/pagination"\n```\n\n```tsx\n<Pagination>\n  <PaginationContent>\n    <PaginationItem>\n      <PaginationPrevious href="#" />\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationLink href="#">1</PaginationLink>\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationLink href="#" isActive>\n        2\n      </PaginationLink>\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationLink href="#">3</PaginationLink>\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationEllipsis />\n    </PaginationItem>\n    <PaginationItem>\n      <PaginationNext href="#" />\n    </PaginationItem>\n  </PaginationContent>\n</Pagination>\n```\n\n### Composition\n\nUse the following composition to build a `Pagination`:\n\n```text\nPagination\n└── PaginationContent\n    ├── PaginationItem\n    │   └── PaginationPrevious\n    ├── PaginationItem\n    │   └── PaginationLink\n    ├── PaginationItem\n    │   └── PaginationEllipsis\n    └── PaginationItem\n        └── PaginationNext\n```\n\n### Simple\n\nA simple pagination with only page numbers.\n\n### Icons Only\n\nUse just the previous and next buttons without page numbers. This is useful for data tables with a rows per page selector.\n\n### Next.js\n\nBy default the `<PaginationLink />` component will render an `<a />` tag.\n\nTo use the Next.js `<Link />` component, make the following updates to `pagination.tsx`.\n\n**Note:** We are making updates to the cli to automatically do this for you.\n\n### Changelog\n\nIf you\'re upgrading from a previous version of the `Pagination` component, you\'ll need to apply the following updates to add the `text` prop:',
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
