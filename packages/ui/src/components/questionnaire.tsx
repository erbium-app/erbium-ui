import * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import type {
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
} from "@shadcn/react/questionnaire";
import {
  createStepperFormFinish,
  Stepper as StepperPrimitive,
  useStepper,
  useStepperSelector,
} from "@erbium-ui/react/stepper";
import type {
  StepperApi,
  StepperFinish,
  StepperGuard,
  StepperSnapshot,
  StepperStep,
} from "@erbium-ui/react/stepper";
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
import { StepperDots } from "./stepper";
import type { StepperDotsProps } from "./stepper";

/*
 * The questionnaire is a stepper: `@erbium-ui/react/stepper` owns which question is shown, which
 * ones can be reached, the marks of rejected ones and finishing. The shadcn primitive keeps the
 * answers (choices, inputs, shortcuts and their status) and is always controlled by the flow.
 */

interface QuestionnaireFlow {
  items: readonly QuestionnaireItemDefinition[];
  /** Records an item's answer status, which the flow checks before leaving the item. */
  report: (name: string, status: QuestionnaireItemStatus) => void;
  /** Next, Enter and Submit: checks the item, then moves on, or finishes from the last one. */
  advance: () => void;
  /** Marks the move the primitive reports during this click as a skip. */
  markSkip: () => void;
}

const QuestionnaireFlowContext = React.createContext<QuestionnaireFlow | null>(null);

const useQuestionnaireFlow = (part: string) => {
  const flow = React.use(QuestionnaireFlowContext);

  if (!flow) {
    throw new Error(`${part} must be inside Questionnaire.`);
  }

  return flow;
};

const ITEM = '[data-slot="questionnaire-item"]';
const ANSWERS = '[data-slot="questionnaire-choices"], [data-slot="questionnaire-input-wrapper"]';
const ANSWER = '[data-slot="questionnaire-choice-input"], [data-slot="questionnaire-input"]';

const activeItem = (root: Element) => root.querySelector(`${ITEM}:not([hidden])`);

// One rejection can be reported twice (the flow's mark and a field's own errors).
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

/** Each rejection marks the step with a new issues list, so a list shakes only once. */
const shakenIssues = new WeakSet<object>();

/**
 * Shakes the shown item's answers whenever the flow rejects it: a refused Next, Enter, Submit or
 * step dot, or a submit that failed and returned to it, on every attempt like a rejected submit.
 */
const useShakeOnRejection = (rootRef: React.RefObject<HTMLFormElement | null>) => {
  const issues = useStepperSelector((view) => view.state.issues[view.state.current]);

  React.useEffect(() => {
    if (issues === undefined || shakenIssues.has(issues)) {
      return;
    }

    shakenIssues.add(issues);

    // Once the mark has rendered, so the item shows its error as it shakes.
    requestAnimationFrame(() => {
      const item = rootRef.current ? activeItem(rootRef.current) : null;

      if (item) {
        shakeAnswers(item);
      }
    });
  }, [issues, rootRef]);
};

/** Next from the last item finishes. A sent questionnaire stays open, so answers can change. */
const advanceFlow = async (stepper: StepperApi) => {
  const result = await stepper.next();

  if (result.accepted && result.to === null) {
    stepper.restore({ ...stepper.snapshot(), finished: false });
  }
};

const NON_TEXT_INPUTS = new Set(["button", "checkbox", "radio", "reset", "submit"]);

const isTextInput = (target: HTMLElement) =>
  target instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(target.type);

/** Where arrow keys move the caret, so they never change the question. */
const isTextEntry = (target: HTMLElement) =>
  target instanceof HTMLTextAreaElement ||
  target instanceof HTMLSelectElement ||
  target.isContentEditable ||
  isTextInput(target);

const isRadio = (target: HTMLElement) =>
  target instanceof HTMLInputElement && target.type === "radio";

/** A chosen answer: a checked choice, or an input holding text. */
const isChosen = (input: HTMLInputElement) =>
  input.type === "checkbox" || input.type === "radio" ? input.checked : input.value.trim() !== "";

interface KeyMoves {
  advance: () => void;
  previous: () => void;
  /** ArrowRight moves on only from an answered item that is not the last. */
  canAdvance: () => boolean;
}

type KeyMove = (moves: KeyMoves) => void;

const goNext: KeyMove = (moves) => {
  moves.advance();
};

const goBack: KeyMove = (moves) => {
  moves.previous();
};

const goForward: KeyMove = (moves) => {
  if (moves.canAdvance()) {
    moves.advance();
  }
};

const stay: KeyMove = () => {
  // Enter on an answer not chosen yet does nothing, as in the primitive.
};

