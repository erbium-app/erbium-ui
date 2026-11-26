import * as React from "react";
import {
  Stepper as StepperPrimitive,
  useStepperFormGroup,
  useStepperItem,
  useStepperSelector,
} from "@erbium-ui/react/stepper";
import type {
  StepperFormGroup,
  StepperFormGroupOptions,
  StepperNextState,
  StepperStep,
} from "@erbium-ui/react/stepper";
import { StepIndicatorDot } from "../blocks/step-indicator";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";
import { FormGroupSubmitContext } from "./form";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

/**
 * Erbium's stepper: the @erbium-ui/react stepper primitive with the design. Steps are an ordered
 * list of buttons, the current one `aria-current="step"`; the root announces each new step.
 */
const Stepper = ({
  className,
  children,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Root>) => (
  <StepperPrimitive.Root
    data-slot="stepper"
    orientation={orientation}
    className={cn("group/stepper flex w-full min-w-0 flex-col gap-section", className)}
    {...props}
  >
    {children}
    <StepperPrimitive.Announcer />
  </StepperPrimitive.Root>
);

const StepperList = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.List>) => (
  <StepperPrimitive.List
    data-slot="stepper-list"
    className={cn(
      "m-0 flex list-none p-0",
      "data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:gap-related",
      "data-[orientation=vertical]:flex-col",
      className,
    )}
    {...props}
  />
);

const StepperItem = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Item>) => (
  <StepperPrimitive.Item
    data-slot="stepper-item"
    className={cn(
      "group/step flex min-w-0",
      // Horizontal steps share the row; the separator after each one takes the slack.
      "group-data-[orientation=horizontal]/stepper:flex-1 group-data-[orientation=horizontal]/stepper:items-center group-data-[orientation=horizontal]/stepper:gap-related group-data-[orientation=horizontal]/stepper:last:flex-none",
      "group-data-[orientation=vertical]/stepper:flex-col",
      // Narrow screens keep every mark but only the current step's text, which stays readable.
      "max-sm:group-data-[orientation=horizontal]/stepper:[&:not([data-status=current])_[data-slot=stepper-text]]:sr-only",
      className,
    )}
    {...props}
  />
);

const StepperTrigger = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Trigger>) => (
  <StepperPrimitive.Trigger
    data-slot="stepper-trigger"
    className={cn(
      "touch-target flex min-w-0 items-center gap-related rounded-lg p-1 text-start outline-none",
      "transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none",
      "not-aria-disabled:not-aria-[current=step]:hover:bg-muted",
      "aria-disabled:cursor-not-allowed aria-[current=step]:cursor-default",
      className,
    )}
    {...props}
  />
);

/** The mark's default content: a check, a dash, an alert or the step's number. */
const IndicatorContent = () => {
  const item = useStepperItem();

  if (item.pending) {
    return <Spinner size="xs" />;
  }

  if (item.invalid) {
    return <Icon name="triangle-alert" className="size-3.5" />;
  }

  if (item.status === "complete") {
    return <Icon name="check" className="size-3.5" />;
  }

  if (item.status === "skipped") {
    return <Icon name="minus" className="size-3.5" />;
  }

  return item.position;
};

const StepperIndicator = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Indicator>) => (
  <StepperPrimitive.Indicator
    data-slot="stepper-indicator"
    className={cn(
      "flex size-7 shrink-0 items-center justify-center rounded-full border text-control-sm tabular-nums",
      "transition-colors duration-150 motion-reduce:transition-none",
      "border-border text-muted-foreground",
      "data-[status=current]:border-foreground data-[status=current]:text-foreground",
      "data-[status=complete]:border-transparent data-[status=complete]:bg-primary data-[status=complete]:text-primary-foreground",
      // Skipped reads as a dashed ring with a dash, not only a colour.
      "data-[status=skipped]:border-dashed",
      "data-invalid:border-error data-invalid:bg-transparent data-invalid:text-error",
      className,
    )}
    {...props}
  >
    {children ?? <IndicatorContent />}
  </StepperPrimitive.Indicator>
);

/** Holds the title and description beside the mark. */
const StepperText = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span data-slot="stepper-text" className={cn("flex min-w-0 flex-col", className)} {...props} />
);

const StepperTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Title>) => (
  <StepperPrimitive.Title
    data-slot="stepper-title"
    className={cn(
      "truncate text-control-sm text-muted-foreground",
      "data-invalid:text-error data-[status=complete]:text-foreground data-[status=current]:text-foreground",
      className,
    )}
    {...props}
  />
);

const StepperDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Description>) => (
  <StepperPrimitive.Description
    data-slot="stepper-description"
    className={cn("truncate text-metadata text-muted-foreground", className)}
    {...props}
  />
);

/**
 * "Optional" beside an optional step's title. The trigger already announces it, so this copy is
 * hidden from assistive technology.
 */
const StepperOptional = ({
  className,
  children = "Optional",
  ...props
}: React.ComponentProps<"span">) => {
  const item = useStepperItem();

  return item.optional ? (
    <span
      aria-hidden="true"
      data-slot="stepper-optional"
      className={cn("text-control-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </span>
  ) : null;
};

const StepperSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Separator>) => (
  <StepperPrimitive.Separator
    data-slot="stepper-separator"
    className={cn(
      "shrink-0 rounded-full bg-border transition-colors duration-200 motion-reduce:transition-none",
      // Filled from what was done, not where the user is, so going back keeps the line whole.
      "data-[resolution=complete]:bg-primary data-[resolution=skipped]:bg-primary/40",
      "group-data-[orientation=horizontal]/stepper:h-px group-data-[orientation=horizontal]/stepper:min-w-4 group-data-[orientation=horizontal]/stepper:flex-1",
      // Centred under the mark: half the 1.75rem mark plus the trigger's padding.
      "group-data-[orientation=vertical]/stepper:ms-[calc(0.875rem+0.25rem)] group-data-[orientation=vertical]/stepper:min-h-4 group-data-[orientation=vertical]/stepper:w-px",
      "group-last/step:hidden",
      className,
    )}
    {...props}
  />
);

/**
 * Content under a step in a vertical stepper. Its start border is the connector, so it fills
 * from the step's resolution as the separator does.
 */
const StepperContent = ({ className, ...props }: React.ComponentProps<"div">) => {
  const item = useStepperItem();

  return (
    <div
      data-slot="stepper-content"
      data-resolution={item.resolution}
      className={cn(
        "ms-[calc(0.875rem+0.25rem)] border-s border-border ps-[calc(0.875rem+0.25rem+var(--spacing)*2)] pb-4",
        "group-last/step:border-transparent data-[resolution=complete]:border-primary data-[resolution=skipped]:border-primary/40",
        className,
      )}
      {...props}
    />
  );
};

const StepperPanel = ({
  className,
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Panel>) => (
  <StepperPrimitive.Panel
    data-slot="stepper-panel"
    className={cn("min-w-0 outline-none", className)}
    {...props}
  />
);

/** The step indicator's dot, drawn for the surrounding step. */
const StepperDot = () => <StepIndicatorDot orientation={useStepperItem().orientation} />;

const stepNumber = (_step: StepperStep, position: number) => `Step ${position}`;

type StepperDotsProps = Omit<React.ComponentProps<typeof StepperPrimitive.List>, "children"> & {
  /** Each step's accessible name, before its status. @default "Step 1", "Step 2", … */
  label?: (step: StepperStep, position: number) => string;
};

/**
 * The flow as the step indicator's dots, for a compact stepper such as a questionnaire's. Each
 * enabled step is a dot: the current one stretches into a pill, done ones fill, and one the flow
 * cannot reach yet is blocked. Give it an `aria-label` that names the sequence.
 */
const StepperDots = ({
  className,
  label = stepNumber,
  "aria-label": ariaLabel = "Progress",
  ...props
}: StepperDotsProps) => {
  const steps = useStepperSelector((view) => view.flow.enabled);

  return (
    <StepperPrimitive.List
      data-slot="stepper-dots"
      aria-label={ariaLabel}
      className={cn(
        "m-0 flex w-fit list-none items-center p-0 [--step-direction:1] [--step-progress:1] rtl:[--step-direction:-1]",
        "data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => (
        <StepperPrimitive.Item key={step.id} value={step.id} className="flex">
          <StepperPrimitive.Trigger
            data-slot="stepper-dot"
            className={cn(
              "group/step relative flex items-center justify-center rounded-full p-1.5 outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "not-aria-disabled:not-aria-[current=step]:cursor-pointer not-aria-disabled:not-aria-[current=step]:hover:bg-foreground/10",
              "aria-disabled:cursor-not-allowed aria-[current=step]:cursor-default",
            )}
          >
            <StepperDot />
            <span className="sr-only">{label(step, index + 1)}</span>
          </StepperPrimitive.Trigger>
        </StepperPrimitive.Item>
      ))}
    </StepperPrimitive.List>
  );
};

/** The row of Previous, Skip and Next. */
const StepperActions = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="stepper-actions"
    className={cn("flex items-center justify-end gap-related [&>:first-child]:me-auto", className)}
    {...props}
  />
);

