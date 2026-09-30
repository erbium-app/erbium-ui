import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Control } from "@erbium/ui/components/control";
import Demo from "../examples/control-demo";

const meta = {
  title: "UI/Control",
  component: Control.Number,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A compact family of controls for sidebars and settings pages. Every row uses the Erbium control surface. Import `Control` from `@erbium/ui/components/control` and compose its typed members inside `Control.Group` or `Control.Section`.",
      },
    },
  },
} satisfies Meta<typeof Control.Number>;

export default meta;
type Story = StoryObj;

export const Overview: Story = { render: () => <Demo /> };

function NumberExample() {
  const [value, setValue] = useState(0.7);
  return (
    <Control.Number
      label="Scale"
      value={value}
      onValueChange={setValue}
      min={0}
      max={1}
      step={0.01}
      className="w-72"
    />
  );
}
export const Number: Story = {
  parameters: {
    docs: {
      description: {
        story: "Drag or use arrow keys to change the value; click the number for precise entry.",
      },
    },
  },
  render: () => <NumberExample />,
};

export const ContinuousNumber: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Continuous mode drags smoothly across the range and accepts any in-range number through the value editor.",
      },
    },
  },
  render: () => (
    <Control.Number
      label="Position"
      mode="continuous"
      defaultValue={32.418}
      min={-100}
      max={100}
      className="w-72"
    />
  ),
};

export const DiscreteNumber: Story = {
  parameters: {
    docs: {
      description: {
        story: "Discrete mode accepts uneven steps and moves one allowed value per arrow key.",
      },
    },
  },
  render: () => (
    <Control.Number
      label="Quality"
      steps={[0.1, 0.5, 0.7, 1.3]}
      defaultValue={0.7}
      className="w-72"
    />
  ),
};

export const Text: Story = {
  render: () => <Control.Text label="Title" defaultValue="Japan" className="w-72" />,
};

export const Textarea: Story = {
  render: () => (
    <Control.Textarea
      label="Description"
      defaultValue="A collection of favorite places."
      className="w-72"
    />
  ),
};

export const Boolean: Story = {
  render: () => (
    <Control.Group className="w-72">
      <Control.Boolean label="Visible" defaultChecked />
      <Control.Boolean label="Reduced motion" presentation="switch" />
    </Control.Group>
  ),
};

export const Segmented: Story = {
  render: () => (
    <Control.Segmented
      label="Mode"
      defaultValue="photo"
      options={[
        { label: "Photo", value: "photo" },
        { label: "Video", value: "video" },
      ]}
      className="w-72"
    />
  ),
};

export const Select: Story = {
  render: () => (
    <Control.Select
      label="Shape"
      defaultValue="portrait"
      options={[
        { label: "Portrait", value: "portrait" },
        { label: "Square", value: "square" },
        { label: "Landscape", value: "landscape" },
      ]}
      className="w-72"
    />
  ),
};

export const Color: Story = {
  render: () => <Control.Color label="Shadow Tint" defaultValue="#393a34" className="w-72" />,
};

export const Image: Story = {
  render: () => (
    <Control.Group className="w-72">
      <Control.Image
        label="Cover Photo"
        options={[
          {
            value: "warm",
            label: "Warm",
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%23d4976c'/%3E%3C/svg%3E",
          },
          {
            value: "cool",
            label: "Cool",
            src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Crect width='32' height='32' fill='%236394bf'/%3E%3C/svg%3E",
          },
        ]}
        onFileChange={() => undefined}
      />
    </Control.Group>
  ),
};

export const Pad: Story = {
  render: () => <Control.Pad label="Position" defaultValue={{ x: 25, y: 75 }} className="w-72" />,
};

export const Spring: Story = {
  render: () => <Control.Spring label="Spring" className="w-72" />,
};

export const Transition: Story = {
  render: () => <Control.Transition label="Transition" className="w-72" />,
};

export const Action: Story = {
  render: () => (
    <Control.Action label="Reset settings" className="w-72" onClick={() => undefined} />
  ),
};

export const Section: Story = {
  render: () => (
    <Control.Group className="w-72">
      <Control.Section title="Shadow">
        <Control.Number label="Blur" defaultValue={14} min={0} max={50} />
        <Control.Boolean label="Enabled" defaultChecked />
      </Control.Section>
    </Control.Group>
  ),
};

export const Group: Story = {
  render: () => (
    <Control.Group className="w-72">
      <Control.Text label="Title" defaultValue="Japan" />
      <Control.Number label="Opacity" defaultValue={0.6} min={0} max={1} step={0.01} />
    </Control.Group>
  ),
};

export const Row: Story = {
  render: () => (
    <Control.Row label="Version" className="w-72">
      <span className="ms-auto text-sm text-muted-foreground">1.0</span>
    </Control.Row>
  ),
};
