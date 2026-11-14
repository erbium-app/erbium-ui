import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import type { QuestionnaireItemDefinition } from "@shadcn/react/questionnaire";
import { revalidateLogic, useSelector } from "@tanstack/react-form";
import type { AnyFormApi } from "@tanstack/react-form";
import { extendForm, formContext, useFieldContext, visibleMessages } from "./form";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { animateHeight } from "../lib/animate-height";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import type { Button } from "./button";
import { Kbd } from "./kbd";
import { Icon } from "./icon";
import { StatefulButton } from "./stateful-button";
import type { StatefulButtonProps } from "./stateful-button";
import { StepIndicator } from "../blocks/step-indicator";

// Eases to the next question's height, so the actions below it do not jump between questions.
const Questionnaire = ({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) => (
  <QuestionnairePrimitive.Root
    ref={useMergedRefs(ref, animateHeight)}
    data-slot="questionnaire"
    className={cn("flex w-full min-w-0 flex-col gap-group", className)}
    {...props}
  />
);

const QuestionnaireStepIndicator = ({
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
  >) => (
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
              "aria-valuemax": undefined,
              "aria-valuemin": undefined,
              "aria-valuenow": undefined,
              "aria-valuetext": undefined,
              role: "group",
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

// Eases to make room for its error.
const QuestionnaireItem = ({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) => (
  <QuestionnairePrimitive.Item
    ref={useMergedRefs(ref, animateHeight)}
    data-slot="questionnaire-item"
    className={cn("flex min-w-0 flex-col gap-group border-0 p-0 outline-none", className)}
    {...props}
  />
);

const QuestionnaireTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) => (
  <QuestionnairePrimitive.Title
    data-slot="questionnaire-title"
    className={cn(
      "text-subtitle text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
      className,
    )}
    {...props}
  />
);

const QuestionnaireDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) => (
  <QuestionnairePrimitive.Description
    data-slot="questionnaire-description"
    className={cn("text-caption text-pretty text-muted-foreground", className)}
    {...props}
  />
);

const QuestionnaireChoices = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) => (
  <QuestionnairePrimitive.Choices
    data-slot="questionnaire-choices"
    className={cn("group/questionnaire-choices grid min-w-0 gap-related", className)}
    {...props}
  />
);

const QuestionnaireChoice = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) => (
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

const QuestionnaireChoiceDescription = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="questionnaire-choice-description"
    className={cn("text-muted-foreground", className)}
    {...props}
  />
);

