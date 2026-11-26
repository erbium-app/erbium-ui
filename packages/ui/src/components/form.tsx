import * as React from "react";
import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import {
  createFormHook,
  createFormHookContexts,
  revalidateLogic,
  useSelector,
} from "@tanstack/react-form";
import type { AnyFieldMeta, AnyFormApi } from "@tanstack/react-form";
import { Option, Schema, SchemaTransformation } from "effect";
import { shake } from "../lib/shake";
import { Checkbox } from "./checkbox";
import {
  Field as FieldRoot,
  FieldContent,
  FieldDescription,
  FieldError as FieldErrorMessage,
  FieldLabel,
  useFieldRequired,
} from "./field";
import { Input } from "./input";
import { OTPField as OTPFieldControl } from "./otp-field";
import { PasswordInput } from "./password-input";
import type { OTPFieldProps } from "./otp-field";
import { SegmentedControl, SegmentedControlItem } from "./segmented-control";
import { StatefulButton } from "./stateful-button";
import type { StatefulButtonProps, StatefulButtonState } from "./stateful-button";
import { Switch } from "./switch";
import { Textarea } from "./textarea";

/*
 * TanStack Form bound to Erbium fields, validated with Effect Schema.
 *
 * Pass an Effect Schema to a validator through `Schema.toStandardSchemaV1`.
 * TanStack Form stores its failures in `field.state.meta.errors` as Standard
 * Schema issues (`{ message, path }`); the bound fields decode those and show
 * the messages in `FieldError`.
 *
 * Opinions baked in:
 * - `useAppForm` defaults to `revalidateLogic()`: `onDynamic` validators run on
 *   submit, then on every change once the user has tried to submit.
 * - A field shows its errors only after it is touched. Typing, blurring and
 *   submitting all touch it.
 * - A rejected submit shakes every invalid field. `FormField` owns the shake,
 *   so a field composed by hand (a select, radio group, autocomplete) shakes
 *   the same way as the prebuilt ones.
 */

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

/** A Standard Schema issue, e.g. an Effect Schema failure, read as its message. */
const IssueMessage = Schema.Struct({ message: Schema.String }).pipe(
  Schema.decodeTo(
    Schema.String,
    SchemaTransformation.transform({
      decode: (issue) => issue.message,
      encode: (message) => ({ message }),
    }),
  ),
);

/**
 * One entry of `field.state.meta.errors`: a string returned by a validator
 * function, or a Standard Schema issue from a schema validator.
 */
const ValidationMessage = Schema.Union([Schema.String, IssueMessage]);

const decodeValidationMessage = Schema.decodeUnknownOption(ValidationMessage);

/**
 * The messages a field shows: none until the user has touched it. Errors that
 * are neither a string nor an issue with a message are left out.
 */
const visibleMessages = (meta: AnyFieldMeta): string[] =>
  meta.isTouched
    ? meta.errors.flatMap((entry) => Option.toArray(decodeValidationMessage(entry)))
    : [];

const useFieldMeta = () => {
  const field = useFieldContext<unknown>();

  return useSelector(field.store, (state) => state.meta);
};

const useVisibleMessages = () => {
  const meta = useFieldMeta();

  return React.useMemo(() => visibleMessages(meta), [meta]);
};

/**
 * How much of the field a rejected submit shakes. `"auto"` shakes the whole
 * row of a choice field (a checkbox, radio or switch beside its label, the
 * same rows the `choice-row` variant aligns) and the control of any other.
 */
type FormFieldShake = "auto" | "control" | "field";

/** Matches `choice-row` in variants.css: a choice control beside a direct label. */
const CHOICE_ROW =
  ':has(> [data-choice]):has(> [data-slot="field-label"], > [data-slot="field-content"])';

/** Parts of a field that frame its control rather than being the control. */
const FIELD_CHROME = [
  '[data-slot="field-label"]',
  '[data-slot="field-description"]',
  '[data-slot="field-error"]',
  '[data-slot="field-content"]',
  '[aria-hidden="true"]',
  'input[type="hidden"]',
  ".sr-only",
].join(",");

/**
 * The elements a rejected submit shakes. A control is every direct child of
 * the field root that is not its label, description, error or a hidden helper
 * such as Base UI Select's validation input. That covers an input, an input
 * group, a select trigger, a radio group and an OTP field without each control
 * registering itself. Falls back to the root when nothing qualifies.
 */
