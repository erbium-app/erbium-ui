import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { cn } from "../lib/utils";
import { buttonVariants, type Button } from "./button";
import { Kbd } from "./kbd";
import { Icon } from "./icon";
import { StatefulButton, type StatefulButtonProps } from "./stateful-button";
import { StepIndicator } from "../blocks/step-indicator";

function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cn("flex w-full min-w-0 flex-col gap-group", className)}
      {...props}
    />
  );
}

function QuestionnaireStepIndicator({
  className,
  onValueChange,
  reach,
  orientation,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnairePrimitive.Progress>, "render" | "children"> &
  Pick<
    React.ComponentProps<typeof StepIndicator>,
    "aria-label" | "onValueChange" | "orientation" | "reach"
  >) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-step-indicator"
      className={cn("w-fit", className)}
      render={(progressProps, state) => (
        <div
          {...progressProps}
          // A progressbar hides its descendants from assistive tech, which would
          // hide the step buttons. Interactive indicators are a plain group.
          {...(onValueChange
            ? {
                role: "group",
                "aria-valuemax": undefined,
                "aria-valuemin": undefined,
                "aria-valuenow": undefined,
                "aria-valuetext": undefined,
              }
            : {})}
        >
          <StepIndicator
            count={state.total}
            value={state.current - 1}
            onValueChange={onValueChange}
            reach={reach}
            orientation={orientation}
            aria-label={ariaLabel ?? `Question ${state.current} of ${state.total}`}
          />
        </div>
      )}
      {...props}
    />
  );
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cn("flex min-w-0 flex-col gap-group border-0 p-0 outline-none", className)}
      {...props}
    />
  );
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "text-subtitle text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className,
      )}
      {...props}
    />
  );
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cn("text-caption text-pretty text-muted-foreground", className)}
      {...props}
    />
  );
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cn("group/questionnaire-choices grid min-w-0 gap-related", className)}
      {...props}
    />
  );
}

function QuestionnaireChoice({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      className={cn(
        "group/questionnaire-choice relative flex min-h-control-touch cursor-pointer items-start gap-2.5 rounded-lg border border-input bg-transparent px-3 py-2.5 text-start text-caption transition-[color,background-color,border-color,box-shadow] outline-none select-none hover:bg-muted-hover has-[>input:focus-visible]:border-ring data-invalid:border-error data-invalid:ring-[1.5px] data-invalid:ring-invalid-halo data-invalid:has-[>input:focus-visible]:border-error data-invalid:data-checked:border-error dark:bg-input/20 dark:data-invalid:border-invalid dark:data-invalid:has-[>input:focus-visible]:border-invalid dark:data-invalid:data-checked:border-invalid data-checked:border-selection/40 data-checked:bg-muted dark:data-checked:bg-muted",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-lg border border-input group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[type=radio]/questionnaire-choice:rounded-full group-data-[type=radio]/questionnaire-choice:[corner-shape:round] group-data-checked/questionnaire-choice:border-selection group-data-checked/questionnaire-choice:bg-selection group-data-checked/questionnaire-choice:text-selection-foreground dark:bg-input/30 dark:group-data-checked/questionnaire-choice:bg-selection"
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="hidden size-2 rounded-full bg-selection-foreground group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
        />
        <Icon
          name="check"
          data-slot="questionnaire-choice-indicator-check"
          className="hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 "
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-slot="questionnaire-choice-shortcut"
        render={<Kbd />}
        className="ms-auto hidden shrink-0 translate-y-[--spacing(0.45)] group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-shortcut/questionnaire-choice:inline-flex"
      />
    </QuestionnairePrimitive.Choice>
  );
}

function QuestionnaireChoiceDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cn(
          "min-h-control-touch w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-field transition-[color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo pointer-fine:min-h-control dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-invalid",
          "selection:bg-selection selection:text-selection-foreground placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cn("mt-2 text-caption text-error", className)}
      {...props}
    />
  );
}

function QuestionnaireActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-related",
        className,
      )}
      {...props}
    />
  );
}

function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-1 row-start-1 justify-self-start",
        className,
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  );
}

function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-2 row-start-1 justify-self-end",
        className,
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  );
}

function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      className={cn(
        buttonVariants({ size, variant }),
        "col-start-3 row-start-1 justify-self-end",
        className,
      )}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  );
}

function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  state,
  successLabel,
  successDuration,
  onStateChange,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnairePrimitive.Submit>, "render"> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant"> &
  Pick<StatefulButtonProps, "state" | "successLabel" | "successDuration" | "onStateChange">) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      className={cn("col-start-3 row-start-1 justify-self-end", className)}
      render={
        <StatefulButton
          size={size}
          variant={variant}
          state={state}
          successLabel={successLabel}
          successDuration={successDuration}
          onStateChange={onStateChange}
        >
          {children ?? "Submit"}
        </StatefulButton>
      }
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  );
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSkip,
  QuestionnaireStepIndicator,
  QuestionnaireSubmit,
  QuestionnaireTitle,
};
