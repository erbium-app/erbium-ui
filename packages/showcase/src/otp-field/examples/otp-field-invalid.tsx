import { useForm } from "@tanstack/react-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { OTPField } from "@erbium/ui/components/otp-field";

export function OTPFieldInvalid() {
  const form = useForm({ defaultValues: { code: "" } });
  return (
    <form.Field
      name="code"
      validators={{
        onChange: ({ value }) =>
          value.length === 6 && value !== "123456" ? "Incorrect code. Try 123456." : undefined,
        onSubmit: ({ value }) => (value.length !== 6 ? "Enter all 6 digits." : undefined),
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
            verifiedValue={
              field.state.meta.isDirty && field.state.meta.isValid ? field.state.value : undefined
            }
            onValueChange={field.handleChange}
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
