import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vite-plus/test";
import { Stepper, useStepperGuard } from "./index";
import type { StepperFinish, StepperGuard, StepperRootProps } from "./index";

const steps = [
  { id: "account", title: "Account" },
  { id: "extras", optional: true, title: "Extras" },
  { id: "review", review: true, title: "Review" },
];

type OnValueChange = NonNullable<StepperRootProps["onValueChange"]>;

/** A promise the test settles, so it can look at a move while its guard runs. */
const deferred = <T,>() => {
  const resolvers: ((value: T) => void)[] = [];

  // oxlint-disable-next-line promise/avoid-new -- the test resolves the guard by hand; ES2023 has no Promise.withResolvers.
  const promise = new Promise<T>((resolve) => {
    resolvers.push(resolve);
  });

  const settle = (value: T) => {
    for (const resolve of resolvers) {
      resolve(value);
    }
  };

  return { promise, settle };
};

/** Settles `gate` inside `act`, then waits for the stepper to apply the outcome. */
const settleGuard = async <T,>(gate: ReturnType<typeof deferred<T>>, value: T) => {
  await act(async () => {
    gate.settle(value);
    await gate.promise;
  });
};

const Flow = ({ children, ...props }: Partial<StepperRootProps>) => (
  <Stepper.Root steps={steps} {...props}>
    <Stepper.List aria-label="Checkout">
      {steps.map((step) => (
        <Stepper.Item key={step.id} value={step.id}>
          <Stepper.Trigger>
            <Stepper.Indicator />
            <Stepper.Title>{step.title}</Stepper.Title>
          </Stepper.Trigger>
        </Stepper.Item>
      ))}
    </Stepper.List>
    {steps.map((step) => (
      <Stepper.Panel key={step.id} value={step.id}>
        {step.title} panel
      </Stepper.Panel>
    ))}
    {children}
    <Stepper.Previous>Back</Stepper.Previous>
    <Stepper.Skip>Skip</Stepper.Skip>
    <Stepper.Next>Next</Stepper.Next>
    <Stepper.Announcer />
  </Stepper.Root>
);

/** Registers a guard for the account step that always reports an issue. */
const BlockingAccount = () => {
  useStepperGuard("account", () => ({ issues: ["Email is taken"], status: "invalid" }));

  return null;
};

const statusOf = (name: RegExp) => screen.getByRole("button", { name }).dataset.status;

describe("Stepper parts", () => {
  it("starts on the first step with nowhere to go back to", () => {
    render(<Flow />);

    expect({
      back: screen.getByRole("button", { name: "Back" }).getAttribute("aria-disabled"),
      panel: screen.getByText("Account panel").textContent,
      skip: screen.queryByRole("button", { name: "Skip" }),
    }).toStrictEqual({ back: "true", panel: "Account panel", skip: null });
  });

  it("moves through the flow, marks each step and announces the new one", async () => {
    const user = userEvent.setup();
    const onFinish = vi.fn<StepperFinish>();
    const onValueChange = vi.fn<OnValueChange>();

    render(<Flow onFinish={onFinish} onValueChange={onValueChange} />);
    await user.click(screen.getByRole("button", { name: "Next" }));

    expect({
      account: statusOf(/Account/u),
      announced: screen.getByRole("status").textContent,
      panel: screen.getByText("Extras panel").textContent,
    }).toStrictEqual({ account: "complete", announced: "Step 2 of 3", panel: "Extras panel" });

    await user.click(screen.getByRole("button", { name: "Skip" }));

    const extras = screen.getByRole("button", { name: /Extras/u });

    expect({
      current: screen.getByRole("button", { name: /Review/u }).getAttribute("aria-current"),
      name: extras.textContent,
      status: extras.dataset.status,
    }).toStrictEqual({ current: "step", name: "2Extras, skipped, optional", status: "skipped" });

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect({
      changes: onValueChange.mock.calls.map(([value, details]) => [value, details.reason]),
      finished: onFinish.mock.calls.length,
    }).toStrictEqual({
      changes: [
        ["extras", "next"],
        ["review", "skip"],
      ],
      finished: 1,
    });
  });

  it("keeps a completed step's resolution when the user goes back to it", async () => {
    const user = userEvent.setup();

    render(<Flow />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    const account = screen.getByRole("button", { name: /Account/u });

    expect({
      resolution: account.dataset.resolution,
      status: account.dataset.status,
    }).toStrictEqual({ resolution: "complete", status: "current" });
  });

  it("keeps a move pending while its guard runs and ignores a second click", async () => {
    const user = userEvent.setup();
    const gate = deferred<boolean>();
    const guard = vi.fn<StepperGuard>(async () => await gate.promise);

    render(<Flow guard={guard} />);

    const next = screen.getByRole("button", { name: "Next" });

    await user.click(next);
    await user.click(next);

    expect({ busy: next.getAttribute("aria-busy"), calls: guard.mock.calls.length }).toStrictEqual({
      busy: "true",
      calls: 1,
    });

    await settleGuard(gate, false);

    expect({
      invalid: Object.hasOwn(screen.getByRole("button", { name: /Account/u }).dataset, "invalid"),
      panel: screen.getByText("Account panel").textContent,
    }).toStrictEqual({ invalid: true, panel: "Account panel" });
  });

  it("lets a step's own guard replace the root's", async () => {
    const user = userEvent.setup();

    render(
      <Flow guard={() => true}>
        <BlockingAccount />
      </Flow>,
    );

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Account panel")).toBeTruthy();
  });

  it("refuses a controlled value the flow cannot reach", () => {
    const onValueChange = vi.fn<OnValueChange>();

    render(<Flow value="review" onValueChange={onValueChange} />);

    expect(screen.getByText("Account panel")).toBeTruthy();
    expect(onValueChange).toHaveBeenCalledWith("account", {
      from: "review",
      reason: "unreachable",
    });
  });

  it("lets a click handler cancel navigation", async () => {
    const user = userEvent.setup();

    render(
      <Stepper.Root steps={steps} navigation="free">
        <Stepper.Next
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Next
        </Stepper.Next>
        <Stepper.Panel value="account">Account panel</Stepper.Panel>
      </Stepper.Root>,
    );

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Account panel")).toBeTruthy();
  });

  it("keeps a guard running when the steps array is recreated with the same steps", async () => {
    const user = userEvent.setup();
    const gate = deferred<boolean>();

    const Rerendering = () => {
      const [, setTick] = React.useState(0);

      return (
        <Stepper.Root
          steps={steps.map((step) => ({ ...step }))}
          guard={async () => await gate.promise}
        >
          <button
            type="button"
            onClick={() => {
              setTick((tick) => tick + 1);
            }}
          >
            Rerender
          </button>
          <Stepper.Next>Next</Stepper.Next>
          <Stepper.Panel value="extras">Extras panel</Stepper.Panel>
        </Stepper.Root>
      );
    };

    render(<Rerendering />);
    await user.click(screen.getByRole("button", { name: "Next" }));
    await user.click(screen.getByRole("button", { name: "Rerender" }));
    await settleGuard(gate, true);

    expect(screen.getByText("Extras panel")).toBeTruthy();
  });

  it("renders on the server", () => {
    expect(renderToString(<Flow />)).toContain('aria-current="step"');
  });
});