/** What a key asks of the flow, or `null` to leave it to the primitive. */
const keyMove = (event: React.KeyboardEvent<HTMLFormElement>): KeyMove | null => {
  const { key, target } = event;
  const modified = event.metaKey || event.ctrlKey;

  if (key === "Enter" && modified) {
    return event.altKey || event.shiftKey ? null : goNext;
  }

  if (modified || event.altKey || !(target instanceof HTMLElement)) {
    return null;
  }

  if (key === "ArrowLeft" || key === "ArrowRight") {
    if (isTextEntry(target) || isRadio(target)) {
      return null;
    }

    return key === "ArrowLeft" ? goBack : goForward;
  }

  if (key === "Enter" && target instanceof HTMLInputElement && target.matches(ANSWER)) {
    return isChosen(target) ? goNext : stay;
  }

  return null;
};

/**
 * The questionnaire's keys, sent to the flow before the primitive sees them: Mod+Enter and Enter
 * on a chosen answer go next, ArrowLeft and ArrowRight move outside text entry. Answer focus and
 * choice shortcuts stay with the primitive.
 */
const moveWithKeys = (event: React.KeyboardEvent<HTMLFormElement>, moves: KeyMoves) => {
  const move = event.defaultPrevented || event.nativeEvent.isComposing ? null : keyMove(event);

  if (move === null) {
    return;
  }

  event.preventDefault();

  if (!event.repeat) {
    move(moves);
  }
};

type QuestionnaireRootProps = React.ComponentProps<typeof QuestionnairePrimitive.Root>;

/** What the flow takes over from the primitive's root. */
interface QuestionnaireFlowProps {
  /**
   * The questions, in order. The flow, the step dots and each item's `required` read it, and an
   * item's `disabled` takes it out of the flow.
   */
  items: readonly QuestionnaireItemDefinition[];
  /** The shown question. Controlled. A question the flow cannot reach is refused. */
  item?: string;
  /** Resumes at this question; the enabled ones before it count as answered. */
  defaultItem?: string;
  onItemChange?: (item: string) => void;
  /** Checks an answered question before the questionnaire leaves it or submits from it. */
  guard?: StepperGuard;
  /**
   * Runs once the last question passes, instead of the native submit. Report issues by item name
   * to return to the first failing one.
   */
  onFinish?: StepperFinish;
}

type QuestionnaireFormAttributes = Omit<QuestionnaireRootProps, keyof QuestionnaireFlowProps>;

interface QuestionnaireFormElementProps extends QuestionnaireFormAttributes {
  items: readonly QuestionnaireItemDefinition[];
  rootRef: React.RefObject<HTMLFormElement | null>;
  statuses: React.RefObject<Map<string, QuestionnaireItemStatus>>;
  /** The finish submits the form natively, so `onSubmit` gets the real event. */
  submitting: React.RefObject<boolean>;
  /** `onFinish` replaces the native submit. */
  finishes: boolean;
}

