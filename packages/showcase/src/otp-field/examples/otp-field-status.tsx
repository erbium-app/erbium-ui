import { Effect } from "effect";
import { useState } from "react";
import { FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { useAppForm } from "@erbium/ui/components/form";

/** Stands in for a server check of a complete code. */
const verify = async (code: string, signal: AbortSignal) => {
  await Effect.runPromise(Effect.sleep("1500 millis"));

  return !signal.aborted && code === "123456";
};

export default function OTPFieldStatusExample() {
  const [verifiedValue, setVerifiedValue] = useState<string>();
  const form = useAppForm({ defaultValues: { code: "" } });

  return (
    <form.AppField
      name="code"
      listeners={{
        onChange: () => {
          setVerifiedValue(undefined);
        },
      }}
      validators={{
        onChangeAsync: async ({ value, signal, fieldApi }) => {
          // Incomplete codes clear feedback without a check.
          const complete = value.length === 6;
          const verified = complete && (await verify(value, signal));
          // A newer edit supersedes this check.
          const current = !signal.aborted && fieldApi.state.value === value;

          if (verified && current) {
            setVerifiedValue(value);
          }

          return complete && current && !verified ? "Incorrect code. Try 123456." : null;
        },
      }}
    >
      {(field) => (
        <field.Field>
          <FieldLabel>Verification code</FieldLabel>
          <FieldDescription>Demo code: 123456</FieldDescription>
          <field.OTPField length={6} groups={[3, 3]} verifiedValue={verifiedValue} />
          <field.FieldError />
        </field.Field>
      )}
    </form.AppField>
  );
}
