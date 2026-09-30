import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/form-demo";

const meta = {
  title: "UI/Form",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Import `useForm` from `@tanstack/react-form`. Use `form.Field` for state and validation, then compose the visible control with `Field`, `FieldLabel`, `FieldDescription`, `FieldError`, and an input component. Keep `FieldError` mounted with `errors={field.state.meta.errors}` so validation messages expand smoothly, and connect the input with `aria-describedby`. Validate on blur or change as needed, and prevent the browser's default form submit before calling `form.handleSubmit()`. See the [shadcn/ui TanStack Form guide](https://ui.shadcn.com/docs/forms/tanstack-form) for the related upstream pattern.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

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
  render: (args) => <Demo key={args.defaultEmail} {...args} />,
};
export const Validation: Story = {
  parameters: {
    docs: {
      description: { story: "Validate a form field and display its error beside the control." },
      source: {
        code: 'import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";\nimport { useState } from "react";\nimport { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";\nimport { useForm } from "@tanstack/react-form";\nimport { Input } from "@erbium/ui/components/input";\nimport { StatefulButton } from "@erbium/ui/components/stateful-button";\nimport type { StatefulButtonState } from "@erbium/ui/components/stateful-button";\n\nfunction SubmitButton({\n  canSubmit,\n  isSubmitting,\n  isSubmitSuccessful,\n  submissionAttempts,\n  label,\n}: {\n  canSubmit: boolean;\n  isSubmitting: boolean;\n  isSubmitSuccessful: boolean;\n  submissionAttempts: number;\n  label: string;\n}) {\n  const [dismissedAttempt, setDismissedAttempt] = useState(0);\n  let state: StatefulButtonState = "idle";\n  if (isSubmitting) {\n    state = "loading";\n  } else if (isSubmitSuccessful && submissionAttempts !== dismissedAttempt) {\n    state = "success";\n  }\n\n  return (\n    <StatefulButton\n      type="submit"\n      disabled={!canSubmit}\n      state={state}\n      onStateChange={(nextStatus) => {\n        if (nextStatus === "idle") {\n          setDismissedAttempt(submissionAttempts);\n        }\n      }}\n      successLabel="Submitted"\n    >\n      {label}\n    </StatefulButton>\n  );\n}\n\nexport default function FormDemo({\n  defaultEmail = "",\n  required = true,\n  submitLabel = "Submit",\n}: {\n  defaultEmail?: string;\n  required?: boolean;\n  submitLabel?: string;\n}) {\n  const [submitted, setSubmitted] = useState("");\n  const request = useAsyncDebouncer(async () => {}, { wait: 450 });\n  const form = useForm({\n    defaultValues: { email: defaultEmail },\n    onSubmit: async ({ value }) => {\n      await request.maybeExecute();\n      setSubmitted(value.email);\n    },\n  });\n  return (\n    <form\n      onSubmit={(event) => {\n        event.preventDefault();\n        void form.handleSubmit();\n      }}\n      className="w-80 space-y-4"\n    >\n      <form.Field\n        name="email"\n        validators={{\n          onBlur: ({ value }) =>\n            required && !value.includes("@") ? "Enter a valid email address." : undefined,\n        }}\n      >\n        {(field) => (\n          <Field data-invalid={field.state.meta.errors.length > 0}>\n            <FieldLabel htmlFor="form-email">Email</FieldLabel>\n            <Input\n              id="form-email"\n              type="email"\n              aria-invalid={field.state.meta.errors.length > 0}\n              aria-describedby="form-email-description form-email-error"\n              value={field.state.value}\n              onFocus={() => field.setErrorMap({ ...field.state.meta.errorMap, onBlur: undefined })}\n              onBlur={field.handleBlur}\n              onChange={(event) => field.handleChange(event.target.value)}\n            />\n            <FieldDescription id="form-email-description">\n              We will use this to contact you.\n            </FieldDescription>\n            <FieldError id="form-email-error" errors={field.state.meta.errors} />\n          </Field>\n        )}\n      </form.Field>\n      <form.Subscribe\n        selector={(state) =>\n          [\n            state.canSubmit,\n            state.isSubmitting,\n            state.isSubmitSuccessful,\n            state.submissionAttempts,\n          ] as const\n        }\n      >\n        {([canSubmit, isSubmitting, isSubmitSuccessful, submissionAttempts]) => (\n          <SubmitButton\n            canSubmit={canSubmit}\n            isSubmitting={isSubmitting}\n            isSubmitSuccessful={isSubmitSuccessful}\n            submissionAttempts={submissionAttempts}\n            label={submitLabel}\n          />\n        )}\n      </form.Subscribe>\n      {submitted && <p role="status">Submitted: {submitted}</p>}\n    </form>\n  );\n}\n',
      },
    },
  },
  render: () => <Demo />,
};
