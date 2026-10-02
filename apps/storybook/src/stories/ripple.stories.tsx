import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@erbium/ui/components/button";
import { ButtonGroup } from "@erbium/ui/components/button-group";
import { Toggle } from "@erbium/ui/components/toggle";

const variants = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "error",
  "success",
  "warning",
  "info",
  "ghost-error",
  "ghost-success",
  "ghost-warning",
  "ghost-info",
] as const;

interface RippleArgs {
  radius: number;
  opacity: number;
}

const meta = {
  title: "UI/Ripple",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Every `Button` and `Toggle` ripples where it is pressed, and keyboard activation ripples from the centre. The wave is the same size and speed on every element. Neutral surfaces ripple in their text colour; coloured surfaces ripple in a more vivid shade of their own hue.\n\n### Tuning\n\nTwo tokens from `ripple.css` control the wave. Set them on `:root` or on any element:\n\n```css\n:root {\n  --ripple-radius: 140px; /* how far the wave travels */\n  --ripple-opacity: 1; /* multiplies the ink of every surface */\n}\n```\n\nThe `ripple` utility paints the wave on an element with no surface of its own, and `ripple-fill` and `ripple-soft` pick the coloured inks for custom surfaces.",
      },
    },
  },
  args: { radius: 140, opacity: 1 },
  argTypes: {
    radius: {
      control: { type: "range", min: 20, max: 400, step: 10 },
      description: "`--ripple-radius`, in px. How far the wave travels.",
    },
    opacity: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description: "`--ripple-opacity`. Multiplies the ink of every surface.",
    },
  },
} satisfies Meta<RippleArgs>;

export default meta;

export const Variants: StoryObj<RippleArgs> = {
  render: ({ radius, opacity }) => (
    <div
      className="flex max-w-xl flex-col gap-6"
      style={{ "--ripple-radius": `${radius}px`, "--ripple-opacity": opacity } as CSSProperties}
    >
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">xs</Button>
        <Button size="sm">sm</Button>
        <Button size="lg">lg</Button>
        <Button size="icon" variant="outline" aria-label="Add">
          +
        </Button>
        <Button disabled variant="outline">
          disabled
        </Button>
        <Toggle variant="outline">Toggle</Toggle>
        <Toggle>Flat toggle</Toggle>
      </div>

      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>

      <Button variant="outline" className="h-16 w-full">
        Wide button: the same wave, so it only reaches part of the width
      </Button>
    </div>
  ),
};
