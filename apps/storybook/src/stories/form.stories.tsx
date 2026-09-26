import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { useState } from "react";
import { useForm } from "@erbium/ui/components/form";
import { Button } from "@erbium/ui/components/button";
import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import Demo from "../examples/form-demo";

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

function FormPlayground({
  defaultEmail,
  required,
  submitLabel,
}: {
  defaultEmail: string;
  required: boolean;
  submitLabel: string;
}) {
  const [submitted, setSubmitted] = useState("");
  const form = useForm({
    defaultValues: { email: defaultEmail },
    onSubmit: async ({ value }) => setSubmitted(value.email),
  });

  return (
    <form
      className="w-80 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) =>
            required && !value.includes("@") ? "Enter a valid email address." : undefined,
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="playground-form-email">Email</FieldLabel>
            <Input
              id="playground-form-email"
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            {field.state.meta.errors.map((error) => (
              <FieldError key={String(error)}>{error}</FieldError>
            ))}
          </Field>
        )}
      </form.Field>
      <Button type="submit">{submitLabel}</Button>
      {submitted && <p role="status">Submitted: {submitted}</p>}
    </form>
  );
}

export const Playground: StoryObj<{
  defaultEmail: string;
  required: boolean;
  submitLabel: string;
}> = {
  args: { defaultEmail: "", required: true, submitLabel: "Submit" },
  argTypes: {
    defaultEmail: { control: "text" },
    required: { control: "boolean" },
    submitLabel: { control: "text" },
  },
  render: (args) => <FormPlayground key={args.defaultEmail} {...args} />,
};
export const Validation: Story = {
  parameters: {
    docs: {
      description: { story: "Validate a form field and display its error beside the control." },
      source: {
        code: 'import { useForm } from "@erbium/ui/components/form";\nimport { Button } from "@erbium/ui/components/button";\nimport { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";\nimport { Input } from "@erbium/ui/components/input";\n\nexport default function FormDemo() {\n  const form = useForm({\n    defaultValues: { email: "" },\n    onSubmit: async ({ value }) => window.alert(`Submitted: ${value.email}`),\n  });\n  return (\n    <form\n      onSubmit={(event) => {\n        event.preventDefault();\n        void form.handleSubmit();\n      }}\n      className="w-80 space-y-4"\n    >\n      <form.Field\n        name="email"\n        validators={{\n          onBlur: ({ value }) => (value.includes("@") ? undefined : "Enter a valid email address."),\n        }}\n      >\n        {(field) => (\n          <Field>\n            <FieldLabel htmlFor="form-email">Email</FieldLabel>\n            <Input\n              id="form-email"\n              type="email"\n              value={field.state.value}\n              onBlur={field.handleBlur}\n              onChange={(event) => field.handleChange(event.target.value)}\n            />\n            <FieldDescription>We will use this to contact you.</FieldDescription>\n            {field.state.meta.errors.map((error) => (\n              <FieldError key={String(error)}>{error}</FieldError>\n            ))}\n          </Field>\n        )}\n      </form.Field>\n      <Button type="submit">Submit</Button>\n    </form>\n  );\n}\n',
      },
    },
  },
  render: () => <Demo />,
};
