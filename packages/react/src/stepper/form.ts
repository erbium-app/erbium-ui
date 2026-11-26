import * as React from "react";
import type { StepperStepId } from "./core";
import { useStepperGuard, useStepperInternals } from "./parts";
import type { StepperFinish, StepperFinishFailure, StepperStore } from "./store";

/*
 * TanStack Form adapters. The stepper owns the flow and the form owns fields and validation: each
 * step is a `FormGroup` named after the step, so a field path's first segment is its step. Forms
 * and groups are read structurally, so this package does not depend on TanStack Form.
 */

/** A TanStack store subscription: a function, or an object with `unsubscribe`, by version. */
type Unsubscribe = (() => void) | { unsubscribe: () => void };

/** The parts of a TanStack `FormGroupApi` the adapter reads. */
interface StepperFormGroup {
  name: string;
  state: {
    value: unknown;
    /** TanStack keeps a group's submit counters on its meta, beside its validity. */
    meta: {
      isValid: boolean;
      errors: readonly unknown[];
      submissionAttempts?: number;
      isSubmitting?: boolean;
    };
  };
  store: { subscribe: (listener: () => void) => Unsubscribe };
  handleSubmit: () => Promise<void>;
  areRelatedFieldsValid: () => boolean;
}

interface StepperFieldMeta {
  errors: readonly unknown[];
}

/** The parts of a TanStack `FormApi` the finish adapter reads. */
interface StepperForm {
  state: {
    fieldMeta: Partial<Record<string, StepperFieldMeta>>;
    isSubmitSuccessful: boolean;
  };
  handleSubmit: () => Promise<void>;
  /** Shows errors on fields, as TanStack's server errors do. */
  // oxlint-disable-next-line typescript/method-signature-style -- a method's parameter is bivariant, which lets TanStack's form, whose `onServer` type is a generic that defaults to undefined, match; a property would reject it.
  setErrorMap(errorMap: { onServer?: { fields: Record<string, string> } }): void;
}

/** Subscribes to a group's store and returns the function that ends it, whatever the version. */
const subscribeTo = (group: StepperFormGroup, listener: () => void) => {
  const subscription = group.store.subscribe(listener);

  return () => {
    if ("unsubscribe" in subscription) {
      subscription.unsubscribe();
    } else {
      subscription();
    }
  };
};

// oxlint-disable-next-line anti-slop/no-unknown-parameters -- a group's value is whatever its form holds; this walks it structurally and reads nothing else.
const isEmptyValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === "" || value === false) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isEmptyValue);
  }

  if (value instanceof Date) {
    return false;
  }

  return value instanceof Object && Object.values(value).every(isEmptyValue);
};

const isGroupValid = (group: StepperFormGroup) =>
  group.areRelatedFieldsValid() && group.state.meta.isValid;

/** The serialized value each completed step had when it passed, by stepper. */
const completions = new WeakMap<StepperStore, Map<StepperStepId, string>>();

const completionsOf = (owner: StepperStore) => {
  const existing = completions.get(owner);

  if (existing !== undefined) {
    return existing;
  }

  const created = new Map<StepperStepId, string>();
  completions.set(owner, created);

  return created;
};

// oxlint-disable-next-line anti-slop/no-unknown-parameters -- a group's value is whatever its form holds; it is only compared, never read.
const serialize = (value: unknown) => JSON.stringify(value) ?? "";

const focusFirstInvalid = (form: HTMLFormElement) => {
  form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
};

interface StepperFormGroupOptions {
  /** The step the group belongs to. Defaults to the group's name. */
  step?: StepperStepId;
  /**
   * Whether an optional step counts as untouched, so Next skips it without validating.
   * Defaults to every value being empty.
   */
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- the adapter reads forms structurally, so it cannot know the group's value type.
  isEmpty?: (value: unknown) => boolean;
  /** Reopen the step, and in linear flows the later ones, when a completed answer changes. @default true */
  invalidateOnEdit?: boolean;
  /**
   * What to focus when the step is invalid. Defaults to the first `aria-invalid` field in the
   * step's form. `false` leaves focus where it is.
   */
  focusInvalid?: false | ((form: HTMLFormElement) => void);
}

/**
 * Binds a TanStack `FormGroup` to its step. Next submits the group, and the step passes when the
 * group is valid. An untouched optional step is skipped. Editing a completed answer reopens the
 * step, and fixing an invalid step clears its error mark. Spread `formProps` on the step's
 * `<form>`, so Enter takes the same path as Next.
 */
