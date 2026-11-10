import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group";
import { StatefulIcon } from "./stateful-icon";

/*
 * A password input with a built-in show/hide toggle, composed from InputGroup.
 *
 * Behavior:
 * - The toggle is a pressed-state button named "Show password". The name stays
 *   the same in both states; `aria-pressed` says whether the password shows.
 * - A pointer press keeps focus, caret and selection in the input, so the field
 *   is not blurred (and a form field is not marked touched) by the toggle. A
 *   keyboard press leaves focus on the toggle.
 * - Submitting or resetting the surrounding form hides the password again, so a
 *   revealed value is never left as plain text.
 * - Disabling the root, or the surrounding Field, disables the toggle too. A
 *   read-only input can still be revealed.
 */

type PasswordInputVisibilityChangeReason = "toggle" | "submit" | "reset";

interface PasswordInputVisibilityChangeDetails {
  reason: PasswordInputVisibilityChangeReason;
}

interface PasswordInputContextValue {
  controlDisabled: boolean;
  controlId: string;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setControlDisabled: (disabled: boolean) => void;
  setControlId: (id: string) => void;
  setVisible: (visible: boolean, details: PasswordInputVisibilityChangeDetails) => void;
  visible: boolean;
}

const PasswordInputContext = React.createContext<PasswordInputContextValue | null>(null);

const usePasswordInputContext = (part: string) => {
  const context = React.useContext(PasswordInputContext);

  if (context === null) {
    throw new Error(`${part} must be used inside PasswordInputRoot.`);
  }

  return context;
};

type Selection = Pick<HTMLInputElement, "selectionDirection" | "selectionEnd" | "selectionStart">;

type PasswordInputRootProps = Omit<React.ComponentProps<typeof InputGroup>, "onChange"> & {
  /** Whether the password shows as text. Controls the visibility. */
  visible?: boolean;
  /** Initial visibility when uncontrolled. */
  defaultVisible?: boolean;
  /** Called before the visibility changes: on a toggle press, form submit or form reset. */
  onVisibleChange?: (visible: boolean, details: PasswordInputVisibilityChangeDetails) => void;
  /** Disables the input and the toggle. */
  disabled?: boolean;
};