const shakeTargets = (root: Element, shakeOn: FormFieldShake): Element[] => {
  if (shakeOn === "field" || (shakeOn === "auto" && root.matches(CHOICE_ROW))) {
    return [root];
  }

  const controls = [...root.children].filter((child) => !child.matches(FIELD_CHROME));

  return controls.length > 0 ? controls : [root];
};

/**
 * The submissions of the `FormGroup` around a field, such as a stepper step. A group submits on
 * its own, so its fields shake on its rejected submits as well as the form's.
 */
const FormGroupSubmitContext = React.createContext<{ attempts: number; submitting: boolean }>({
  attempts: 0,
  submitting: false,
});

/** Replays the error shake on the field after each submit that left it invalid. */
const useShakeOnRejectedSubmit = (
  rootRef: React.RefObject<Element | null>,
  shakeOn: FormFieldShake,
) => {
  const field = useFieldContext<unknown>();
  const group = React.use(FormGroupSubmitContext);
  const formAttempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const formSubmitting = useSelector(field.form.store, (state) => state.isSubmitting);
  const attempts = formAttempts + group.attempts;
  const submitting = formSubmitting || group.submitting;
  const shaken = React.useRef(attempts);

  React.useEffect(() => {
    if (submitting || attempts === shaken.current) {
      return;
    }

    shaken.current = attempts;

    const root = rootRef.current;

    if (root && field.state.meta.errors.length > 0) {
      for (const target of shakeTargets(root, shakeOn)) {
        shake(target);
      }
    }
  }, [attempts, field, rootRef, shakeOn, submitting]);
};

type FieldProps = Omit<
  React.ComponentProps<typeof FieldRoot>,
  "dirty" | "invalid" | "name" | "touched"
> & {
  /**
   * What a rejected submit shakes. `"auto"` (default) shakes a choice row
   * whole and the control of any other field; `"control"` and `"field"` force
   * one or the other.
   */
  shakeOn?: FormFieldShake;
};

/**
 * `Field` bound to the surrounding `form.AppField`: name, invalid, touched and
 * dirty come from TanStack Form. Compose any label, description and control
 * inside it; invalid follows the visible errors, and a rejected submit shakes
 * the field (see `shakeOn`). Controls need no shake wiring of their own.
 */
const FormField = ({ ref, shakeOn = "auto", ...props }: FieldProps) => {
  const field = useFieldContext<unknown>();
  const meta = useFieldMeta();
  const messages = useVisibleMessages();
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  useShakeOnRejectedSubmit(rootRef, shakeOn);

  return (
    <FieldRoot
      ref={useMergedRefs(ref, rootRef)}
      name={field.name}
      invalid={messages.length > 0}
      touched={meta.isTouched}
      dirty={meta.isDirty}
      {...props}
    />
  );
};

/** `FieldError` showing the surrounding field's visible messages. */
const FormFieldError = (
  props: Omit<React.ComponentProps<typeof FieldErrorMessage>, "errors" | "match">,
) => {
  const messages = useVisibleMessages();

  return <FieldErrorMessage errors={messages} {...props} />;
};

type LabelledFieldProps = Pick<FieldProps, "className" | "hidden" | "orientation"> & {
  /** Helper text below the control. The error replaces it while invalid. */
  description?: React.ReactNode;
  label: React.ReactNode;
};

const Description = ({ children }: { children?: React.ReactNode }) =>
  children === undefined ? null : <FieldDescription>{children}</FieldDescription>;

type TextFieldProps = LabelledFieldProps &
  Omit<
    React.ComponentProps<typeof Input>,
    "className" | "defaultValue" | "hidden" | "name" | "onBlur" | "onChange" | "ref" | "value"
  >;

/** A labelled text input for a string field. */
const TextField = ({
  className,
  description,
  hidden,
  label,
  orientation,
  required,
  ...props
}: TextFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <FormField className={className} hidden={hidden} orientation={orientation} required={required}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
        required={required}
        {...props}
      />
      <Description>{description}</Description>
      <FormFieldError />
    </FormField>
  );
};

type PasswordFieldProps = LabelledFieldProps &
  Omit<
    React.ComponentProps<typeof PasswordInput>,
    "className" | "defaultValue" | "hidden" | "name" | "onBlur" | "onChange" | "ref" | "value"
  >;

