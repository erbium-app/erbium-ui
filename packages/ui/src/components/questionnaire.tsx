import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import type { QuestionnaireItemDefinition } from "@shadcn/react/questionnaire";
import { revalidateLogic, useSelector } from "@tanstack/react-form";
import type { AnyFormApi } from "@tanstack/react-form";
import { extendForm, formContext, useFieldContext, visibleMessages } from "./form";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { animateHeight } from "../lib/animate-height";
import { shake } from "../lib/shake";
import { FieldRequiredContext, RequiredMark, useFieldRequired } from "./field";
import {
  checkboxClassName,
  choiceCardClassName,
  radioClassName,
  radioDotClassName,
} from "../lib/choice-styles";
import { inputClassName } from "../lib/form-control-styles";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import type { Button } from "./button";
import { Kbd } from "./kbd";
import { CheckboxStateIcon } from "./stateful-icon";
import { StatefulButton } from "./stateful-button";
import type { StatefulButtonProps } from "./stateful-button";
import { StepIndicator } from "../blocks/step-indicator";

const QuestionnaireItemsContext = React.createContext<
  readonly QuestionnaireItemDefinition[] | undefined
>(undefined);

interface QuestionnaireNavigation {
  /** Shows the enabled item at this zero-based position, as Next and Previous do. */
  go: (index: number) => void;
  /** Furthest position shown so far. */
  reach: number;
  visit: (index: number) => void;
}

const QuestionnaireNavigationContext = React.createContext<QuestionnaireNavigation | null>(null);

const ROOT = '[data-slot="questionnaire"]';
const ITEM = '[data-slot="questionnaire-item"]';
const ANSWERS = '[data-slot="questionnaire-choices"], [data-slot="questionnaire-input-wrapper"]';

const activeItem = (root: Element) => root.querySelector(`${ITEM}:not([hidden])`);

// One rejection can be reported twice (a click and its submit, or the questionnaire and the form).
const lastShake = new WeakMap<Element, number>();

/**
 * Shakes what answers an item, as `FormField` shakes a field's control: its choices or its input,
 * or the item when it has neither.
 */
const shakeAnswers = (item: Element) => {
  const now = performance.now();

  if (now - (lastShake.get(item) ?? Number.NEGATIVE_INFINITY) < 300) {
    return;
  }

  lastShake.set(item, now);

  const answers = [...item.querySelectorAll(ANSWERS)].filter(
    (answer) => answer.closest(ITEM) === item,
  );

  const outermost = answers.filter(
    (answer) => !answers.some((other) => other !== answer && other.contains(answer)),
  );

  for (const target of outermost.length > 0 ? outermost : [item]) {
    shake(target);
  }
};

/**
 * The questionnaire rejects Next, Enter and submit while the item is unanswered, without an event
 * of its own. Each attempt is checked once it has rendered: an item still shown and invalid, or the
 * invalid item a submit returned to, shakes, on every attempt like a rejected form submit.
 */
const useShakeOnRejectedAnswer = (rootRef: React.RefObject<HTMLFormElement | null>) =>
  React.useCallback(
    (submit: boolean) => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const before = activeItem(root);

      requestAnimationFrame(() => {
        const after = activeItem(root);

        if (
          after instanceof HTMLElement &&
          Object.hasOwn(after.dataset, "invalid") &&
          (submit || after === before)
        ) {
          shakeAnswers(after);
        }
      });
    },
    [rootRef],
  );

/**
 * Eases to the next question's height, so the actions below it do not jump between questions, and
 * shakes the answers of a question that cannot be left unanswered.
 */
