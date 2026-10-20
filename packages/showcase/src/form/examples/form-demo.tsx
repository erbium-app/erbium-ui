import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import { shake } from "@erbium/ui/lib/shake";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import type { StatefulButtonState } from "@erbium/ui/components/stateful-button";

const SubmitButton = ({
  isSubmitting,
  isSubmitSuccessful,
  submissionAttempts,
  label,
}: {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submissionAttempts: number;
  label: string;
}) => {
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
};

const FormDemo = ({
  defaultEmail = "",
  required = true,
  submitLabel = "Submit",
}: {
  defaultEmail?: string;
  required?: boolean;
  submitLabel?: string;
}) => {
  const [submitted, setSubmitted] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const request = useAsyncDebouncer(async () => {}, { wait: 450 });

  const form = useForm({
    defaultValues: { email: defaultEmail },
    onSubmit: async ({ value }) => {
      await request.maybeExecute();
      setSubmitted(value.email);
    },
    onSubmitInvalid: ({ formApi }) => {
      if (formApi.state.fieldMeta.email?.errors.length) {
        shake(emailRef.current);
      }
    },
  });

  return (
    <form
      noValidate
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
          <Field
            name={field.name}
            invalid={!field.state.meta.isValid}
            touched={field.state.meta.isTouched}
            dirty={field.state.meta.isDirty}
          >
            <FieldLabel>Email</FieldLabel>
            <Input
              ref={emailRef}
              type="email"
              value={field.state.value}
              onFocus={() => {
                field.setErrorMap({ ...field.state.meta.errorMap, onBlur: undefined });
              }}
              onBlur={field.handleBlur}
              onChange={(event) => {
                field.handleChange(event.target.value);
              }}
            />
            <FieldDescription>We will use this to contact you.</FieldDescription>
            <FieldError errors={field.state.meta.errors} />
          </Field>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) =>
          [state.isSubmitting, state.isSubmitSuccessful, state.submissionAttempts] as const
        }
      >
        {([isSubmitting, isSubmitSuccessful, submissionAttempts]) => (
          <SubmitButton
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
};

export default FormDemo;
