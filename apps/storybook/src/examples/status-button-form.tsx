import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { useForm } from "@erbium/ui/components/form";
import { Input } from "@erbium/ui/components/input";
import { StatusButton } from "@erbium/ui/components/status-button";
import type { ButtonStatus } from "@erbium/ui/components/status-button";

function SubmitStatusButton({
  canSubmit,
  isSubmitting,
  isSubmitSuccessful,
  submissionAttempts,
}: {
  canSubmit: boolean;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submissionAttempts: number;
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
      successLabel="Subscribed"
    >
      Subscribe
    </StatusButton>
  );
}

export default function StatusButtonForm() {
  const request = useAsyncDebouncer(async () => {}, { wait: 1200 });
  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async () => {
      await request.maybeExecute();
    },
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
          onBlur: ({ value }) => (value.includes("@") ? undefined : "Enter a valid email address."),
        }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="status-email">Email</FieldLabel>
            <Input
              id="status-email"
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
          <SubmitStatusButton
            canSubmit={canSubmit}
            isSubmitting={isSubmitting}
            isSubmitSuccessful={isSubmitSuccessful}
            submissionAttempts={submissionAttempts}
          />
        )}
      </form.Subscribe>
    </form>
  );
}
