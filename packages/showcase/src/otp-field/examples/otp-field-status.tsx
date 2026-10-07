import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { OTPField } from "@erbium/ui/components/otp-field";

export function OTPFieldStatusDemo() {
  const [verifiedValue, setVerifiedValue] = useState<string>();
  const form = useForm({ defaultValues: { code: "" } });
  return (
    <form.Field
      name="code"
      validators={{
        onChangeAsync: async ({ value, signal, fieldApi }) => {
          if (value.length !== 6) return undefined;
          await new Promise((resolve) => setTimeout(resolve, 900));
          if (signal.aborted || fieldApi.state.value !== value) return undefined;
          if (value === "123456") {
            setVerifiedValue(value);
            return undefined;
          }
          return "Incorrect code. Try 123456.";
        },
      }}
    >
      {(field) => (
        <Field
          className="w-fit"
          name={field.name}
          invalid={field.state.meta.isTouched && !field.state.meta.isValid}
          touched={field.state.meta.isTouched}
          dirty={field.state.meta.isDirty}
        >
          <FieldLabel>Verification code</FieldLabel>
          <FieldDescription>Demo code: 123456</FieldDescription>
          <OTPField
            length={6}
            groups={[3, 3]}
            value={field.state.value}
            validation={field.state.meta}
            verifiedValue={verifiedValue}
            onValueChange={(value) => {
              setVerifiedValue(undefined);
              field.handleChange(value);
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) field.handleBlur();
            }}
          />
          <FieldError errors={field.state.meta.isTouched ? field.state.meta.errors : []} />
        </Field>
      )}
    </form.Field>
  );
}