const Questionnaire = ({
  className,
  item: itemProp,
  items,
  onClick,
  onItemChange,
  onKeyDown,
  onReset,
  onSubmitCapture,
  ref,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) => {
  const rootRef = React.useRef<HTMLFormElement | null>(null);
  const checkAttempt = useShakeOnRejectedAnswer(rootRef);
  // The primitive moves between items only through `item`, so an uncontrolled questionnaire
  // holds it here once it changes, which lets the step indicator jump to any step.
  const [shownItem, setShownItem] = React.useState<string>();
  const [reach, setReach] = React.useState(0);

  const changeItem = React.useCallback(
    (next: string) => {
      if (itemProp === undefined) {
        setShownItem(next);
      }

      onItemChange?.(next);
    },
    [itemProp, onItemChange],
  );

  const visit = React.useCallback((index: number) => {
    setReach((current) => Math.max(current, index));
  }, []);

  const navigation = React.useMemo<QuestionnaireNavigation>(() => {
    // The primitive's order: enabled `items`, or the enabled rendered items without them.
    const order = () => {
      if (items) {
        return items.flatMap((definition) =>
          definition.disabled === true ? [] : [definition.name],
        );
      }

      const root = rootRef.current;

      return [...(root?.querySelectorAll<HTMLFieldSetElement>(ITEM) ?? [])].flatMap((element) =>
        element.closest(ROOT) === root && !element.disabled ? [element.dataset.name ?? ""] : [],
      );
    };

    return {
      go: (index) => {
        const name = order()[index];

        if (name) {
          changeItem(name);
        }
      },
      reach,
      visit,
    };
  }, [changeItem, items, reach, visit]);

  return (
    // Items take `required` from their definition here, so it is declared once.
    <QuestionnaireItemsContext.Provider value={items}>
      <QuestionnaireNavigationContext.Provider value={navigation}>
        <QuestionnairePrimitive.Root
          ref={useMergedRefs(ref, rootRef, animateHeight)}
          item={itemProp ?? shownItem}
          items={items}
          data-slot="questionnaire"
          className={cn("flex w-full min-w-0 flex-col gap-group", className)}
          onItemChange={changeItem}
          onReset={(event) => {
            onReset?.(event);

            if (!event.defaultPrevented) {
              setReach(0);
            }
          }}
          onClick={(event) => {
            onClick?.(event);

            // A jump forward that `QuestionnaireForm` rejects shakes as a rejected Next does.
            if (
              event.target instanceof Element &&
              event.target.closest(
                '[data-slot="questionnaire-next"], [data-slot="step-indicator-control"]',
              )
            ) {
              checkAttempt(false);
            }
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);

            if (event.key === "Enter" && !event.repeat) {
              checkAttempt(false);
            }
          }}
          onSubmitCapture={(event) => {
            onSubmitCapture?.(event);
            checkAttempt(true);
          }}
          {...props}
        />
      </QuestionnaireNavigationContext.Provider>
    </QuestionnaireItemsContext.Provider>
  );
};

interface QuestionnaireStepsProps extends Pick<
  React.ComponentProps<typeof StepIndicator>,
  "aria-label" | "onValueChange" | "orientation" | "reach"
> {
  current: number;
  total: number;
}

const QuestionnaireSteps = ({
  current,
  total,
  onValueChange,
  reach,
  orientation,
  "aria-label": ariaLabel,
}: QuestionnaireStepsProps) => {
  const navigation = React.use(QuestionnaireNavigationContext);
  const index = current - 1;
  const visited = navigation?.reach ?? index;
  const visit = navigation?.visit;

  React.useLayoutEffect(() => {
    if (index > visited) {
      visit?.(index);
    }
  }, [index, visit, visited]);

  return (
    <StepIndicator
      count={total}
      value={index}
      onValueChange={onValueChange ?? navigation?.go}
      // Steps already shown stay free; later ones open as the questionnaire reaches them.
      reach={reach ?? Math.max(visited, index)}
      orientation={orientation}
      aria-label={ariaLabel ?? `Question ${current} of ${total}`}
    />
  );
};

