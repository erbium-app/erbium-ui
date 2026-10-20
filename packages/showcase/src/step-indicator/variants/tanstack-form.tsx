import { useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { StepIndicator, StepIndicatorItem } from "@erbium/ui/blocks/step-indicator";
import { Button } from "@erbium/ui/components/button";
import { Field, FieldError, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

const steps = [
  { field: "name", label: "Name" },
  { field: "email", label: "Email" },
  { field: "company", label: "Company" },
] as const;

const required = ({ value }: { value: string }) => (value.trim() ? undefined : "Required");

const Example = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const form = useForm({
    defaultValues: { company: "", email: "", name: "" },
    onSubmit: () => {
      setDone(true);
    },
    // Submit validates every step. Send the user to the first one that failed.
    onSubmitInvalid: ({ formApi }) => {
      const first = steps.findIndex((item) => !formApi.getFieldMeta(item.field)?.isValid);

      if (first !== -1) {
        setStep(first);
      }
    },
  });

  const fieldMeta = useStore(form.store, (state) => state.fieldMeta);

  // A step shows an error only after the user has touched it: by typing and
  // blurring, or by trying to move past it. Untouched steps stay quiet.
  const hasError = (field: (typeof steps)[number]["field"]) =>
    Boolean(fieldMeta[field]?.isTouched && !fieldMeta[field]?.isValid);

  // Going back is free. Going forward validates each step on the way, which
  // touches it, and stops at the first invalid one. Later steps are never
  // validated, so they never show an error before the user reaches them.
  const goTo = async (target: number) => {
    for (let index = step; index < target; index++) {
      const errors = await form.validateField(steps[index].field, "change");

      if (errors.length) {
        setStep(index);

        return;
      }
    }

    setStep(target);
  };

  return (
    <form
      className="flex w-72 flex-col items-center gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <StepIndicator value={step} onValueChange={goTo}>
        {steps.map((item, index) => (
          <StepIndicatorItem
            key={item.field}
            index={index}
            label={item.label}
            invalid={hasError(item.field)}
          />
        ))}
      </StepIndicator>
      {/* Every field stays mounted so validateField always finds its validators.
          Only the current step is visible. */}
      {steps.map((item, index) => (
        <form.Field key={item.field} name={item.field} validators={{ onChange: required }}>
          {(field) => {
            const invalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field className="w-full" name={field.name} invalid={invalid} hidden={index !== step}>
                <FieldLabel>{item.label}</FieldLabel>
                <Input
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                  }}
                  onBlur={field.handleBlur}
                />
                <FieldError errors={invalid ? field.state.meta.errors : []} />
              </Field>
            );
          }}
        </form.Field>
      ))}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={async () => {
            await goTo(step - 1);
          }}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            type="button"
            onClick={async () => {
              await goTo(step + 1);
            }}
          >
            Next
          </Button>
        ) : (
          <Button type="submit">{done ? "Saved" : "Finish"}</Button>
        )}
      </div>
    </form>
  );
};

export default Example;