const controlClassName = (variant: "default" | "outline" | "ghost", className?: string) =>
  cn(
    buttonVariants({ variant }),
    // A pending control keeps full strength: it is busy, not unavailable.
    "data-pending:opacity-100",
    className,
  );

const StepperPrevious = ({
  className,
  children = "Back",
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Previous>) => (
  <StepperPrimitive.Previous
    data-slot="stepper-previous"
    // On the first step there is nowhere to go back to, so the button keeps its place unseen.
    className={controlClassName("outline", cn("data-[blocked=first]:invisible", className))}
    {...props}
  >
    {children}
  </StepperPrimitive.Previous>
);

const StepperSkip = ({
  className,
  children = "Skip",
  ...props
}: React.ComponentProps<typeof StepperPrimitive.Skip>) => (
  <StepperPrimitive.Skip
    data-slot="stepper-skip"
    className={controlClassName("ghost", className)}
    {...props}
  >
    {children}
  </StepperPrimitive.Skip>
);

type StepperNextProps = React.ComponentProps<typeof StepperPrimitive.Next> & {
  /** The label on the last step, where Next finishes. @default "Finish" */
  finishLabel?: React.ReactNode;
};

/** Next, or Finish on the last step. It shows a spinner while the step is checked. */
const StepperNext = ({
  className,
  children = "Next",
  finishLabel = "Finish",
  ...props
}: StepperNextProps) => {
  const { finishes, pending } = useStepperSelector(
    (view): Pick<StepperNextState, "finishes" | "pending"> => ({
      finishes: view.state.current === view.flow.last,
      pending: view.state.phase.type === "guarding" || view.state.phase.type === "finishing",
    }),
    (a, b) => a.finishes === b.finishes && a.pending === b.pending,
  );

  return (
    <StepperPrimitive.Next
      data-slot="stepper-next"
      data-loading={pending ? "" : undefined}
      className={controlClassName("default", className)}
      {...props}
    >
      {pending ? <Spinner size="sm" /> : null}
      {finishes ? finishLabel : children}
    </StepperPrimitive.Next>
  );
};

type StepperFormProps = Omit<React.ComponentProps<"form">, "noValidate" | "onSubmit" | "ref"> &
  StepperFormGroupOptions & {
    /** The step's `form.FormGroup`, named after the step. */
    group: StepperFormGroup;
  };

/**
 * A step's form, bound to its TanStack `FormGroup`. Next and Enter submit the group, the step
 * passes when the group is valid, and its fields shake on a rejected Next as on a rejected submit.
 */
const StepperForm = ({
  group,
  step,
  isEmpty,
  invalidateOnEdit,
  focusInvalid,
  className,
  ...props
}: StepperFormProps) => {
  const { attempts, formProps, submitting } = useStepperFormGroup(group, {
    focusInvalid,
    invalidateOnEdit,
    isEmpty,
    step,
  });

  const submit = React.useMemo(() => ({ attempts, submitting }), [attempts, submitting]);

  return (
    <FormGroupSubmitContext value={submit}>
      <form
        data-slot="stepper-form"
        className={cn("flex flex-col gap-group", className)}
        {...formProps}
        {...props}
      />
    </FormGroupSubmitContext>
  );
};

export {
  Stepper,
  StepperActions,
  StepperContent,
  StepperDescription,
  StepperDots,
  StepperForm,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperOptional,
  StepperPanel,
  StepperPrevious,
  StepperSeparator,
  StepperSkip,
  StepperText,
  StepperTitle,
  StepperTrigger,
};

export { createStepperFormFinish, useStepper, useStepperItem } from "@erbium-ui/react/stepper";

export type { StepperDotsProps, StepperFormProps, StepperNextProps };

export type { StepperChangeDetails, StepperGuard, StepperStep } from "@erbium-ui/react/stepper";