const useStepperFormGroup = (
  group: StepperFormGroup,
  {
    step: stepOption,
    isEmpty = isEmptyValue,
    invalidateOnEdit = true,
    focusInvalid = focusFirstInvalid,
  }: StepperFormGroupOptions = {},
) => {
  const step = stepOption ?? group.name;
  const { store } = useStepperInternals("useStepperFormGroup");
  const formRef = React.useRef<HTMLFormElement>(null);

  useStepperGuard(step, async () => {
    const optional = store
      .get()
      .flow.steps.some((item) => item.id === step && item.optional === true);

    if (optional && isEmpty(group.state.value)) {
      return { status: "skip" };
    }

    await group.handleSubmit();

    if (isGroupValid(group)) {
      completionsOf(store).set(step, serialize(group.state.value));

      return { status: "valid" };
    }

    const form = formRef.current;

    if (focusInvalid !== false && form !== null) {
      // Errors render after this tick, so the invalid fields are marked next frame.
      requestAnimationFrame(() => {
        focusInvalid(form);
      });
    }

    return { issues: group.state.meta.errors, status: "invalid" };
  });

  React.useEffect(() => {
    const done = completionsOf(store);

    const check = () => {
      const { state } = store.get();

      if (Object.hasOwn(state.issues, step) && isGroupValid(group)) {
        store.clearIssues(step);
      }

      if (!invalidateOnEdit || state.resolution[step] !== "complete") {
        return;
      }

      const value = serialize(group.state.value);
      const passed = done.get(step);

      if (passed === undefined) {
        // Resolved before this group mounted, for example from a snapshot.
        done.set(step, value);
      } else if (passed !== value) {
        done.delete(step);
        store.invalidate(step);
      }
    };

    check();

    return subscribeTo(group, check);
  }, [group, invalidateOnEdit, step, store]);

  const subscribe = React.useCallback(
    (listener: () => void) => subscribeTo(group, listener),
    [group],
  );

  // Each Next submits the group, so its fields can replay a rejected-submit effect.
  const readAttempts = () => group.state.meta.submissionAttempts ?? 0;
  const readSubmitting = () => group.state.meta.isSubmitting === true;
  const attempts = React.useSyncExternalStore(subscribe, readAttempts, readAttempts);
  const submitting = React.useSyncExternalStore(subscribe, readSubmitting, readSubmitting);

  const formProps = React.useMemo(
    () => ({
      noValidate: true,
      onKeyDown: (event: React.KeyboardEvent<HTMLFormElement>) => {
        const { target } = event;

        // Enter in a single-line field moves on, as it submits a form with a submit button.
        if (
          event.key === "Enter" &&
          !event.nativeEvent.isComposing &&
          target instanceof HTMLInputElement &&
          !event.defaultPrevented
        ) {
          event.preventDefault();
          void store.next();
        }
      },
      onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        void store.next();
      },
      ref: formRef,
    }),
    [store],
  );

  return { attempts, formProps, submitting };
};

interface StepperFormFinishOptions {
  /**
   * Maps a thrown submit error, for example from the server, to messages by field path, so the
   * fields show them and the stepper returns to the first failing step.
   */
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- anything can be thrown; this is the caller's own parser for what its submit throws.
  fieldErrors?: (error: unknown) => Record<string, string> | undefined;
}

/** The step a field path belongs to: its first segment. */
const stepOfPath = (path: string) => path.split(/[.[]/u, 1)[0] ?? path;

const issuesOf = (form: StepperForm) => {
  const issues: Record<StepperStepId, unknown[]> = {};

  for (const [path, meta] of Object.entries(form.state.fieldMeta)) {
    if (meta !== undefined && meta.errors.length > 0) {
      const step = stepOfPath(path);
      issues[step] = [...(issues[step] ?? []), ...meta.errors];
    }
  }

  return issues;
};

/** Why the form did not submit, by step. Throws when no field says. */
const failureOf = (form: StepperForm): StepperFinishFailure => {
  const issues = issuesOf(form);

  if (Object.keys(issues).length === 0) {
    throw new Error("The form did not submit.");
  }

  return { issues };
};

/**
 * An `onFinish` that submits the whole form. Its full schema runs over every step, and the steps
 * whose fields fail become invalid, so the user is sent to the first one. A thrown error mapped
 * by `fieldErrors` is shown on its fields the same way; any other rejects the finish with `error`.
 */
const createStepperFormFinish =
  (form: StepperForm, { fieldErrors }: StepperFormFinishOptions = {}): StepperFinish =>
  async () => {
    try {
      await form.handleSubmit();
    } catch (error) {
      const mapped = fieldErrors?.(error);

      if (mapped === undefined) {
        throw error;
      }

      form.setErrorMap({ onServer: { fields: mapped } });

      return {
        issues: Object.fromEntries(
          Object.entries(mapped).map(([path, message]) => [stepOfPath(path), [message]]),
        ),
      };
    }

    return form.state.isSubmitSuccessful ? undefined : failureOf(form);
  };

export { createStepperFormFinish, useStepperFormGroup };

export type {
  StepperFieldMeta,
  StepperForm,
  StepperFormFinishOptions,
  StepperFormGroup,
  StepperFormGroupOptions,
};