/** The primitive's form, inside the flow and controlled by it. */
const QuestionnaireFormElement = ({
  className,
  finishes,
  items,
  onKeyDown,
  onReset,
  onSubmit,
  rootRef,
  statuses,
  submitting,
  ...props
}: QuestionnaireFormElementProps) => {
  const stepper = useStepper();
  const current = useStepperSelector((view) => view.state.current);
  const skipping = React.useRef(false);
  useShakeOnRejection(rootRef);

  const flow = React.useMemo<QuestionnaireFlow>(
    () => ({
      advance: () => {
        void advanceFlow(stepper);
      },
      markSkip: () => {
        skipping.current = true;

        // The primitive reports the skip within the click; a skip from the last item reports none.
        queueMicrotask(() => {
          skipping.current = false;
        });
      },
      report: (name, status) => {
        statuses.current.set(name, status);
      },
      items,
    }),
    [items, statuses, stepper],
  );

  return (
    <QuestionnaireFlowContext value={flow}>
      <QuestionnairePrimitive.Root
        item={current}
        items={items}
        data-slot="questionnaire"
        className={cn("flex w-full min-w-0 flex-col gap-group", className)}
        // The primitive proposes a move only for Skip, Reset and a submit it refused; the flow
        // decides each one.
        onItemChange={(name) => {
          if (skipping.current) {
            skipping.current = false;
            void stepper.skip();
          } else {
            void stepper.goTo(name);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          moveWithKeys(event, {
            advance: flow.advance,
            canAdvance: () => {
              const { flow: steps, state } = stepper.get();

              return (
                state.current !== steps.last &&
                (statuses.current.get(state.current) ?? "unanswered") !== "unanswered"
              );
            },
            previous: () => {
              void stepper.previous();
            },
          });
        }}
        onReset={(event) => {
          onReset?.(event);

          if (!event.defaultPrevented) {
            stepper.reset();
          }
        }}
        onSubmit={(event) => {
          if (submitting.current) {
            onSubmit?.(event);

            return;
          }

          // Any other submit, such as pressing Enter in a field, goes through the flow first.
          event.preventDefault();

          if (finishes) {
            onSubmit?.(event);
          }

          flow.advance();
        }}
        {...props}
      />
    </QuestionnaireFlowContext>
  );
};

/** Submits `form` natively, flagged so its submit handler knows the flow already passed it. */
const submitNow = (form: HTMLFormElement | null, submitting: React.RefObject<boolean>) => {
  submitting.current = true;

  try {
    form?.requestSubmit();
  } finally {
    submitting.current = false;
  }
};

const toSteps = (items: readonly QuestionnaireItemDefinition[]) =>
  items.map((definition): StepperStep => ({
    disabled: definition.disabled === true,
    id: definition.name,
    optional: definition.required !== true,
  }));

/** Resuming at `defaultItem` counts the enabled items before it as answered. */
const resumeAt = (
  items: readonly QuestionnaireItemDefinition[],
  name: string | undefined,
): Partial<StepperSnapshot> | undefined => {
  if (name === undefined) {
    return undefined;
  }

  const enabled = items.filter((definition) => definition.disabled !== true);

  const before = enabled.slice(
    0,
    Math.max(
      enabled.findIndex((item) => item.name === name),
      0,
    ),
  );

  return {
    current: name,
    resolution: Object.fromEntries(before.map((item) => [item.name, "complete" as const])),
  };
};

type QuestionnaireProps = QuestionnaireFormAttributes & QuestionnaireFlowProps;

/**
 * A questionnaire, run by the stepper: Next, Enter, Skip, the step dots and submit all move
 * through one flow that checks the shown question first. It eases to the next question's height,
 * so the actions below it do not jump, and shakes the answers of a question it rejects.
 */
const Questionnaire = ({
  defaultItem,
  guard,
  item,
  items,
  onFinish,
  onItemChange,
  ref,
  ...props
}: QuestionnaireProps) => {
  const steps = React.useMemo(() => toSteps(items), [items]);
  const rootRef = React.useRef<HTMLFormElement | null>(null);
  const formRef = useMergedRefs(ref, rootRef, animateHeight);
  const statuses = React.useRef(new Map<string, QuestionnaireItemStatus>());
  const submitting = React.useRef(false);

  // An unanswered question is never left forward, whatever `guard` says.
  const checkItem: StepperGuard = async (context) => {
    if ((statuses.current.get(context.step) ?? "unanswered") === "unanswered") {
      return false;
    }

    return guard === undefined ? true : await guard(context);
  };

  const submitNatively = () => {
    submitNow(rootRef.current, submitting);
  };

  return (
    <StepperPrimitive.Root
      steps={steps}
      value={item}
      defaultSnapshot={resumeAt(items, defaultItem)}
      guard={checkItem}
      onFinish={onFinish ?? submitNatively}
      onValueChange={(value) => {
        onItemChange?.(value);
      }}
      // The form is the flow's only element.
      render={() => (
        <QuestionnaireFormElement
          ref={formRef}
          finishes={onFinish !== undefined}
          items={items}
          rootRef={rootRef}
          statuses={statuses}
          submitting={submitting}
          {...props}
        />
      )}
    />
  );
};

const questionNumber = (_step: StepperStep, position: number) => `Question ${position}`;

type QuestionnaireStepIndicatorProps = Omit<StepperDotsProps, "label">;

/**
 * The questionnaire's position as step dots. Each question the flow can reach is a button that
 * moves to it, checking the shown question first when it moves forward.
 */
const QuestionnaireStepIndicator = ({
  className,
  "aria-label": ariaLabel,
  ...props
}: QuestionnaireStepIndicatorProps) => {
  const position = useStepperSelector(
    (view) => (view.flow.position.get(view.state.current) ?? 0) + 1,
  );

  const count = useStepperSelector((view) => view.flow.enabled.length);

  return (
    <StepperDots
      data-slot="questionnaire-step-indicator"
      aria-label={ariaLabel ?? `Question ${position} of ${count}`}
      label={questionNumber}
      className={cn("w-fit", className)}
      {...props}
    />
  );
};

/**
 * One question. A question that cannot be skipped is `required` in the questionnaire's `items`:
 * its title shows the required mark, as a required field's label does. It shows the flow's mark
 * while rejected, until it is answered, and eases to make room for its error.
 */
const QuestionnaireItem = ({
  className,
  invalid = false,
  name,
  onStatusChange,
  ref,
  required: requiredProp,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) => {
  const flow = useQuestionnaireFlow("QuestionnaireItem");
  const stepper = useStepper();
  const definition = flow.items.find((item) => item.name === name);
  const required = requiredProp ?? definition?.required ?? false;
  const rejected = useStepperSelector((view) => Object.hasOwn(view.state.issues, name));
  const [status, setStatus] = React.useState<QuestionnaireItemStatus>("unanswered");

  // An answer clears the flow's mark, once the item has no errors of its own.
  React.useEffect(() => {
    if (rejected && !invalid && status !== "unanswered") {
      stepper.clearIssues(name);
    }
  }, [invalid, name, rejected, status, stepper]);

  return (
    <FieldRequiredContext.Provider value={required}>
      <QuestionnairePrimitive.Item
        ref={useMergedRefs(ref, animateHeight)}
        data-slot="questionnaire-item"
        data-name={name}
        name={name}
        required={required}
        invalid={invalid || rejected}
        onStatusChange={(next) => {
          flow.report(name, next);
          setStatus(next);
          onStatusChange?.(next);
        }}
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
      className="ms-auto choice-first-line hidden shrink-0 [--choice-height:--spacing(5)] group-data-shortcut/questionnaire-choice:inline-flex"
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
      "mt-2 text-caption text-error transition-opacity duration-200 ease-out motion-reduce:transition-none starting:opacity-0",
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

/** Previous goes back through the flow. */
const QuestionnairePrevious = ({
  children,
  className,
  onClick,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => {
  const stepper = useStepper();

  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      onClick={(event) => {
        onClick?.(event);

        // Prevented, so the primitive does not move on its own.
        if (!event.defaultPrevented) {
          event.preventDefault();
          void stepper.previous();
        }
      }}
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
};

/** Skip clears the question's answers in the primitive, and the flow records the skip. */
const QuestionnaireSkip = ({
  children,
  className,
  onClick,
  size = "default",
  variant = "outline",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => {
  const flow = useQuestionnaireFlow("QuestionnaireSkip");

  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          flow.markSkip();
        }
      }}
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
};

/** Next checks the question through the flow, then moves on. */
const QuestionnaireNext = ({
  children,
  className,
  onClick,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">) => {
  const flow = useQuestionnaireFlow("QuestionnaireNext");

  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          event.preventDefault();
          flow.advance();
        }
      }}
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
};

/** Submit finishes through the flow, which checks the last question before the form submits. */
const QuestionnaireSubmit = ({
  children,
  className,
  onClick,
  size = "default",
  variant = "default",
  state,
  successLabel,
  successDuration,
  onStateChange,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnairePrimitive.Submit>, "render"> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant"> &
  Pick<StatefulButtonProps, "state" | "successLabel" | "successDuration" | "onStateChange">) => {
  const flow = useQuestionnaireFlow("QuestionnaireSubmit");

  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          event.preventDefault();
          flow.advance();
        }
      }}
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
};

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
const QuestionnaireFieldItem = ({
  ref,
  ...props
}: Omit<React.ComponentProps<typeof QuestionnaireItem>, "invalid" | "name">) => {
  const field = useFieldContext<unknown>();
  const messages = useFieldMessages();

  return <QuestionnaireItem ref={ref} name={field.name} invalid={messages.length > 0} {...props} />;
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

type QuestionnaireFormProps = Omit<QuestionnaireProps, "guard" | "noValidate" | "onFinish"> & {
  form: AnyFormApi;
};

/**
 * `Questionnaire` whose answers TanStack Form owns. The flow checks each answer with its field's
 * validators before moving past it, and submitting runs the whole form: a rejected submit returns
 * to the first item, in `items` order, whose field has an error.
 */
const QuestionnaireForm = ({ form, onSubmit, ...props }: QuestionnaireFormProps) => {
  const finish = React.useMemo(() => createStepperFormFinish(form), [form]);

  const guard: StepperGuard = async ({ step }) => {
    form.setFieldMeta(step, (meta) => ({ ...meta, isTouched: true }));
    await form.validateField(step, "submit");

    return (form.getFieldMeta(step)?.errors.length ?? 0) === 0;
  };

  return (
    <formContext.Provider value={form}>
      <Questionnaire
        guard={guard}
        onFinish={finish}
        onSubmit={(event) => {
          event.stopPropagation();
          onSubmit?.(event);
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
