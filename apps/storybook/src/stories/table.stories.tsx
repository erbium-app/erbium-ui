import { TableFooterExample } from "../examples/upstream/table-footer";
import { TableActions } from "../examples/upstream/table-actions";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Table } from "@erbium/ui/components/table";
import Demo from "../examples/table-demo";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A responsive table component.\n\n**Import:** `@erbium/ui/components/table`  \n\n**shadcn/ui page:** [Table](https://ui.shadcn.com/docs/components/base/table)\n\n### Usage\n\n```tsx\nimport {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table"\n```\n\n```tsx\n<Table>\n  <TableCaption>A list of your recent invoices.</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead className="w-[100px]">Invoice</TableHead>\n      <TableHead>Status</TableHead>\n      <TableHead>Method</TableHead>\n      <TableHead className="text-right">Amount</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell className="font-medium">INV001</TableCell>\n      <TableCell>Paid</TableCell>\n      <TableCell>Credit Card</TableCell>\n      <TableCell className="text-right">$250.00</TableCell>\n    </TableRow>\n  </TableBody>\n</Table>\n```\n\n### Composition\n\nUse the following composition to build a `Table`:\n\n```text\nTable\n├── TableCaption\n├── TableHeader\n│   └── TableRow\n│       ├── TableHead\n│       ├── TableHead\n│       ├── TableHead\n│       └── TableHead\n├── TableBody\n│   ├── TableRow\n│   │   ├── TableCell\n│   │   ├── TableCell\n│   │   ├── TableCell\n│   │   └── TableCell\n│   └── TableRow\n│       ├── TableCell\n│       ├── TableCell\n│       ├── TableCell\n│       └── TableCell\n└── TableFooter\n```\n\n### Data Table\n\nYou can use the `<Table />` component to build more complex data tables. Combine it with [@tanstack/react-table](https://tanstack.com/table/latest) to create tables with sorting, filtering and pagination.\n\nSee the [Data Table](https://ui.shadcn.com/docs/components/data-table) documentation for more information.\n\nYou can also see an example of a data table in the [Tasks](/examples/tasks) demo.',
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
        code: 'import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableFooter,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\n\nconst invoices = [\n  {\n    invoice: "INV001",\n    paymentStatus: "Paid",\n    totalAmount: "$250.00",\n    paymentMethod: "Credit Card",\n  },\n  {\n    invoice: "INV002",\n    paymentStatus: "Pending",\n    totalAmount: "$150.00",\n    paymentMethod: "PayPal",\n  },\n  {\n    invoice: "INV003",\n    paymentStatus: "Unpaid",\n    totalAmount: "$350.00",\n    paymentMethod: "Bank Transfer",\n  },\n  {\n    invoice: "INV004",\n    paymentStatus: "Paid",\n    totalAmount: "$450.00",\n    paymentMethod: "Credit Card",\n  },\n  {\n    invoice: "INV005",\n    paymentStatus: "Paid",\n    totalAmount: "$550.00",\n    paymentMethod: "PayPal",\n  },\n  {\n    invoice: "INV006",\n    paymentStatus: "Pending",\n    totalAmount: "$200.00",\n    paymentMethod: "Bank Transfer",\n  },\n  {\n    invoice: "INV007",\n    paymentStatus: "Unpaid",\n    totalAmount: "$300.00",\n    paymentMethod: "Credit Card",\n  },\n];\n\nexport default function TableDemo() {\n  return (\n    <Table>\n      <TableCaption>A list of your recent invoices.</TableCaption>\n      <TableHeader>\n        <TableRow>\n          <TableHead className="w-[100px]">Invoice</TableHead>\n          <TableHead>Status</TableHead>\n          <TableHead>Method</TableHead>\n          <TableHead className="text-right">Amount</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        {invoices.map((invoice) => (\n          <TableRow key={invoice.invoice}>\n            <TableCell className="font-medium">{invoice.invoice}</TableCell>\n            <TableCell>{invoice.paymentStatus}</TableCell>\n            <TableCell>{invoice.paymentMethod}</TableCell>\n            <TableCell className="text-right">{invoice.totalAmount}</TableCell>\n          </TableRow>\n        ))}\n      </TableBody>\n      <TableFooter>\n        <TableRow>\n          <TableCell colSpan={3}>Total</TableCell>\n          <TableCell className="text-right">$2,500.00</TableCell>\n        </TableRow>\n      </TableFooter>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Footer: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `<TableFooter />` component to add a footer to the table." },
      source: {
        code: 'import {\n  Table,\n  TableBody,\n  TableCaption,\n  TableCell,\n  TableFooter,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\n\nconst invoices = [\n  {\n    invoice: "INV001",\n    paymentStatus: "Paid",\n    totalAmount: "$250.00",\n    paymentMethod: "Credit Card",\n  },\n  {\n    invoice: "INV002",\n    paymentStatus: "Pending",\n    totalAmount: "$150.00",\n    paymentMethod: "PayPal",\n  },\n  {\n    invoice: "INV003",\n    paymentStatus: "Unpaid",\n    totalAmount: "$350.00",\n    paymentMethod: "Bank Transfer",\n  },\n  {\n    invoice: "INV004",\n    paymentStatus: "Paid",\n    totalAmount: "$450.00",\n    paymentMethod: "Credit Card",\n  },\n  {\n    invoice: "INV005",\n    paymentStatus: "Paid",\n    totalAmount: "$550.00",\n    paymentMethod: "PayPal",\n  },\n  {\n    invoice: "INV006",\n    paymentStatus: "Pending",\n    totalAmount: "$200.00",\n    paymentMethod: "Bank Transfer",\n  },\n  {\n    invoice: "INV007",\n    paymentStatus: "Unpaid",\n    totalAmount: "$300.00",\n    paymentMethod: "Credit Card",\n  },\n];\n\nexport function TableFooterExample() {\n  return (\n    <Table>\n      <TableCaption>A list of your recent invoices.</TableCaption>\n      <TableHeader>\n        <TableRow>\n          <TableHead className="w-[100px]">Invoice</TableHead>\n          <TableHead>Status</TableHead>\n          <TableHead>Method</TableHead>\n          <TableHead className="text-right">Amount</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        {invoices.slice(0, 3).map((invoice) => (\n          <TableRow key={invoice.invoice}>\n            <TableCell className="font-medium">{invoice.invoice}</TableCell>\n            <TableCell>{invoice.paymentStatus}</TableCell>\n            <TableCell>{invoice.paymentMethod}</TableCell>\n            <TableCell className="text-right">{invoice.totalAmount}</TableCell>\n          </TableRow>\n        ))}\n      </TableBody>\n      <TableFooter>\n        <TableRow>\n          <TableCell colSpan={3}>Total</TableCell>\n          <TableCell className="text-right">$2,500.00</TableCell>\n        </TableRow>\n      </TableFooter>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => <TableFooterExample />,
};
export const Actions: Story = {
  parameters: {
    docs: {
      description: {
        story: "A table showing actions for each row using a `<DropdownMenu />` component.",
      },
      source: {
        code: 'import { MoreHorizontalIcon } from "lucide-react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\nimport {\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\n\nexport function TableActions() {\n  return (\n    <Table>\n      <TableHeader>\n        <TableRow>\n          <TableHead>Product</TableHead>\n          <TableHead>Price</TableHead>\n          <TableHead className="text-right">Actions</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        <TableRow>\n          <TableCell className="font-medium">Wireless Mouse</TableCell>\n          <TableCell>$29.99</TableCell>\n          <TableCell className="text-right">\n            <DropdownMenu>\n              <DropdownMenuTrigger\n                render={<Button variant="ghost" size="icon" className="size-8" />}\n              >\n                <MoreHorizontalIcon />\n                <span className="sr-only">Open menu</span>\n              </DropdownMenuTrigger>\n              <DropdownMenuContent align="end">\n                <DropdownMenuItem>Edit</DropdownMenuItem>\n                <DropdownMenuItem>Duplicate</DropdownMenuItem>\n                <DropdownMenuSeparator />\n                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>\n              </DropdownMenuContent>\n            </DropdownMenu>\n          </TableCell>\n        </TableRow>\n        <TableRow>\n          <TableCell className="font-medium">Mechanical Keyboard</TableCell>\n          <TableCell>$129.99</TableCell>\n          <TableCell className="text-right">\n            <DropdownMenu>\n              <DropdownMenuTrigger\n                render={<Button variant="ghost" size="icon" className="size-8" />}\n              >\n                <MoreHorizontalIcon />\n                <span className="sr-only">Open menu</span>\n              </DropdownMenuTrigger>\n              <DropdownMenuContent align="end">\n                <DropdownMenuItem>Edit</DropdownMenuItem>\n                <DropdownMenuItem>Duplicate</DropdownMenuItem>\n                <DropdownMenuSeparator />\n                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>\n              </DropdownMenuContent>\n            </DropdownMenu>\n          </TableCell>\n        </TableRow>\n        <TableRow>\n          <TableCell className="font-medium">USB-C Hub</TableCell>\n          <TableCell>$49.99</TableCell>\n          <TableCell className="text-right">\n            <DropdownMenu>\n              <DropdownMenuTrigger\n                render={<Button variant="ghost" size="icon" className="size-8" />}\n              >\n                <MoreHorizontalIcon />\n                <span className="sr-only">Open menu</span>\n              </DropdownMenuTrigger>\n              <DropdownMenuContent align="end">\n                <DropdownMenuItem>Edit</DropdownMenuItem>\n                <DropdownMenuItem>Duplicate</DropdownMenuItem>\n                <DropdownMenuSeparator />\n                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>\n              </DropdownMenuContent>\n            </DropdownMenu>\n          </TableCell>\n        </TableRow>\n      </TableBody>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => <TableActions />,
};
