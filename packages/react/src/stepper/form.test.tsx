import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { describe, expect, it, vi } from "vite-plus/test";
import { createStepperFormFinish, Stepper, useStepperFormGroup } from "./index";
import type { StepperFormGroup, StepperRootProps, StepperStep } from "./index";

const steps: StepperStep[] = [
  { id: "account" },
  { id: "newsletter", optional: true },
  { id: "profile" },
];

type OnSubmit = () => Promise<void> | void;

const required = ({ value }: { value: string }) => (value.trim() === "" ? "Required" : undefined);

const TextInput = ({ field, label }: { field: AnyFieldApi; label: string }) => (
  <div>
    <label>
      {label}
      <input
        aria-invalid={field.state.meta.errors.length > 0}
        value={String(field.state.value)}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
      />
    </label>
    {field.state.meta.errors.map((error) => (
      <span key={String(error)}>{String(error)}</span>
    ))}
  </div>
);

const StepForm = ({ group, children }: { group: StepperFormGroup; children: React.ReactNode }) => {
  const { attempts, formProps } = useStepperFormGroup(group);

  return (
    <form aria-label={`${group.name} form`} data-attempts={attempts} {...formProps}>
      {children}
    </form>
  );
};

const Wizard = ({
  onSubmit,
  onValueChange,
}: {
  onSubmit: OnSubmit;
  onValueChange?: StepperRootProps["onValueChange"];
}) => {
  const form = useForm({
    defaultValues: { account: { email: "" }, newsletter: { topic: "" }, profile: { name: "" } },
    onSubmit,
  });

  return (
    <Stepper.Root
      steps={steps}
      onValueChange={onValueChange}
      onFinish={createStepperFormFinish(form, {
        fieldErrors: (error) =>
          error instanceof Error && error.message === "taken"
            ? { "account.email": "Email is taken" }
            : undefined,
      })}
    >
      <Stepper.List aria-label="Sign up">
        {steps.map((step) => (
          <Stepper.Item key={step.id} value={step.id}>
            <Stepper.Trigger>{step.id}</Stepper.Trigger>
          </Stepper.Item>
        ))}
      </Stepper.List>
      <Stepper.Panel value="account">
        <form.FormGroup name="account">
          {(group) => (
            <StepForm group={group}>
              <form.Field name="account.email" validators={{ onChange: required }}>
                {(field) => <TextInput field={field} label="Email" />}
              </form.Field>
            </StepForm>
          )}
        </form.FormGroup>
      </Stepper.Panel>
      <Stepper.Panel value="newsletter">
        <form.FormGroup name="newsletter">
          {(group) => (
            <StepForm group={group}>
              <form.Field name="newsletter.topic">
                {(field) => <TextInput field={field} label="Topic" />}
              </form.Field>
            </StepForm>
          )}
        </form.FormGroup>
      </Stepper.Panel>
      <Stepper.Panel value="profile">
        <form.FormGroup name="profile">
          {(group) => (
            <StepForm group={group}>
              <form.Field name="profile.name" validators={{ onChange: required }}>
                {(field) => <TextInput field={field} label="Name" />}
              </form.Field>
            </StepForm>
          )}
        </form.FormGroup>
      </Stepper.Panel>
      <Stepper.Previous>Back</Stepper.Previous>
      <Stepper.Next>Next</Stepper.Next>
    </Stepper.Root>
  );
};

const statusOf = (name: string) =>
  screen.getByRole("button", { name: new RegExp(`^${name}`, "u") }).dataset.status;

describe("Stepper with TanStack Form", () => {
  it("validates the current group, marks it invalid and focuses the first invalid field", async () => {
    const user = userEvent.setup();

    render(<Wizard onSubmit={vi.fn<OnSubmit>()} />);
    await user.click(screen.getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText("Email"));
    });

    expect({
      error: screen.getByText("Required").textContent,
      invalid: Object.hasOwn(screen.getByRole("button", { name: /^account/u }).dataset, "invalid"),
    }).toStrictEqual({ error: "Required", invalid: true });

    // Fixing the field clears the step's error mark before Next is pressed again.
    await user.type(screen.getByLabelText("Email"), "a@b.co");

    expect(screen.getByRole("button", { name: /^account/u }).dataset.invalid).toBeUndefined();
  });

  it("counts each rejected Next as a submit of the step's group", async () => {
    const user = userEvent.setup();

    render(<Wizard onSubmit={vi.fn<OnSubmit>()} />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByText("Required");
    await user.click(screen.getByRole("button", { name: "Next" }));

    // Fields replay their rejected-submit shake from this count.
    await waitFor(() => {
      expect(screen.getByRole("form", { name: "account form" }).dataset.attempts).toBe("2");
    });
  });

  it("moves on Enter, skips an untouched optional step, and reopens a step edited after completion", async () => {
    const user = userEvent.setup();

    render(<Wizard onSubmit={vi.fn<OnSubmit>()} />);
    await user.type(screen.getByLabelText("Email"), "a@b.co{Enter}");
    await screen.findByLabelText("Topic");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByLabelText("Name");

    expect({ account: statusOf("account"), newsletter: statusOf("newsletter") }).toStrictEqual({
      account: "complete",
      newsletter: "skipped",
    });

    await user.click(screen.getByRole("button", { name: /^account/u }));
    await user.type(screen.getByLabelText("Email"), "m");

    // Editing the email reopens the account step and every step after it.
    expect({ newsletter: statusOf("newsletter"), profile: statusOf("profile") }).toStrictEqual({
      newsletter: "pending",
      profile: "pending",
    });
  });

  it("returns to the step a server error belongs to when the final submit fails", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<NonNullable<StepperRootProps["onValueChange"]>>();

    const onSubmit = vi.fn<OnSubmit>(() => {
      throw new Error("taken");
    });

    render(<Wizard onSubmit={onSubmit} onValueChange={onValueChange} />);
    await user.type(screen.getByLabelText("Email"), "a@b.co{Enter}");
    await screen.findByLabelText("Topic");
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.type(await screen.findByLabelText("Name"), "Ada");

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "Next" }));
    });

    await screen.findByLabelText("Email");

    expect({
      calls: onSubmit.mock.calls.length,
      error: screen.getByText("Email is taken").textContent,
      reason: onValueChange.mock.calls.at(-1)?.[1].reason,
    }).toStrictEqual({ calls: 1, error: "Email is taken", reason: "finish-failed" });
  });
});
