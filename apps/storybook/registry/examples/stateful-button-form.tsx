// @ts-nocheck
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Field, FieldError, FieldLabel } from "../components/field";
import { Input } from "../components/input";
import { StatefulButton } from "../components/stateful-button";
import type { StatefulButtonState } from "../components/stateful-button";

function SubmitStatefulButton({
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
      successLabel="Subscribed"
    >
      Subscribe
    </StatefulButton>
  );
}

export default function StatefulButtonForm() {
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
          <Field data-invalid={field.state.meta.errors.length > 0}>
            <FieldLabel htmlFor="stateful-email">Email</FieldLabel>
            <Input
              id="stateful-email"
              type="email"
              aria-invalid={field.state.meta.errors.length > 0}
              aria-describedby="stateful-email-error"
              value={field.state.value}
              onFocus={() => field.setErrorMap({ ...field.state.meta.errorMap, onBlur: undefined })}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
            />
            <FieldError id="stateful-email-error" errors={field.state.meta.errors} />
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
          <SubmitStatefulButton
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
