import * as React from "react";
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
} from "./field";
import { Input } from "./input";
import { OTPField as OTPFieldControl } from "./otp-field";
import { PasswordInput } from "./password-input";
import type { OTPFieldProps } from "./otp-field";
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
 * - A rejected submit shakes every invalid control.
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

/** Replays the error shake on `ref` after each submit that left this field invalid. */
const useShakeOnRejectedSubmit = (ref: React.RefObject<Element | null>) => {
  const field = useFieldContext<unknown>();
  const attempts = useSelector(field.form.store, (state) => state.submissionAttempts);
  const submitting = useSelector(field.form.store, (state) => state.isSubmitting);
  const shaken = React.useRef(attempts);

  React.useEffect(() => {
    if (submitting || attempts === shaken.current) {
      return;
    }

    shaken.current = attempts;

    if (field.state.meta.errors.length > 0) {
      shake(ref.current);
    }
  }, [attempts, field, ref, submitting]);
};

type FieldProps = Omit<
  React.ComponentProps<typeof FieldRoot>,
  "dirty" | "invalid" | "name" | "touched"
>;

/**
 * `Field` bound to the surrounding `form.AppField`: name, invalid, touched and
 * dirty come from TanStack Form. Compose any label, description and control
 * inside it; invalid follows the visible errors.
 */
const FormField = (props: FieldProps) => {
  const field = useFieldContext<unknown>();
  const meta = useFieldMeta();
  const messages = useVisibleMessages();

  return (
    <FieldRoot
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
  ...props
}: TextFieldProps) => {
  const field = useFieldContext<string>();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  useShakeOnRejectedSubmit(inputRef);

  return (
    <FormField className={className} hidden={hidden} orientation={orientation}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        ref={inputRef}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
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
    | "className"
    | "defaultValue"
    | "groupRef"
    | "hidden"
    | "name"
    | "onBlur"
    | "onChange"
    | "ref"
    | "value"
  >;

/**
 * A labelled `PasswordInput` for a string field. Pressing the show/hide toggle
 * with a pointer keeps focus in the input, so it does not touch the field. A
 * rejected submit shakes the whole input group, toggle included.
 */
const PasswordField = ({
  className,
  description,
  hidden,
  label,
  orientation,
  ...props
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();
  const groupRef = React.useRef<HTMLFieldSetElement | null>(null);
  useShakeOnRejectedSubmit(groupRef);

  return (
    <FormField className={className} hidden={hidden} orientation={orientation}>
      <FieldLabel>{label}</FieldLabel>
      <PasswordInput
        groupRef={groupRef}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
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
  ...props
}: TextareaFieldProps) => {
  const field = useFieldContext<string>();
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  useShakeOnRejectedSubmit(textareaRef);

  return (
    <FormField className={className} hidden={hidden} orientation={orientation}>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        ref={textareaRef}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => {
          field.handleChange(event.target.value);
        }}
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
  ...props
}: ToggleFieldProps<typeof Checkbox>) => {
  const field = useFieldContext<boolean>();
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  useShakeOnRejectedSubmit(rowRef);

  return (
    <FormField ref={rowRef} className={className} hidden={hidden} orientation={orientation}>
      <Checkbox
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(checked) => {
          field.handleChange(checked);
        }}
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
  ...props
}: ToggleFieldProps<typeof Switch>) => {
  const field = useFieldContext<boolean>();
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  useShakeOnRejectedSubmit(rowRef);

  return (
    <FormField ref={rowRef} className={className} hidden={hidden} orientation={orientation}>
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
        {...props}
      />
    </FormField>
  );
};

/**
 * `OTPField` bound to a string field. Validation metadata drives its pending,
 * error and success states; leaving the whole group marks the field touched.
 */
const FormOTPField = (
  props: Omit<OTPFieldProps, "name" | "onBlur" | "onValueChange" | "validation" | "value">,
) => {
  const field = useFieldContext<string>();
  const meta = useFieldMeta();

  return (
    <OTPFieldControl
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
    CheckboxField,
    Field: FormField,
    FieldError: FormFieldError,
    OTPField: FormOTPField,
    PasswordField,
    SwitchField,
    TextField,
    TextareaField,
  },
  fieldContext,
  formComponents: { SubmitButton },
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
  FormOTPField,
  PasswordField,
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
