import { Schema } from "effect";
import { useState } from "react";
import { StepIndicator, StepIndicatorItem } from "@erbium/ui/blocks/step-indicator";
import { Button } from "@erbium/ui/components/button";
import { Form, useAppForm } from "@erbium/ui/components/form";

const Required = Schema.Trim.check(Schema.isNonEmpty({ message: "Required" }));

const Signup = Schema.Struct({
  company: Required,
  email: Schema.String.check(
    Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/u, { message: "Enter a valid email address." }),
  ),
  name: Required,
});

// Each step validates its own field with the matching part of the schema.
const steps = [
  { field: "name", label: "Name", validator: Schema.toStandardSchemaV1(Signup.fields.name) },
  { field: "email", label: "Email", validator: Schema.toStandardSchemaV1(Signup.fields.email) },
  {
    field: "company",
    label: "Company",
    validator: Schema.toStandardSchemaV1(Signup.fields.company),
  },
] as const;

const Example = () => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const form = useAppForm({
    defaultValues: { company: "", email: "", name: "" },
    onSubmit: () => {
      setDone(true);
    },
    // Submit validates every step. Send the user to the first one that failed.
    onSubmitInvalid: ({ formApi }) => {
      const first = steps.findIndex((item) => formApi.getFieldMeta(item.field)?.isValid === false);

      if (first !== -1) {
        setStep(first);
      }
    },
  });

  // Validating a step touches its field. The schema validators are synchronous,
  // so the field's meta is current as soon as validateField returns.
  const validateStep = (field: (typeof steps)[number]["field"]) => {
    void form.validateField(field, "change");

    return form.getFieldMeta(field)?.isValid !== false;
  };

  // Going back is free. Going forward validates each step on the way and stops
  // at the first invalid one. Later steps are never validated, so they never
  // show an error before the user reaches them.
  const goTo = (target: number) => {
    const blocked = steps.findIndex(
      (item, index) => index >= step && index < target && !validateStep(item.field),
    );

    setStep(blocked === -1 ? target : blocked);
  };

  return (
    <Form form={form} className="flex w-full max-w-xs flex-col gap-section">
      <form.Subscribe selector={(state) => state.fieldMeta}>
        {(fieldMeta) => (
          <StepIndicator value={step} onValueChange={goTo}>
            {steps.map((item, index) => (
              <StepIndicatorItem
                key={item.field}
                index={index}
                label={item.label}
                // A step shows an error only after the user has touched it.
                invalid={
                  fieldMeta[item.field]?.isTouched === true &&
                  fieldMeta[item.field]?.isValid === false
                }
              />
            ))}
          </StepIndicator>
        )}
      </form.Subscribe>
      {/* Every field stays mounted so validateField always finds its validators.
          Only the current step is visible. */}
      {steps.map((item, index) => (
        <form.AppField key={item.field} name={item.field} validators={{ onChange: item.validator }}>
          {(field) => (
            <field.TextField
              className="w-full"
              label={item.label}
              hidden={index !== step}
              required
            />
          )}
        </form.AppField>
      ))}
      <div className="grid grid-cols-2 gap-related">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => {
            goTo(step - 1);
          }}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button
            type="button"
            onClick={() => {
              goTo(step + 1);
            }}
          >
            Next
          </Button>
        ) : (
          <Button type="submit">{done ? "Saved" : "Finish"}</Button>
        )}
      </div>
    </Form>
  );
};

export default Example;
