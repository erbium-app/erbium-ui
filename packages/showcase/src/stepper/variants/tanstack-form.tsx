import { Schema } from "effect";
import { useAppForm } from "@erbium/ui/components/form";
import {
  createStepperFormFinish,
  Stepper,
  StepperActions,
  StepperForm,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperOptional,
  StepperPanel,
  StepperPrevious,
  StepperSeparator,
  StepperText,
  StepperTitle,
  StepperTrigger,
} from "@erbium/ui/components/stepper";

const Required = Schema.Trim.check(Schema.isNonEmpty({ message: "Required" }));

const Account = Schema.Struct({
  email: Schema.String.check(
    Schema.isPattern(/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/u, {
      message: "Enter a valid email address.",
    }),
  ),
});

const Profile = Schema.Struct({ name: Required });

const Referral = Schema.Struct({ code: Schema.String });

// One schema for the whole form. Each step validates its own slice, named after the step.
const Signup = Schema.Struct({ account: Account, profile: Profile, referral: Referral });

const steps = [
  { id: "account", title: "Account" },
  { id: "referral", optional: true, title: "Referral" },
  { id: "profile", title: "Profile" },
];

/** Stands in for the server: this address is already registered. */
const register = async (email: string) => {
  // oxlint-disable-next-line promise/avoid-new -- browsers have no promise-based timer, so the delay wraps `setTimeout`.
  await new Promise((resolve) => {
    setTimeout(resolve, 600);
  });

  if (email === "taken@example.com") {
    throw new Error("email-taken");
  }
};

export default function StepperTanstackFormExample() {
  const form = useAppForm({
    defaultValues: { account: { email: "" }, profile: { name: "" }, referral: { code: "" } },
    validators: { onDynamic: Schema.toStandardSchemaV1(Signup) },
    onSubmit: async ({ value }) => {
      await register(value.account.email);
    },
  });

  return (
    <Stepper
      steps={steps}
      className="max-w-md"
      // The final submit runs the whole schema, then the server. A taken email sends the user
      // back to the account step with the error on its field.
      onFinish={createStepperFormFinish(form, {
        fieldErrors: (error) =>
          error instanceof Error && error.message === "email-taken"
            ? { "account.email": "That email is already registered." }
            : undefined,
      })}
    >
      <StepperList aria-label="Sign up">
        {steps.map((step) => (
          <StepperItem key={step.id} value={step.id}>
            <StepperTrigger>
              <StepperIndicator />
              <StepperText>
                <StepperTitle>{step.title}</StepperTitle>
                <StepperOptional />
              </StepperText>
            </StepperTrigger>
            <StepperSeparator />
          </StepperItem>
        ))}
      </StepperList>
      <StepperPanel value="account">
        <form.FormGroup
          name="account"
          validators={{ onDynamic: Schema.toStandardSchemaV1(Account) }}
        >
          {(group) => (
            <StepperForm group={group}>
              <form.AppField name="account.email">
                {(field) => <field.TextField label="Email" required />}
              </form.AppField>
              <p className="text-control-sm text-muted-foreground">
                Try taken@example.com to see a server error routed back here.
              </p>
            </StepperForm>
          )}
        </form.FormGroup>
      </StepperPanel>
      <StepperPanel value="referral">
        <form.FormGroup
          name="referral"
          validators={{ onDynamic: Schema.toStandardSchemaV1(Referral) }}
        >
          {(group) => (
            // Left empty, Next skips the step instead of completing it.
            <StepperForm group={group}>
              <form.AppField name="referral.code">
                {(field) => <field.TextField label="Referral code" />}
              </form.AppField>
            </StepperForm>
          )}
        </form.FormGroup>
      </StepperPanel>
      <StepperPanel value="profile">
        <form.FormGroup
          name="profile"
          validators={{ onDynamic: Schema.toStandardSchemaV1(Profile) }}
        >
          {(group) => (
            <StepperForm group={group}>
              <form.AppField name="profile.name">
                {(field) => <field.TextField label="Name" required />}
              </form.AppField>
            </StepperForm>
          )}
        </form.FormGroup>
      </StepperPanel>
      <StepperActions>
        <StepperPrevious />
        <StepperNext finishLabel="Create account" />
      </StepperActions>
    </Stepper>
  );
}
