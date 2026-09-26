import ExampleNativeSelectGroups from "./examples/native-select-groups";
import ExampleNativeSelectDisabled from "./examples/native-select-disabled";
import ExampleNativeSelectInvalid from "./examples/native-select-invalid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NativeSelect } from "@erbium/ui/components/native-select";
import Demo from "./examples/native-select-demo";

const meta = {
  title: "UI/Native Select",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A styled native HTML select element with consistent design system integration.\n\n**Import:** `@erbium/ui/components/native-select`  \n\n**shadcn/ui page:** [Native Select](https://ui.shadcn.com/docs/components/base/native-select)\n\n### Usage\n\n```tsx\nimport {\n  NativeSelect,\n  NativeSelectOptGroup,\n  NativeSelectOption,\n} from "@erbium/ui/components/native-select"\n```\n\n```tsx\n<NativeSelect>\n  <NativeSelectOption value="">Select a fruit</NativeSelectOption>\n  <NativeSelectOption value="apple">Apple</NativeSelectOption>\n  <NativeSelectOption value="banana">Banana</NativeSelectOption>\n  <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>\n  <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>\n</NativeSelect>\n```\n\n### Composition\n\nOptions placed directly under `NativeSelect` (no `NativeSelectOptGroup`).\n\nUse `NativeSelectOptGroup` to organize options into categories.\n\n```text\nNativeSelect\n├── NativeSelectOption\n├── NativeSelectOption\n├── NativeSelectOption\n└── NativeSelectOption\n```\n\n```text\nNativeSelect\n├── NativeSelectOptGroup\n│   ├── NativeSelectOption\n│   └── NativeSelectOption\n└── NativeSelectOptGroup\n    ├── NativeSelectOption\n    └── NativeSelectOption\n```\n\n### Groups\n\nUse `NativeSelectOptGroup` to organize options into categories.\n\n### Disabled\n\nAdd the `disabled` prop to the `NativeSelect` component to disable the select.\n\n### Invalid\n\nUse `aria-invalid` to show validation errors and the `data-invalid` attribute to the `Field` component for styling.\n\n### Native Select vs Select\n\n- Use `NativeSelect` for native browser behavior, better performance, or mobile-optimized dropdowns.\n\n- Use `Select` for custom styling, animations, or complex interactions.',
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
        code: 'import { NativeSelect, NativeSelectOption } from "@erbium/ui/components/native-select";\n\nexport default function NativeSelectDemo() {\n  return (\n    <NativeSelect>\n      <NativeSelectOption value="">Select status</NativeSelectOption>\n      <NativeSelectOption value="todo">Todo</NativeSelectOption>\n      <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>\n      <NativeSelectOption value="done">Done</NativeSelectOption>\n      <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>\n    </NativeSelect>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Groups: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  NativeSelect,\n  NativeSelectOptGroup,\n  NativeSelectOption,\n} from "@erbium/ui/components/native-select"\n\nexport default function NativeSelectGroups() {\n  return (\n    <NativeSelect>\n      <NativeSelectOption value="">Select department</NativeSelectOption>\n      <NativeSelectOptGroup label="Engineering">\n        <NativeSelectOption value="frontend">Frontend</NativeSelectOption>\n        <NativeSelectOption value="backend">Backend</NativeSelectOption>\n        <NativeSelectOption value="devops">DevOps</NativeSelectOption>\n      </NativeSelectOptGroup>\n      <NativeSelectOptGroup label="Sales">\n        <NativeSelectOption value="sales-rep">Sales Rep</NativeSelectOption>\n        <NativeSelectOption value="account-manager">\n          Account Manager\n        </NativeSelectOption>\n        <NativeSelectOption value="sales-director">\n          Sales Director\n        </NativeSelectOption>\n      </NativeSelectOptGroup>\n      <NativeSelectOptGroup label="Operations">\n        <NativeSelectOption value="support">\n          Customer Support\n        </NativeSelectOption>\n        <NativeSelectOption value="product-manager">\n          Product Manager\n        </NativeSelectOption>\n        <NativeSelectOption value="ops-manager">\n          Operations Manager\n        </NativeSelectOption>\n      </NativeSelectOptGroup>\n    </NativeSelect>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleNativeSelectGroups />
    </div>
  ),
};
export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  NativeSelect,\n  NativeSelectOption,\n} from "@erbium/ui/components/native-select"\n\nexport default function NativeSelectDisabled() {\n  return (\n    <NativeSelect disabled>\n      <NativeSelectOption value="">Select priority</NativeSelectOption>\n      <NativeSelectOption value="low">Low</NativeSelectOption>\n      <NativeSelectOption value="medium">Medium</NativeSelectOption>\n      <NativeSelectOption value="high">High</NativeSelectOption>\n      <NativeSelectOption value="critical">Critical</NativeSelectOption>\n    </NativeSelect>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleNativeSelectDisabled />
    </div>
  ),
};
export const Invalid: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import {\n  NativeSelect,\n  NativeSelectOption,\n} from "@erbium/ui/components/native-select"\n\nexport default function NativeSelectInvalid() {\n  return (\n    <NativeSelect aria-invalid="true">\n      <NativeSelectOption value="">Select role</NativeSelectOption>\n      <NativeSelectOption value="admin">Admin</NativeSelectOption>\n      <NativeSelectOption value="editor">Editor</NativeSelectOption>\n      <NativeSelectOption value="viewer">Viewer</NativeSelectOption>\n      <NativeSelectOption value="guest">Guest</NativeSelectOption>\n    </NativeSelect>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleNativeSelectInvalid />
    </div>
  ),
};