/**
 * A labelled `PasswordInput` for a string field. Pressing the show/hide toggle
 * with a pointer keeps focus in the input, so it does not touch the field. A
 * rejected submit shakes the whole input group, toggle included, since the
 * group is the field's control.
 */
const PasswordField = ({
  className,
  description,
  hidden,
  label,
  orientation,
  required,
  ...props
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <FormField className={className} hidden={hidden} orientation={orientation} required={required}>
      <FieldLabel>{label}</FieldLabel>
      <PasswordInput
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
        required={required}
        {...props}
      />
      <Description>{description}</Description>
      <FormFieldError />
    </FormField>
  );
};

type TextareaFieldProps = LabelledFieldProps &
  Omit<
    React.ComponentProps<typeof Textarea>,
    "className" | "defaultValue" | "hidden" | "name" | "onBlur" | "onChange" | "ref" | "value"
  >;

/** A labelled textarea for a string field. */
const TextareaField = ({
  className,
  description,
  hidden,
  label,
  orientation,
  required,
  ...props
}: TextareaFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <FormField className={className} hidden={hidden} orientation={orientation} required={required}>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
        required={required}
        {...props}
      />
      <Description>{description}</Description>
      <FormFieldError />
    </FormField>
  );
};

type ToggleFieldProps<Control extends React.ElementType> = LabelledFieldProps &
  Omit<
    React.ComponentProps<Control>,
    | "checked"
    | "className"
    | "defaultChecked"
    | "hidden"
    | "name"
    | "onBlur"
    | "onCheckedChange"
    | "ref"
  > & {
    /**
     * Show the error message under the label. Off by default: a toggle that
     * must be turned on, like accepting terms, is explained by its label, and
     * the invalid outline plus the shake of the whole row say it is required.
     * The message stays available to assistive technology either way.
     */
    showError?: boolean;
  };

/** The error of a toggle: visible on request, otherwise only announced. */
const ToggleFieldError = ({ visible }: { visible: boolean }) => (
  <FormFieldError className={visible ? undefined : "sr-only"} />
);

/**
 * A checkbox with its label and description beside it, for a boolean field. A
 * rejected submit shakes the checkbox and its label together.
 */
const CheckboxField = ({
  className,
  description,
  hidden,
  label,
  orientation = "horizontal",
  showError = false,
  required,
  ...props
}: ToggleFieldProps<typeof Checkbox>) => {
  const field = useFieldContext<boolean>();

  return (
    <FormField className={className} hidden={hidden} orientation={orientation} required={required}>
      <Checkbox
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => {
          field.handleChange(checked);
        }}
        required={required}
        {...props}
      />
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        <Description>{description}</Description>
        <ToggleFieldError visible={showError} />
      </FieldContent>
    </FormField>
  );
};

/**
 * A switch after its label and description, for a boolean field. A rejected
 * submit shakes the switch and its label together.
 */
const SwitchField = ({
  className,
  description,
  hidden,
  label,
  orientation = "horizontal",
  showError = false,
  required,
  ...props
}: ToggleFieldProps<typeof Switch>) => {
  const field = useFieldContext<boolean>();

  return (
    <FormField className={className} hidden={hidden} orientation={orientation} required={required}>
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        <Description>{description}</Description>
        <ToggleFieldError visible={showError} />
      </FieldContent>
      <Switch
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => {
          field.handleChange(checked);
        }}
        required={required}
        {...props}
      />
    </FormField>
  );
};

/** One segment of a `SegmentedField`. */
interface SegmentedFieldOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

type SegmentedFieldProps = LabelledFieldProps &
  Omit<
    RadioGroupPrimitive.Props<string>,
    | "children"
    | "className"
    | "defaultValue"
    | "hidden"
    | "inputRef"
    | "name"
    | "onBlur"
    | "onValueChange"
    | "ref"
    | "render"
    | "value"
  > & {
    /** The segments, in order. Keep them to a few short labels; use a Select for more. */
    options: readonly SegmentedFieldOption[];
  };

/**
 * A labelled `SegmentedControl` for a string field: one value from a few options shown side by
 * side. It is a Base UI Radio Group, so the field's label names it, it submits under the field's
 * name, and arrow keys move between segments. Start the field at `""` for no segment selected
 * until the user picks one. A rejected submit shakes the track.
 */
