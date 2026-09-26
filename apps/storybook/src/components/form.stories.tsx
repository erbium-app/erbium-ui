import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "./examples/form-demo";

const meta = {
  title: "UI/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Form exports TanStack Form hooks from `@erbium/ui/components/form`. Use `form.Field` for state and validation, then compose the visible control with `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, and an input component. Validate on blur or change as needed, and prevent the browser's default form submit before calling `form.handleSubmit()`. See the [shadcn/ui TanStack Form guide](https://ui.shadcn.com/docs/forms/tanstack-form) for the related upstream pattern.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;
export const Validation: Story = { render: () => <Demo /> };
