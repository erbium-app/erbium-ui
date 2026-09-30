import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { useForm } from "@erbium/ui/components/form";
import { Input } from "@erbium/ui/components/input";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import type { StatefulButtonState } from "@erbium/ui/components/stateful-button";

function SubmitButton({
  canSubmit,
  isSubmitting,
  isSubmitSuccessful,
  submissionAttempts,
  label,
}: {
  canSubmit: boolean;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submissionAttempts: number;
  label: string;
}) {
  const [dismissedAttempt, setDismissedAttempt] = useState(0);
  let state: StatefulButtonState = "idle";
  if (isSubmitting) {
    state = "loading";
  } else if (isSubmitSuccessful && submissionAttempts !== dismissedAttempt) {
    state = "success";
  }

  return (
    <StatefulButton
      type="submit"
      disabled={!canSubmit}
      state={state}
      onStateChange={(nextState) => {
        if (nextState === "idle") {
          setDismissedAttempt(submissionAttempts);
        }
      }}
      successLabel="Submitted"
    >
      {label}
    </StatefulButton>
  );
}

export default function FormDemo({
  defaultEmail = "",
  required = true,
  submitLabel = "Submit",
}: {
  defaultEmail?: string;
  required?: boolean;
  submitLabel?: string;
}) {
  const [submitted, setSubmitted] = useState("");
  const request = useAsyncDebouncer(async () => {}, { wait: 450 });
  const form = useForm({
    defaultValues: { email: defaultEmail },
    onSubmit: async ({ value }) => {
      await request.maybeExecute();
      setSubmitted(value.email);
    },
  });
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      className="w-80 space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) =>
            required && !value.includes("@") ? "Enter a valid email address." : undefined,
        }}
      >
        {(field) => (
          <Field data-invalid={field.state.meta.errors.length > 0}>
            <FieldLabel htmlFor="form-email">Email</FieldLabel>
            <Input
              id="form-email"
              type="email"
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="form-email-description form-email-error"
              value={field.state.value}
              onFocus={() => field.setErrorMap({ ...field.state.meta.errorMap, onBlur: undefined })}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldDescription id="form-email-description">
              We will use this to contact you.
            </FieldDescription>
            <FieldError id="form-email-error" errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) =>
          [
            state.canSubmit,
            state.isSubmitting,
            state.isSubmitSuccessful,
            state.submissionAttempts,
          ] as const
        }
      >
        {([canSubmit, isSubmitting, isSubmitSuccessful, submissionAttempts]) => (
          <SubmitButton
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            isSubmitSuccessful={isSubmitSuccessful}
            submissionAttempts={submissionAttempts}
            label={submitLabel}
          />
        )}
      </form.Subscribe>
      {submitted && <p role="status">Submitted: {submitted}</p>}
    </form>
  );
}
