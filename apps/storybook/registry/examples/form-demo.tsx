// @ts-nocheck
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../components/field";
import { useForm } from "../components/form";
import { Input } from "../components/input";
import { StatusButton } from "../components/status-button";
import type { ButtonStatus } from "../components/status-button";

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
  let status: ButtonStatus = "idle";
  if (isSubmitting) {
    status = "loading";
  } else if (isSubmitSuccessful && submissionAttempts !== dismissedAttempt) {
    status = "success";
  }

  return (
    <StatusButton
      type="submit"
      disabled={!canSubmit}
      status={status}
      onStatusChange={(nextStatus) => {
        if (nextStatus === "idle") {
          setDismissedAttempt(submissionAttempts);
        }
      }}
      successLabel="Submitted"
    >
      {label}
    </StatusButton>
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
