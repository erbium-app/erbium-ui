import type { Meta, StoryObj } from "../types";

import { Checkbox } from "@erbium/ui/components/checkbox";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/checkbox-demo.tsx?raw";

import CheckedExample from "./variants/checked";

import CheckedSource from "./variants/checked.tsx?raw";

import ControlledExample from "./variants/controlled";

import ControlledSource from "./examples/checkbox-controlled.tsx?raw";

import IndeterminateExample from "./variants/indeterminate";

import IndeterminateSource from "./examples/checkbox-indeterminate.tsx?raw";

import ReadOnlyExample from "./variants/read-only";

import ReadOnlySource from "./examples/checkbox-read-only.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./examples/checkbox-form.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./examples/checkbox-disabled.tsx?raw";

import TableExample from "./variants/table";

import TableSource from "./examples/checkbox-table.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./examples/checkbox-basic.tsx?raw";

import DescriptionExample from "./variants/description";

import DescriptionSource from "./examples/checkbox-description.tsx?raw";

import GroupExample from "./variants/group";

import GroupSource from "./examples/checkbox-group.tsx?raw";

import InvalidStateExample from "./variants/invalid-state";

import InvalidStateSource from "./examples/checkbox-invalid.tsx?raw";

const meta = {
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("checkbox"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Checkbox> = {
  argTypes: {
    defaultChecked: { control: "boolean", description: "Initial checked state (uncontrolled)." },
    disabled: { control: "boolean", description: "Ignores interaction and dims the control." },
    indeterminate: { control: "boolean", description: "Mixed state; shows a minus icon." },
    onCheckedChange: { action: "onCheckedChange" },
    readOnly: { control: "boolean", description: "Focusable, but the state cannot change." },
    required: { control: "boolean", description: "Must be checked before the form submits." },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Checked: Story = {
  name: "Checked State",
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "checked") },
      source: { code: CheckedSource },
    },
  },
  render: CheckedExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Indeterminate: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "indeterminate") },
      source: { code: IndeterminateSource },
    },
  },
  render: IndeterminateExample,
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "read-only") },
      source: { code: ReadOnlySource },
    },
  },
  render: ReadOnlyExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const Table: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "table") },
      source: { code: TableSource },
    },
  },
  render: TableExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Description: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "description") },
      source: { code: DescriptionSource },
    },
  },
  render: DescriptionExample,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "group") },
      source: { code: GroupSource },
    },
  },
  render: GroupExample,
};

export const InvalidState: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("checkbox", "invalid-state") },
      source: { code: InvalidStateSource },
    },
  },
  render: InvalidStateExample,
};