const SegmentedField = ({
  className,
  description,
  hidden,
  label,
  options,
  orientation,
  required,
  ...props
}: SegmentedFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <FormField className={className} hidden={hidden} orientation={orientation} required={required}>
      {/* A group has no single control for a native label; Base UI names the group with it. */}
      <FieldLabel nativeLabel={false} render={<div />}>
        {label}
      </FieldLabel>
      <SegmentedControl
        render={
          <RadioGroupPrimitive<string>
            value={field.state.value}
            onValueChange={(value) => {
              field.handleChange(value);
            }}
            onBlur={field.handleBlur}
            required={required}
            {...props}
          />
        }
      >
        {options.map((option) => (
          <SegmentedControlItem
            key={option.value}
            render={<RadioPrimitive.Root value={option.value} disabled={option.disabled} />}
          >
            {option.label}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
      <Description>{description}</Description>
      <FormFieldError />
    </FormField>
  );
};

/**
 * `OTPField` bound to a string field. Validation metadata drives its pending,
 * error and success states; leaving the whole group marks the field touched.
 */
const FormOTPField = ({
  required,
  ...props
}: Omit<OTPFieldProps, "name" | "onBlur" | "onValueChange" | "validation" | "value">) => {
  const field = useFieldContext<string>();
  const meta = useFieldMeta();
  const fieldRequired = useFieldRequired();

  return (
    <OTPFieldControl
      required={required ?? fieldRequired}
      value={field.state.value}
      validation={meta}
      onValueChange={(value) => {
        field.handleChange(value);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          field.handleBlur();
        }
      }}
      {...props}
    />
  );
};

/**
 * A submit `StatefulButton` that follows the form: loading while submitting,
 * success after a submit that passed validation, idle again after
 * `successDuration`.
 */
const SubmitButton = ({
  children,
  ...props
}: Omit<StatefulButtonProps, "onStateChange" | "state" | "type">) => {
  const form = useFormContext();
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);
  const isSubmitSuccessful = useSelector(form.store, (state) => state.isSubmitSuccessful);
  const submissionAttempts = useSelector(form.store, (state) => state.submissionAttempts);
  const [dismissedAttempt, setDismissedAttempt] = React.useState(0);

  let state: StatefulButtonState = "idle";

  if (isSubmitting) {
    state = "loading";
  } else if (isSubmitSuccessful && submissionAttempts !== dismissedAttempt) {
    state = "success";
  }

  return (
    <StatefulButton
      type="submit"
      state={state}
      onStateChange={(nextState) => {
        if (nextState === "idle") {
          setDismissedAttempt(submissionAttempts);
        }
      }}
      {...props}
    >
      {children}
    </StatefulButton>
  );
};

const {
  extendForm,
  useAppForm: useBaseAppForm,
  withFieldGroup,
  withForm,
} = createFormHook({
  fieldComponents: {
    Field: FormField,
    FieldError: FormFieldError,
    OTPField: FormOTPField,
    CheckboxField,
    PasswordField,
    SegmentedField,
    SwitchField,
    TextField,
    TextareaField,
  },
  formComponents: { SubmitButton },
  fieldContext,
  formContext,
});

/**
 * TanStack Form's `useAppForm` with Erbium's field components. Validation
 * defaults to `revalidateLogic()`: put the Effect Schema in
 * `validators.onDynamic`. Pass `validationLogic` to choose another strategy.
 */
const useAppForm: typeof useBaseAppForm = (options) =>
  useBaseAppForm({ validationLogic: revalidateLogic(), ...options });

/**
 * A native `<form>` that submits through TanStack Form. It provides the form to
 * `form.SubmitButton` and other form components, sets `noValidate` so the
 * schema owns validation, and prevents the browser's own submission.
 */
const Form = ({
  form,
  onSubmit,
  ...props
}: Omit<React.ComponentProps<"form">, "noValidate"> & { form: AnyFormApi }) => (
  <formContext.Provider value={form}>
    <form
      data-slot="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSubmit?.(event);
        void form.handleSubmit();
      }}
      {...props}
    />
  </formContext.Provider>
);

export {
  CheckboxField,
  Form,
  FormField,
  FormFieldError,
  FormGroupSubmitContext,
  FormOTPField,
  PasswordField,
  SegmentedField,
  SubmitButton,
  SwitchField,
  TextareaField,
  TextField,
  extendForm,
  fieldContext,
  formContext,
  useAppForm,
  useFieldContext,
  useFormContext,
  visibleMessages,
  withFieldGroup,
  withForm,
};

export type { SegmentedFieldOption, SegmentedFieldProps };
