import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useState } from "react";
import { DirectionProvider } from "@erbium/ui/components/direction";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@erbium/ui/components/number-field";

const meta = {
  title: "UI/Number Field",
  component: NumberField,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Base UI's number field: stepping with buttons, arrow keys, Home/End, the wheel and scrubbing, clamped to `min`/`max` and formatted with `Intl`. Values changed by stepping or from outside morph with torph; typed text always shows instantly. Import from `@erbium/ui/components/number-field`.",
      },
    },
  },
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <NumberField defaultValue={1200} className="w-48">
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput aria-label="Quantity" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-48 flex-col gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <NumberField key={size} size={size} defaultValue={8}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-label={`Size ${size}`} />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      ))}
    </div>
  ),
};

export const ScrubLabel: Story = {
  render: () => (
    <NumberField defaultValue={24} min={0} max={200} className="w-48">
      <NumberFieldScrubArea label="Font size" />
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  ),
};

export const Formats: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-3">
      <NumberField defaultValue={1499.5} step={0.5} format={{ style: "currency", currency: "USD" }}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Price" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={0.25} step={0.05} min={0} max={1} format={{ style: "percent" }}>
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="Opacity" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={1234567}>
        <span className="text-xs text-muted-foreground">Western grouping (en)</span>
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Western grouping" className="text-start" />
        </NumberFieldGroup>
      </NumberField>
      <NumberField defaultValue={1234567} locale="en-IN">
        <span className="text-xs text-muted-foreground">Indian lakh grouping (en-IN)</span>
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Indian lakh grouping" className="text-start" />
        </NumberFieldGroup>
      </NumberField>
    </div>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<number | null>(2500);
  return (
    <div className="flex w-56 flex-col gap-2">
      <NumberField value={value} onValueChange={setValue} min={0} largeStep={1000}>
        <NumberFieldGroup>
          <NumberFieldInput aria-label="Budget" className="text-end" />
        </NumberFieldGroup>
      </NumberField>
      <div className="flex gap-2">
        {[-1000, 1000, 10_000].map((delta) => (
          <button
            key={delta}
            type="button"
            className="rounded-md border px-2 py-1 text-xs"
            onClick={() => setValue((current) => Math.max(0, (current ?? 0) + delta))}
          >
            {delta > 0 ? `+${delta}` : delta}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Value: {value ?? "—"}</p>
    </div>
  );
}

export const Controlled: Story = { render: () => <ControlledExample /> };

export const Direction: Story = {
  render: () => (
    <DirectionProvider direction="rtl">
      <div dir="rtl" className="w-48">
        <NumberField defaultValue={98765} locale="ar-EG">
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-label="الكمية" />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </div>
    </DirectionProvider>
  ),
};
