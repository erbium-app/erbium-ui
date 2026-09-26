import { CheckboxInvalid } from "../examples/upstream/checkbox-invalid";
import { CheckboxBasic } from "../examples/upstream/checkbox-basic";
import { CheckboxDescription } from "../examples/upstream/checkbox-description";
import { CheckboxGroup } from "../examples/upstream/checkbox-group";
import { CheckboxInTable } from "../examples/upstream/checkbox-table";
import ExampleCheckboxDisabled from "../examples/checkbox-disabled";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@erbium/ui/components/checkbox";
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
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Checkbox> = {
  args: { defaultChecked: false, disabled: false },
  argTypes: { defaultChecked: { control: "boolean" }, disabled: { control: "boolean" } },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox key={String(args.defaultChecked)} {...args} id="playground-checkbox" />
      <label htmlFor="playground-checkbox">Accept terms</label>
    </div>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox";\nimport { Label } from "@erbium/ui/components/label";\n\nexport default function CheckboxDemo() {\n  return (\n    <div className="flex flex-col gap-6">\n      <div className="flex items-center gap-3">\n        <Checkbox id="terms" />\n        <Label htmlFor="terms">Accept terms and conditions</Label>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="terms-2" defaultChecked />\n        <div className="grid gap-2">\n          <Label htmlFor="terms-2">Accept terms and conditions</Label>\n          <p className="text-sm text-muted-foreground">\n            By clicking this checkbox, you agree to the terms and conditions.\n          </p>\n        </div>\n      </div>\n      <div className="flex items-start gap-3">\n        <Checkbox id="toggle" disabled />\n        <Label htmlFor="toggle">Enable notifications</Label>\n      </div>\n      <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">\n        <Checkbox\n          id="toggle-2"\n          defaultChecked\n          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"\n        />\n        <div className="grid gap-1.5 font-normal">\n          <p className="text-sm leading-none font-medium">Enable notifications</p>\n          <p className="text-sm text-muted-foreground">\n            You can enable or disable notifications at any time.\n          </p>\n        </div>\n      </Label>\n    </div>\n  );\n}\n',
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
        story:
          'Use `defaultChecked` for uncontrolled checkboxes, or `checked` and\n\n`onCheckedChange` to control the state.\n\n```tsx\nimport * as React from "react"\n\nexport function Example() {\n  const [checked, setChecked] = React.useState(false)\n\n  return <Checkbox checked={checked} onCheckedChange={setChecked} />\n}\n```',
      },
    },
  },
  render: () => <Checkbox defaultChecked aria-label="Selected" />,
};
export const DisabledControl: Story = {
  parameters: {
    docs: {
      description: { story: "Disable a checkbox to prevent changes." },
    },
  },

  render: () => <Checkbox disabled aria-label="Unavailable" />,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `disabled` prop to prevent interaction and add the `data-disabled` attribute to the `<Field>` component for disabled styles.",
      },

      source: {
        code: 'import { Checkbox } from "@erbium/ui/components/checkbox"\n\nexport default function CheckboxDisabled() {\n  return (\n    <div className="flex items-center space-x-2">\n      <Checkbox id="terms2" disabled />\n      <label\n        htmlFor="terms2"\n        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"\n      >\n        Accept terms and conditions\n      </label>\n    </div>\n  )\n}\n',
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
      description: { story: "Use checkboxes to select rows in a table." },

      source: {
        code: 'import * as React from "react";\n\nimport { Checkbox } from "@erbium/ui/components/checkbox";\nimport {\n  Table,\n  TableBody,\n  TableCell,\n  TableHead,\n  TableHeader,\n  TableRow,\n} from "@erbium/ui/components/table";\n\nconst tableData = [\n  {\n    id: "1",\n    name: "Sarah Chen",\n    email: "sarah.chen@example.com",\n    role: "Admin",\n  },\n  {\n    id: "2",\n    name: "Marcus Rodriguez",\n    email: "marcus.rodriguez@example.com",\n    role: "User",\n  },\n  {\n    id: "3",\n    name: "Priya Patel",\n    email: "priya.patel@example.com",\n    role: "User",\n  },\n  {\n    id: "4",\n    name: "David Kim",\n    email: "david.kim@example.com",\n    role: "Editor",\n  },\n];\n\nexport function CheckboxInTable() {\n  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set(["1"]));\n\n  const selectAll = selectedRows.size === tableData.length;\n\n  const handleSelectAll = (checked: boolean) => {\n    if (checked) {\n      setSelectedRows(new Set(tableData.map((row) => row.id)));\n    } else {\n      setSelectedRows(new Set());\n    }\n  };\n\n  const handleSelectRow = (id: string, checked: boolean) => {\n    const newSelected = new Set(selectedRows);\n    if (checked) {\n      newSelected.add(id);\n    } else {\n      newSelected.delete(id);\n    }\n    setSelectedRows(newSelected);\n  };\n\n  return (\n    <Table>\n      <TableHeader>\n        <TableRow>\n          <TableHead className="w-8">\n            <Checkbox\n              id="select-all-checkbox"\n              name="select-all-checkbox"\n              checked={selectAll}\n              onCheckedChange={handleSelectAll}\n            />\n          </TableHead>\n          <TableHead>Name</TableHead>\n          <TableHead>Email</TableHead>\n          <TableHead>Role</TableHead>\n        </TableRow>\n      </TableHeader>\n      <TableBody>\n        {tableData.map((row) => (\n          <TableRow key={row.id} data-state={selectedRows.has(row.id) ? "selected" : undefined}>\n            <TableCell>\n              <Checkbox\n                id={`row-${row.id}-checkbox`}\n                name={`row-${row.id}-checkbox`}\n                checked={selectedRows.has(row.id)}\n                onCheckedChange={(checked) => handleSelectRow(row.id, checked === true)}\n              />\n            </TableCell>\n            <TableCell className="font-medium">{row.name}</TableCell>\n            <TableCell>{row.email}</TableCell>\n            <TableCell>{row.role}</TableCell>\n          </TableRow>\n        ))}\n      </TableBody>\n    </Table>\n  );\n}\n',
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