/** InputGroup that holds the visibility state shared by the control and the toggle. */
const PasswordInputRoot = ({
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  disabled = false,
  className,
  ...props
}: PasswordInputRootProps) => {
  const [uncontrolledVisible, setUncontrolledVisible] = React.useState(defaultVisible);
  const visible = visibleProp ?? uncontrolledVisible;
  const generatedId = React.useId();
  const [controlId, setControlId] = React.useState(generatedId);
  const [controlDisabled, setControlDisabled] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const selection = React.useRef<Selection | null>(null);

  const setVisible = React.useCallback(
    (next: boolean, details: PasswordInputVisibilityChangeDetails) => {
      if (next === visible) {
        return;
      }

      // Changing the input type can move the caret; remember it to restore it.
      const input = inputRef.current;
      selection.current =
        input !== null && input.ownerDocument.activeElement === input
          ? {
              selectionDirection: input.selectionDirection,
              selectionEnd: input.selectionEnd,
              selectionStart: input.selectionStart,
            }
          : null;

      onVisibleChange?.(next, details);

      if (visibleProp === undefined) {
        setUncontrolledVisible(next);
      }
    },
    [onVisibleChange, visible, visibleProp],
  );

  // After a visibility change re-renders the input, restore the saved caret.
  React.useLayoutEffect(() => {
    const input = inputRef.current;
    const saved = selection.current;
    selection.current = null;

    if (
      input === null ||
      saved === null ||
      saved.selectionStart === null ||
      saved.selectionEnd === null ||
      input.ownerDocument.activeElement !== input
    ) {
      return;
    }

    input.setSelectionRange(
      saved.selectionStart,
      saved.selectionEnd,
      saved.selectionDirection ?? undefined,
    );
  });

  const context = React.useMemo<PasswordInputContextValue>(
    () => ({
      controlDisabled,
      controlId,
      disabled,
      inputRef,
      setControlDisabled,
      setControlId,
      setVisible,
      visible,
    }),
    [controlDisabled, controlId, disabled, setVisible, visible],
  );

  return (
    <PasswordInputContext.Provider value={context}>
      <InputGroup
        data-slot="password-input"
        data-visible={visible ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={className}
        {...props}
      />
    </PasswordInputContext.Provider>
  );
};

type PasswordInputControlProps = Omit<React.ComponentProps<typeof InputGroupInput>, "type">;

/**
 * The password `<input>`: `type="password"`, or `type="text"` while shown. It
 * works with Field like any input and defaults to `autoComplete="current-password"`;
 * pass `autoComplete="new-password"` on sign-up and password-change forms.
 */
const PasswordInputControl = ({
  autoCapitalize = "off",
  autoComplete = "current-password",
  className,
  disabled,
  id,
  ref,
  spellCheck = false,
  ...props
}: PasswordInputControlProps) => {
  const context = usePasswordInputContext("PasswordInputControl");
  const { controlId, inputRef, setControlDisabled, setControlId, setVisible, visible } = context;
  const inputId = id ?? controlId;

  React.useEffect(() => {
    setControlId(inputId);
  }, [inputId, setControlId]);

  // A disabled Field disables the input without a prop; mirror it on the toggle.
  React.useLayoutEffect(() => {
    setControlDisabled(inputRef.current?.disabled ?? false);
  });

  // Hide the password when the form is sent or reset.
  React.useEffect(() => {
    const form = inputRef.current?.form;

    const hideOnSubmit = () => {
      setVisible(false, { reason: "submit" });
    };

    const hideOnReset = () => {
      setVisible(false, { reason: "reset" });
    };

    form?.addEventListener("submit", hideOnSubmit);
    form?.addEventListener("reset", hideOnReset);

    return () => {
      form?.removeEventListener("submit", hideOnSubmit);
      form?.removeEventListener("reset", hideOnReset);
    };
  }, [inputRef, setVisible]);

  return useRender({
    props: {
      ...props,
      autoCapitalize,
      autoComplete,
      // Hide the browser's own reveal and clear buttons (Edge).
      className: cn("[&::-ms-clear]:hidden [&::-ms-reveal]:hidden", className),
      "data-visible": visible ? "" : undefined,
      disabled: context.disabled || disabled,
      id: inputId,
      spellCheck,
      type: visible ? "text" : "password",
    },
    ref: [inputRef, ref ?? null],
    render: <InputGroupInput />,
  });
};

/** The toggle's icon: eye-off while hidden, eye while shown. Hidden from assistive technology. */
const PasswordInputIndicator = ({ className }: { className?: string }) => {
  const { visible } = usePasswordInputContext("PasswordInputIndicator");

  return (
    <StatefulIcon
      className={className}
      state={visible ? "visible" : "hidden"}
      icons={{
        hidden: <Icon name="eye-off" />,
        visible: <Icon name="eye" />,
      }}
    />
  );
};

type PasswordInputToggleProps = Omit<
  TogglePrimitive.Props,
  "defaultPressed" | "onPressedChange" | "pressed" | "value"
>;

/** Shows or hides the password. Place it in an `InputGroupAddon`. */
const PasswordInputToggle = ({
  "aria-label": ariaLabel = "Show password",
  children,
  className,
  disabled,
  onClick,
  onMouseDown,
  ...props
}: PasswordInputToggleProps) => {
  const context = usePasswordInputContext("PasswordInputToggle");
  const { controlId, inputRef, setVisible, visible } = context;

  return (
    <TogglePrimitive
      data-slot="password-input-toggle"
      aria-label={ariaLabel}
      aria-controls={controlId}
      pressed={visible}
      disabled={context.disabled || context.controlDisabled || disabled}
      onPressedChange={(pressed) => {
        setVisible(pressed, { reason: "toggle" });
      }}
      onMouseDown={(event) => {
        onMouseDown?.(event);

        // Keep focus, caret and selection in the input on a pointer press.
        if (!event.defaultPrevented) {
          event.preventDefault();
        }
      }}
      onClick={(event) => {
        onClick?.(event);

        const input = inputRef.current;

        // `detail` is 0 for a keyboard press, which keeps focus on the toggle.
        if (event.detail > 0 && input !== null && input.ownerDocument.activeElement !== input) {
          input.focus({ preventScroll: true });
        }
      }}
      render={
        <InputGroupButton
          size="icon-sm"
          // An invalid input paints the eye in the error color, like the label and border.
          className="group-has-[>[data-slot=input-group-control][aria-invalid=true]]/input-group:text-error [&_svg:not([class*='size-'])]:size-control-icon"
        />
      }
      className={className}
      {...props}
    >
      {children ?? <PasswordInputIndicator />}
    </TogglePrimitive>
  );
};

type PasswordInputProps = PasswordInputControlProps &
  Pick<PasswordInputRootProps, "defaultVisible" | "loading" | "onVisibleChange" | "visible"> & {
    /** Class names for the InputGroup frame. `className` styles the input. */
    groupClassName?: string;
    /** Ref to the InputGroup frame, e.g. to animate the whole control. */
    groupRef?: React.Ref<HTMLFieldSetElement>;
    /** Accessible name of the toggle. Defaults to "Show password". */
    toggleLabel?: string;
  };

/** A password input with its show/hide toggle. Props go to the `<input>`. */
const PasswordInput = ({
  defaultVisible,
  disabled,
  groupClassName,
  groupRef,
  loading,
  onVisibleChange,
  toggleLabel,
  visible,
  ...props
}: PasswordInputProps) => (
  <PasswordInputRoot
    ref={groupRef}
    className={groupClassName}
    defaultVisible={defaultVisible}
    disabled={disabled}
    loading={loading}
    onVisibleChange={onVisibleChange}
    visible={visible}
  >
    <PasswordInputControl {...props} />
    <InputGroupAddon align="inline-end">
      <PasswordInputToggle aria-label={toggleLabel} />
    </InputGroupAddon>
  </PasswordInputRoot>
);

export {
  PasswordInput,
  PasswordInputControl,
  PasswordInputIndicator,
  PasswordInputRoot,
  PasswordInputToggle,
};

export type {
  PasswordInputControlProps,
  PasswordInputProps,
  PasswordInputRootProps,
  PasswordInputToggleProps,
  PasswordInputVisibilityChangeDetails,
  PasswordInputVisibilityChangeReason,
};
