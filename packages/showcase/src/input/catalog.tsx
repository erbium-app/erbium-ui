import type { Meta, StoryObj } from "../types";

import { Input } from "@erbium/ui/components/input";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import DisabledControlExample from "./variants/disabled-control";

import DisabledControlSource from "./variants/disabled-control.tsx?raw";

import InvalidExample from "./variants/invalid";

import InvalidSource from "./variants/invalid.tsx?raw";

import FileControlExample from "./variants/file-control";

import FileControlSource from "./variants/file-control.tsx?raw";

import DisabledExample from "./variants/disabled";

import DisabledSource from "./variants/disabled.tsx?raw";

import FileExample from "./variants/file";

import FileSource from "./variants/file.tsx?raw";

import BasicExample from "./variants/basic";

import BasicSource from "./variants/basic.tsx?raw";

import FieldExample from "./variants/field";

import FieldSource from "./variants/field.tsx?raw";

import FieldgroupExample from "./variants/fieldgroup";

import FieldgroupSource from "./variants/fieldgroup.tsx?raw";

import InlineExample from "./variants/inline";

import InlineSource from "./variants/inline.tsx?raw";

import GridExample from "./variants/grid";

import GridSource from "./variants/grid.tsx?raw";

import RequiredExample from "./variants/required";

import RequiredSource from "./variants/required.tsx?raw";

import BadgeExample from "./variants/badge";

import BadgeSource from "./variants/badge.tsx?raw";

import InputGroupExample from "./variants/input-group";

import InputGroupSource from "./variants/input-group.tsx?raw";

import ButtonGroupExample from "./variants/button-group";

import ButtonGroupSource from "./variants/button-group.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("input"),
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Input> = {
  args: { type: "text", placeholder: "Type here", disabled: false, className: "" },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "date", "file"],
    },
    disabled: { control: "boolean" },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const DisabledControl: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "disabled-control") },
      source: { code: DisabledControlSource },
    },
  },
  render: DisabledControlExample,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "invalid") },
      source: { code: InvalidSource },
    },
  },
  render: InvalidExample,
};

export const FileControl: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "file-control") },
      source: { code: FileControlSource },
    },
  },
  render: FileControlExample,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "disabled") },
      source: { code: DisabledSource },
    },
  },
  render: DisabledExample,
};

export const File: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "file") },
      source: { code: FileSource },
    },
  },
  render: FileExample,
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "basic") },
      source: { code: BasicSource },
    },
  },
  render: BasicExample,
};

export const Field: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "field") },
      source: { code: FieldSource },
    },
  },
  render: FieldExample,
};

export const Fieldgroup: Story = {
  name: "Field Group",
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("input", "fieldgroup") },
      source: { code: FieldgroupSource },
    },
  },
  render: FieldgroupExample,
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "inline") },
      source: { code: InlineSource },
    },
  },
  render: InlineExample,
};

export const Grid: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("input", "grid") },
      source: { code: GridSource },
    },
  },
  render: GridExample,
};

export const Required: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "required") },
      source: { code: RequiredSource },
    },
  },
  render: RequiredExample,
};

export const Badge: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "badge") },
      source: { code: BadgeSource },
    },
  },
  render: BadgeExample,
};

export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "input-group") },
      source: { code: InputGroupSource },
    },
  },
  render: InputGroupExample,
};

export const ButtonGroup: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("input", "button-group") },
      source: { code: ButtonGroupSource },
    },
  },
  render: ButtonGroupExample,
};

export const Form: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: { story: variantDocumentation("input", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};