/**
 * The questionnaire's position as step dots. Each step already shown is a button that returns to
 * it; pass `onValueChange` and `reach` to decide navigation in the host instead.
 */
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
  >) => {
  const navigation = React.use(QuestionnaireNavigationContext);
  const interactive = onValueChange !== undefined || navigation !== null;

  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-step-indicator"
      className={cn("w-fit", className)}
      render={(progressProps, state) => (
        <div
          {...progressProps}
          // A progressbar hides its descendants from assistive tech, which would
          // hide the step buttons. Interactive indicators are a plain group.
          {...(interactive
            ? {
                "aria-valuemax": undefined,
                "aria-valuemin": undefined,
                "aria-valuenow": undefined,
                "aria-valuetext": undefined,
                role: "group",
              }
            : {})}
        >
          <QuestionnaireSteps
            current={state.current}
            total={state.total}
            onValueChange={onValueChange}
            reach={reach}
            orientation={orientation}
            aria-label={ariaLabel}
          />
        </div>
      )}
      {...props}
    />
  );
};

/**
 * One question. A question that cannot be skipped is `required`, taken from its definition in the
 * questionnaire's `items` (set `required` here only without `items`): its title shows the required
 * mark, as a required field's label does. It eases to make room for its error.
 */
const QuestionnaireItem = ({
  className,
  name,
  ref,
  required: requiredProp,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) => {
  const definition = React.useContext(QuestionnaireItemsContext)?.find(
    (item) => item.name === name,
  );

  const required = requiredProp ?? definition?.required ?? false;

  return (
    <FieldRequiredContext.Provider value={required}>
      <QuestionnairePrimitive.Item
        ref={useMergedRefs(ref, animateHeight)}
        data-slot="questionnaire-item"
        data-name={name}
        name={name}
        required={required}
        className={cn("flex min-w-0 flex-col gap-group border-0 p-0 outline-none", className)}
        {...props}
      />
    </FieldRequiredContext.Provider>
  );
};

/** The question, as the item's legend. A required item's title ends with the required mark. */
const QuestionnaireTitle = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) => {
  const required = useFieldRequired();

  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cn(
        "text-subtitle text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <>
          {" "}
          <RequiredMark />
        </>
      ) : null}
    </QuestionnairePrimitive.Title>
  );
};

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

interface ChoiceIndicatorProps {
  checked: boolean;
  invalid: boolean;
  type: "checkbox" | "radio";
}

/**
 * Draws Erbium's radio or checkbox for a choice. The choice's native input does the work, so this
 * only mirrors its state onto the shared choice styles and stays out of the accessibility tree.
 */
const ChoiceIndicator = ({ checked, invalid, type }: ChoiceIndicatorProps) => {
  const state = {
    "aria-hidden": true,
    "aria-invalid": invalid || undefined,
    "data-checked": checked ? "" : undefined,
    "data-choice": "",
    "data-slot": "questionnaire-choice-indicator",
  } as const;

  if (type === "radio") {
    return (
      <span {...state} className={cn(radioClassName, "pointer-events-none choice-first-line")}>
        {/* The dot grows from the center with a slight overshoot and shrinks back, like the radio's. */}
        <span className="absolute inset-0 grid place-content-center">
          <span
            className={cn(
              radioDotClassName,
              "scale-0 opacity-0 transition-[scale,opacity] duration-150 ease-in group-data-checked/radio-group-item:scale-100 group-data-checked/radio-group-item:opacity-100 group-data-checked/radio-group-item:duration-200 group-data-checked/radio-group-item:ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none",
            )}
          />
        </span>
      </span>
    );
  }

  return (
    <span {...state} className={cn(checkboxClassName, "pointer-events-none choice-first-line")}>
      <span
        data-checked={state["data-checked"]}
        className="group/check-indicator grid place-content-center text-current"
      >
        <CheckboxStateIcon />
      </span>
    </span>
  );
};

/**
 * One answer, drawn as a choice card (the card `Field`'s surface) with Erbium's radio, or checkbox
 * in a `multiple` item. The whole card toggles the answer.
 */
