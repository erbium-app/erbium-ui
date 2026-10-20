import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import { shake } from "@erbium/ui/lib/shake";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import type { StatefulButtonState } from "@erbium/ui/components/stateful-button";

const SubmitStatefulButton = ({
  isSubmitting,
  isSubmitSuccessful,
  submissionAttempts,
}: {
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submissionAttempts: number;
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
      successLabel="Subscribed"
    >
      Subscribe
    </StatefulButton>
  );
};

const StatefulButtonForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const request = useAsyncDebouncer(async () => {}, { wait: 1200 });

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async () => {
      await request.maybeExecute();
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
          <SubmitStatefulButton
            isSubmitting={isSubmitting}
            isSubmitSuccessful={isSubmitSuccessful}
            submissionAttempts={submissionAttempts}
          />
        )}
      </form.Subscribe>
    </form>
  );
};

export default StatefulButtonForm;