const QuestionnaireInput = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) => (
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

const QuestionnaireError = ({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) => (
  <QuestionnairePrimitive.Error
    data-slot="questionnaire-error"
    className={cn(
      "mt-2 text-caption text-error transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none",
      className,
    )}
    {...props}
  />
);

const QuestionnaireActions = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="questionnaire-actions"
    className={cn(
      "grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-related",
      className,
    )}
    {...props}
  />
);

const QuestionnairePrevious = ({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => (
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

const QuestionnaireSkip = ({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => (
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

const QuestionnaireNext = ({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => (
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

const QuestionnaireSubmit = ({
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
  Pick<StatefulButtonProps, "state" | "successLabel" | "successDuration" | "onStateChange">) => (
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

/*
 * Questionnaire answers owned by TanStack Form and validated with Effect
 * Schema. Each `form.AppField` wraps one `QuestionnaireItem`; its choices are
 * controlled by the field's value, so the schema validates exactly what the
 * user sees. A rejected submit returns to the first item with an error.
 */

const useFieldMessages = () => {
  const field = useFieldContext<unknown>();
  const meta = useSelector(field.store, (state) => state.meta);

  return React.useMemo(() => visibleMessages(meta), [meta]);
};

/** `QuestionnaireItem` named after the field and invalid while it shows errors. */
const QuestionnaireFieldItem = (
  props: Omit<React.ComponentProps<typeof QuestionnaireItem>, "invalid" | "name">,
) => {
  const field = useFieldContext<unknown>();
  const messages = useFieldMessages();

  return <QuestionnaireItem name={field.name} invalid={messages.length > 0} {...props} />;
};

/** A `multiple` item's field holds every chosen value. */
const isChoiceList = (value: string | readonly string[]): value is readonly string[] =>
  Array.isArray(value);

/**
 * `QuestionnaireChoice` controlled by the field: a string field holds the
 * chosen value of a single-choice item, a string array the chosen values of a
 * `multiple` item.
 */
const QuestionnaireFieldChoice = ({
  value,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnaireChoice>, "checked" | "defaultChecked">) => {
  const field = useFieldContext<string | readonly string[]>();
  const current = field.state.value;

  return (
    <QuestionnaireChoice
      value={value}
      checked={isChoiceList(current) ? current.includes(value) : current === value}
      onChange={(event) => {
        const { checked } = event.target;

        if (!isChoiceList(current)) {
          field.handleChange(value);

          return;
        }

        field.handleChange(
          checked ? [...current, value] : current.filter((chosen) => chosen !== value),
        );
      }}
      {...props}
    />
  );
};

/**
 * `QuestionnaireError` showing the field's messages, e.g. an Effect Schema
 * refinement. Without one it keeps the questionnaire's own "Choose an answer"
 * message for an unanswered item.
 */
const QuestionnaireFieldError = (
  props: Omit<React.ComponentProps<typeof QuestionnaireError>, "children">,
) => {
  const messages = useFieldMessages();

  return (
    <QuestionnaireError {...props}>
      {messages.length > 0 ? messages.join(" ") : undefined}
    </QuestionnaireError>
  );
};

const firstEnabledItem = (items: readonly QuestionnaireItemDefinition[]) =>
  items.find((item) => item.disabled !== true)?.name ?? "";

type QuestionnaireFormProps = Omit<
  React.ComponentProps<typeof Questionnaire>,
  "item" | "items" | "noValidate"
> & {
  form: AnyFormApi;
  /** Item order decides which invalid item a rejected submit returns to. */
  items: readonly QuestionnaireItemDefinition[];
  /** The visible item. Uncontrolled when omitted. */
  item?: string;
};

/**
 * `Questionnaire` that submits through TanStack Form. After a rejected submit
 * it shows the first item, in `items` order, whose field has an error.
 */
const QuestionnaireForm = ({
  defaultItem,
  form,
  item: itemProp,
  items,
  onItemChange,
  onSubmit,
  ...props
}: QuestionnaireFormProps) => {
  const [uncontrolledItem, setUncontrolledItem] = React.useState(
    () => defaultItem ?? firstEnabledItem(items),
  );

  const item = itemProp ?? uncontrolledItem;

  const changeItem = (nextItem: string) => {
    setUncontrolledItem(nextItem);
    onItemChange?.(nextItem);
  };

  const submit = async () => {
    await form.handleSubmit();

    const invalid = items.find(
      (definition) => (form.getFieldMeta(definition.name)?.errors.length ?? 0) > 0,
    );

    if (invalid) {
      changeItem(invalid.name);
    }
  };

  return (
    <formContext.Provider value={form}>
      <Questionnaire
        item={item}
        items={items}
        onItemChange={changeItem}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onSubmit?.(event);
          void submit();
        }}
        {...props}
      />
    </formContext.Provider>
  );
};

const { useAppForm: useBaseQuestionnaireForm } = extendForm({
  fieldComponents: {
    QuestionnaireChoice: QuestionnaireFieldChoice,
    QuestionnaireError: QuestionnaireFieldError,
    QuestionnaireItem: QuestionnaireFieldItem,
  },
});

/**
 * `useAppForm` with the questionnaire field components added:
 * `field.QuestionnaireItem`, `field.QuestionnaireChoice` and
 * `field.QuestionnaireError`. Validation defaults to `revalidateLogic()`.
 */
const useQuestionnaireForm: typeof useBaseQuestionnaireForm = (options) =>
  useBaseQuestionnaireForm({ validationLogic: revalidateLogic(), ...options });

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
  QuestionnaireFieldChoice,
  QuestionnaireFieldError,
  QuestionnaireFieldItem,
  QuestionnaireForm,
  useQuestionnaireForm,
};