const QuestionnaireChoice = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice>) => (
  <QuestionnairePrimitive.Choice
    data-slot="questionnaire-choice"
    className={cn(
      choiceCardClassName,
      "group/questionnaire-choice flex cursor-pointer items-start gap-related text-start select-none",
      "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <QuestionnairePrimitive.ChoiceInput
      data-slot="questionnaire-choice-input"
      className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      render={(inputProps, state) => (
        <>
          <input {...inputProps} />
          <ChoiceIndicator checked={state.checked} invalid={state.invalid} type={state.type} />
        </>
      )}
    />
    <QuestionnairePrimitive.ChoiceLabel
      data-slot="questionnaire-choice-label"
      className="flex min-w-0 flex-1 flex-col gap-0.5 text-control"
    >
      {children}
    </QuestionnairePrimitive.ChoiceLabel>
    <QuestionnairePrimitive.ChoiceShortcut
      data-slot="questionnaire-choice-shortcut"
      render={<Kbd />}
      className="ms-auto hidden shrink-0 choice-first-line [--choice-height:--spacing(5)] group-data-shortcut/questionnaire-choice:inline-flex"
    />
  </QuestionnairePrimitive.Choice>
);

/** Secondary text under a choice's label, styled like a field description. */
const QuestionnaireChoiceDescription = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="questionnaire-choice-description"
    className={cn("text-caption text-pretty text-muted-foreground", className)}
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
      // The same field surface as `Input`.
      className={cn(inputClassName, className)}
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

/**
 * Shakes the item's answers after each submit the form rejected because of this field, like
 * `FormField`. The questionnaire returns to the item first, so it shakes once it is shown.
 */
const useShakeOnRejectedSubmit = (itemRef: React.RefObject<HTMLFieldSetElement | null>) => {
  const field = useFieldContext<unknown>();
  const attempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const submitting = useSelector(field.form.store, (state) => state.isSubmitting);
  const shaken = React.useRef(attempts);

  React.useEffect(() => {
    if (submitting || attempts === shaken.current) {
      return;
    }

    shaken.current = attempts;

    if (field.state.meta.errors.length === 0) {
      return;
    }

    requestAnimationFrame(() => {
      const item = itemRef.current;

      if (item?.isConnected === true && item.hidden === false) {
        shakeAnswers(item);
      }
    });
  }, [attempts, field, itemRef, submitting]);
};

/** `QuestionnaireItem` named after the field and invalid while it shows errors. */
const QuestionnaireFieldItem = ({
  ref,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnaireItem>, "invalid" | "name">) => {
  const field = useFieldContext<unknown>();
  const messages = useFieldMessages();
  const itemRef = React.useRef<HTMLFieldSetElement | null>(null);
  useShakeOnRejectedSubmit(itemRef);

  return (
    <QuestionnaireItem
      ref={useMergedRefs(ref, itemRef)}
      name={field.name}
      invalid={messages.length > 0}
      {...props}
    />
  );
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

        if (isChoiceList(current)) {
          field.handleChange(
            checked ? [...current, value] : current.filter((chosen) => chosen !== value),
          );
        } else {
          field.handleChange(value);
        }

        // Checking an earlier answer can leave errors on this one before it is reached; answering
        // replaces them with the answer's own result instead of showing them.
        if (field.state.meta.errors.length > 0) {
          void field.validate("submit");
        }
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

  const showItem = (nextItem: string) => {
    setUncontrolledItem(nextItem);
    onItemChange?.(nextItem);
  };

  const errorsIn = (name: string) => form.getFieldMeta(name)?.errors.length ?? 0;

  // The schema checks each answer before the questionnaire moves past it, not only on submit.
  const advance = async (nextItem: string) => {
    form.setFieldMeta(item, (meta) => ({ ...meta, isTouched: true }));
    await form.validateField(item, "submit");

    if (errorsIn(item) === 0) {
      showItem(nextItem);
    }
  };

  const order = (name: string) => items.findIndex((definition) => definition.name === name);

  const changeItem = (nextItem: string) => {
    if (order(nextItem) > order(item)) {
      void advance(nextItem);

      return;
    }

    showItem(nextItem);
  };

  const submit = async () => {
    await form.handleSubmit();

    const invalid = items.find((definition) => errorsIn(definition.name) > 0);

    if (invalid) {
      showItem(invalid.name);
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
