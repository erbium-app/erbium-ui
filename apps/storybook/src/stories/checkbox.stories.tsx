import { CheckboxInvalid } from "../examples/upstream/checkbox-invalid";
import { CheckboxBasic } from "../examples/upstream/checkbox-basic";
import { CheckboxDescription } from "../examples/upstream/checkbox-description";
import { CheckboxGroup } from "../examples/upstream/checkbox-group";
import { CheckboxInTable } from "../examples/upstream/checkbox-table";
import ExampleCheckboxControlled from "../examples/checkbox-controlled";
import ExampleCheckboxDisabled from "../examples/checkbox-disabled";
import ExampleCheckboxForm from "../examples/checkbox-form";
import ExampleCheckboxIndeterminate from "../examples/checkbox-indeterminate";
import ExampleCheckboxReadOnly from "../examples/checkbox-read-only";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@erbium/ui/components/checkbox";
import { Label } from "@erbium/ui/components/label";
import Demo from "../examples/checkbox-demo";

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A control that allows the user to toggle between checked and not checked.\n\n**Import:** `@erbium/ui/components/checkbox`  \n\n**shadcn/ui page:** [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox)\n\n### Usage\n\n```tsx\nimport { Checkbox } from "@erbium/ui/components/checkbox"\n```\n\n```tsx\n<Checkbox />\n```',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Checkbox> = {
  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {
    defaultChecked: { control: "boolean", description: "Initial checked state (uncontrolled)." },
    indeterminate: { control: "boolean", description: "Mixed state; shows a minus icon." },
    disabled: { control: "boolean", description: "Ignores interaction and dims the control." },
    readOnly: { control: "boolean", description: "Focusable, but the state cannot change." },
    required: { control: "boolean", description: "Must be checked before the form submits." },
    onCheckedChange: { action: "onCheckedChange" },
  },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox key={String(args.defaultChecked)} {...args} id="playground-checkbox" />
      <Label htmlFor="playground-checkbox">Accept terms</Label>
    </div>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxDemo() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-3">\n        <Checkbox id="terms" />\n        <Label htmlFor="terms">Accept terms and conditions</Label>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="terms-2" defaultChecked />\n        <div className="grid gap-2">\n          <Label htmlFor="terms-2">Accept terms and conditions</Label>\n          <p className="text-sm text-muted-foreground">\n            By clicking this checkbox, you agree to the terms and conditions.\n          </p>\n        </div>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="toggle" disabled />\n        <Label htmlFor="toggle">Enable notifications</Label>\n      </div>\n      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">\n        <Checkbox\n          id="toggle-2"\n          defaultChecked\n          className="data-checked:border-blue-600 data-checked:bg-blue-600 data-checked:text-white dark:data-checked:border-blue-700 dark:data-checked:bg-blue-700"\n        />\n        <div className="grid gap-1.5 font-normal">\n          <p className="text-sm leading-none font-medium">Enable notifications</p>\n          <p className="text-sm text-muted-foreground">\n            You can enable or disable notifications at any time.\n          </p>\n        </div>\n      </Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Checked: Story = {
  name: "Checked State",
  parameters: {
    docs: {
      description: {
        story: "Use `defaultChecked` for an uncontrolled checkbox that starts ticked.",
      },
    },
  },
  render: () => <Checkbox defaultChecked aria-label="Selected" />,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pass `checked` and `onCheckedChange` to own the state. The handler receives `(checked, eventDetails)`; call `eventDetails.cancel()` to reject a change in uncontrolled mode.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\nimport { useState } from "react";\n\nexport default function CheckboxControlled() {\n  const [checked, setChecked] = useState(false);\n\n  return (\n    <div className="flex flex-col gap-4">\n      <div className="flex items-center gap-2">\n        <Checkbox id="controlled-marketing" checked={checked} onCheckedChange={setChecked} />\n        <Label htmlFor="controlled-marketing">Receive marketing emails</Label>\n      </div>\n      <p className="text-sm text-muted-foreground">\n        checked: <code>{String(checked)}</code>\n      </p>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleCheckboxControlled />,
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `indeterminate` for a mixed state, such as a parent that controls a list. It renders a minus icon, sets `aria-checked="mixed"`, and exposes `data-indeterminate` for styling.',
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\nimport { useState } from "react";\n\nconst permissions = [\n  { id: "read", label: "Read" },\n  { id: "write", label: "Write" },\n  { id: "delete", label: "Delete" },\n];\n\nexport default function CheckboxIndeterminate() {\n  const [selected, setSelected] = useState<string[]>(["read"]);\n\n  const allSelected = selected.length === permissions.length;\n  const someSelected = selected.length > 0 && !allSelected;\n\n  return (\n    <div className="flex flex-col gap-3">\n      <div className="flex items-center gap-2">\n        <Checkbox\n          id="permissions-all"\n          checked={allSelected}\n          indeterminate={someSelected}\n          onCheckedChange={(checked) =>\n            setSelected(checked ? permissions.map((permission) => permission.id) : [])\n          }\n        />\n        <Label htmlFor="permissions-all">All permissions</Label>\n      </div>\n      <div className="flex flex-col gap-3 ps-6">\n        {permissions.map((permission) => (\n          <div className="flex items-center gap-2" key={permission.id}>\n            <Checkbox\n              id={`permissions-${permission.id}`}\n              checked={selected.includes(permission.id)}\n              onCheckedChange={(checked) =>\n                setSelected((current) =>\n                  checked\n                    ? [...current, permission.id]\n                    : current.filter((id) => id !== permission.id),\n                )\n              }\n            />\n            <Label className="font-normal" htmlFor={`permissions-${permission.id}`}>\n              {permission.label}\n            </Label>\n          </div>\n        ))}\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleCheckboxIndeterminate />,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `readOnly` to show a value the user cannot change. It stays focusable and announced, unlike `disabled`, and exposes `data-readonly`.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxReadOnly() {\n  return (\n    <div className="flex items-center gap-2">\n      <Checkbox id="read-only-plan" readOnly defaultChecked />\n      <Label htmlFor="read-only-plan">Included in your plan</Label>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleCheckboxReadOnly />,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A hidden input submits with the form. `name` sets the key, `value` the checked value (defaults to `"on"`), and `uncheckedValue` what an unticked box submits. `required` blocks submission until checked; use `form` to associate a checkbox rendered outside its form.',
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\nimport { useState } from "react";\n\nexport default function CheckboxForm() {\n  const [submitted, setSubmitted] = useState<string>();\n\n  return (\n    <form\n      className="flex w-72 flex-col gap-4"\n      onSubmit={(event) => {\n        event.preventDefault();\n        const data = Object.fromEntries(new FormData(event.currentTarget));\n        setSubmitted(JSON.stringify(data, null, 2));\n      }}\n    >\n      <div className="flex items-center gap-2">\n        <Checkbox id="form-terms" name="terms" required />\n        <Label htmlFor="form-terms">Accept terms (required)</Label>\n      </div>\n      <div className="flex items-center gap-2">\n        <Checkbox id="form-newsletter" name="newsletter" value="weekly" uncheckedValue="none" />\n        <Label htmlFor="form-newsletter">Weekly newsletter</Label>\n      </div>\n      <Button className="self-start" type="submit">\n        Submit\n      </Button>\n      {submitted ? <pre className="rounded-md bg-muted p-3 text-xs">{submitted}</pre> : null}\n    </form>\n  );\n}\n',
      },
    },
  },
  render: () => <ExampleCheckboxForm />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `disabled` prop to prevent interaction. The checkbox and a sibling `Label` dim through `data-disabled`; inside a `<Field>`, add `data-disabled` to the field for disabled styles.",
      },

      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxDisabled() {\n  return (\n    <div className="flex flex-col gap-4">\n      <div className="flex items-center gap-2">\n        <Checkbox id="disabled-unchecked" disabled />\n        <Label htmlFor="disabled-unchecked">Accept terms and conditions</Label>\n      </div>\n      <div className="flex items-center gap-2">\n        <Checkbox id="disabled-checked" disabled defaultChecked />\n        <Label htmlFor="disabled-checked">Enable notifications</Label>\n      </div>\n      <div className="flex items-center gap-2">\n        <Checkbox id="disabled-indeterminate" disabled indeterminate />\n        <Label htmlFor="disabled-indeterminate">Sync some folders</Label>\n      </div>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleCheckboxDisabled />
    </div>
  ),
};

export const Table: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use checkboxes to select rows in a table. The header checkbox is `indeterminate` while only some rows are selected; clicking it then selects every row.",
      },

      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\nimport {\n  createColumnHelper,\n  metaHelper,\n  rowSelectionFeature,\n  tableFeatures,\n  useTable,\n} from "@tanstack/react-table";\n\ntype User = {\n  id: string;\n  name: string;\n  email: string;\n  role: string;\n};\n\nconst tableData: User[] = [\n  { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },\n  { id: "2", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },\n  { id: "3", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },\n  { id: "4", name: "David Kim", email: "david.kim@example.com", role: "Editor" },\n];\n\nconst features = tableFeatures({\n  rowSelectionFeature,\n  columnMeta: metaHelper<{ className?: string }>(),\n});\n\nconst columnHelper = createColumnHelper<typeof features, User>();\n\nconst columns = columnHelper.columns([\n  columnHelper.display({\n    id: "select",\n    header: ({ table }) => (\n      <Checkbox\n        aria-label="Select all rows"\n        checked={table.getIsAllRowsSelected()}\n        // v9\'s getIsSomeRowsSelected() is also true when every row is selected.\n        indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}\n        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}\n      />\n    ),\n    cell: ({ row }) => (\n      <Checkbox\n        aria-label={`Select ${row.original.name}`}\n        checked={row.getIsSelected()}\n        disabled={!row.getCanSelect()}\n        onCheckedChange={(checked) => row.toggleSelected(checked)}\n      />\n    ),\n    meta: { className: "w-8" },\n  }),\n  columnHelper.accessor("name", {\n    header: "Name",\n    cell: (info) => <span className="font-medium">{info.getValue()}</span>,\n  }),\n  columnHelper.accessor("email", { header: "Email" }),\n  columnHelper.accessor("role", { header: "Role" }),\n]);\n\nexport function CheckboxInTable() {\n  const table = useTable({\n    features,\n    columns,\n    data: tableData,\n    getRowId: (row) => row.id,\n    initialState: { rowSelection: { "1": true } },\n  });\n\n  return (\n    <Table>\n      <TableHeader>\n        {table.getHeaderGroups().map((headerGroup) => (\n          <TableRow key={headerGroup.id}>\n            {headerGroup.headers.map((header) => (\n              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>\n                {header.isPlaceholder ? null : <table.FlexRender header={header} />}\n              </TableHead>\n            ))}\n          </TableRow>\n        ))}\n      </TableHeader>\n      <TableBody>\n        {table.getRowModel().rows.map((row) => (\n          <TableRow data-state={row.getIsSelected() ? "selected" : undefined} key={row.id}>\n            {row.getAllCells().map((cell) => (\n              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>\n                <table.FlexRender cell={cell} />\n              </TableCell>\n            ))}\n          </TableRow>\n        ))}\n      </TableBody>\n    </Table>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxInTable />,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: {
        story: "Pair the checkbox with `Field` and `FieldLabel` for proper layout and labeling.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\n\nexport function CheckboxBasic() {\n  return (\n    <FieldGroup className="mx-auto w-56">\n      <Field orientation="horizontal">\n        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />\n        <FieldLabel htmlFor="terms-checkbox-basic">Accept terms and conditions</FieldLabel>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxBasic />,
};
export const Description: Story = {
  parameters: {
    docs: {
      description: { story: "Use `FieldContent` and `FieldDescription` for helper text." },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldContent,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n} from "@erbium/ui/components/field";\n\nexport function CheckboxDescription() {\n  return (\n    <FieldGroup className="mx-auto w-72">\n      <Field orientation="horizontal">\n        <Checkbox id="terms-checkbox-desc" name="terms-checkbox-desc" defaultChecked />\n        <FieldContent>\n          <FieldLabel htmlFor="terms-checkbox-desc">Accept terms and conditions</FieldLabel>\n          <FieldDescription>\n            By clicking this checkbox, you agree to the terms and conditions.\n          </FieldDescription>\n        </FieldContent>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxDescription />,
};
export const Group: Story = {
  parameters: {
    docs: {
      description: { story: "Use multiple fields to create a checkbox list." },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Field,\n  FieldDescription,\n  FieldGroup,\n  FieldLabel,\n  FieldLegend,\n  FieldSet,\n} from "@erbium/ui/components/field";\n\nexport function CheckboxGroup() {\n  return (\n    <FieldSet>\n      <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>\n      <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>\n      <FieldGroup className="gap-3">\n        <Field orientation="horizontal">\n          <Checkbox\n            id="finder-pref-9k2-hard-disks-ljj-checkbox"\n            name="finder-pref-9k2-hard-disks-ljj-checkbox"\n            defaultChecked\n          />\n          <FieldLabel htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox" className="font-normal">\n            Hard disks\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal">\n          <Checkbox\n            id="finder-pref-9k2-external-disks-1yg-checkbox"\n            name="finder-pref-9k2-external-disks-1yg-checkbox"\n            defaultChecked\n          />\n          <FieldLabel htmlFor="finder-pref-9k2-external-disks-1yg-checkbox" className="font-normal">\n            External disks\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal">\n          <Checkbox\n            id="finder-pref-9k2-cds-dvds-fzt-checkbox"\n            name="finder-pref-9k2-cds-dvds-fzt-checkbox"\n          />\n          <FieldLabel htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox" className="font-normal">\n            CDs, DVDs, and iPods\n          </FieldLabel>\n        </Field>\n        <Field orientation="horizontal">\n          <Checkbox\n            id="finder-pref-9k2-connected-servers-6l2-checkbox"\n            name="finder-pref-9k2-connected-servers-6l2-checkbox"\n          />\n          <FieldLabel\n            htmlFor="finder-pref-9k2-connected-servers-6l2-checkbox"\n            className="font-normal"\n          >\n            Connected servers\n          </FieldLabel>\n        </Field>\n      </FieldGroup>\n    </FieldSet>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxGroup />,
};

export const InvalidState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Set `aria-invalid` on the checkbox and `data-invalid` on the field wrapper to\n\nshow the invalid styles.",
      },
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Field, FieldGroup, FieldLabel } from "@erbium/ui/components/field";\n\nexport function CheckboxInvalid() {\n  return (\n    <FieldGroup className="mx-auto w-56">\n      <Field orientation="horizontal" data-invalid>\n        <Checkbox id="terms-checkbox-invalid" name="terms-checkbox-invalid" aria-invalid />\n        <FieldLabel htmlFor="terms-checkbox-invalid">Accept terms and conditions</FieldLabel>\n      </Field>\n    </FieldGroup>\n  );\n}\n',
      },
    },
  },
  render: () => <CheckboxInvalid />,
};
