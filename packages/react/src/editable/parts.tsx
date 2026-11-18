import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { createChangeDetails } from "../internal/change-details";
import type { ChangeDetails } from "../internal/change-details";
import { dataFlag, missingContext } from "../internal/dom";
import { useControlledState } from "../internal/use-controlled-state";

// Reasons

/** What started editing. */
type EditableActivationReason = "click" | "dblclick" | "focus" | "trigger-press";

/** What committed the draft. */
type EditableSubmitReason = "enter" | "blur" | "submit-press";

/** What discarded the draft. */
type EditableCancelReason = "escape" | "blur" | "cancel-press";

type EditableEditingReason = EditableActivationReason | EditableSubmitReason | EditableCancelReason;

type EditableSubmitDetails = ChangeDetails<EditableSubmitReason>;

type EditableCancelDetails = ChangeDetails<EditableCancelReason>;

type EditableEditingChangeDetails = ChangeDetails<EditableEditingReason>;

type NativeEvent = Event | { nativeEvent: Event };

// State and context

/** The state every part exposes as data attributes and to `className` and `render` functions. */
interface EditableState extends Record<string, unknown> {
  editing: boolean;
  /** The committed value is empty. */
  empty: boolean;
  disabled: boolean;
  readOnly: boolean;
}

interface EditableContextValue {
  state: EditableState;
  value: string;
  draft: string;
  placeholder: string | undefined;
  activationMode: "click" | "dblclick" | "focus" | "none";
  selectOnEdit: boolean;
  maxLength: number | undefined;
  required: boolean;
  setDraft: (draft: string) => void;
  edit: (reason: EditableActivationReason, event?: NativeEvent) => void;
  submit: (reason: EditableSubmitReason, event?: NativeEvent) => void;
  cancel: (reason: EditableCancelReason, event?: NativeEvent) => void;
  /** Whether the blur leaves the editable, rather than moving to another of its parts. */
  leaves: (next: EventTarget | null) => boolean;
  rootRef: React.RefObject<HTMLElement | null>;
  previewRef: React.RefObject<HTMLElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  /** Set while focus is returned to the preview, so `activationMode="focus"` does not reopen. */
  returningFocus: React.RefObject<boolean>;
}

const EditableContext = React.createContext<EditableContextValue | null>(null);

const useEditableContext = (part: string) =>
  React.use(EditableContext) ?? missingContext(part, "<Editable.Root>");

const dataAttributes = (state: EditableState) => ({
  "data-disabled": dataFlag(state.disabled),
  "data-editing": dataFlag(state.editing),
  "data-empty": dataFlag(state.empty),
  "data-readonly": dataFlag(state.readOnly),
});

// Root

interface EditableRootProps extends Omit<
  useRender.ComponentProps<"div", EditableState>,
  "onSubmit" | "defaultValue"
> {
  /** The committed value. */
  value?: string;
  defaultValue?: string;
  /**
   * Called when a commit changes the value. `details.cancel()` rejects the commit and keeps
   * editing.
   */
  onValueChange?: (value: string, details: EditableSubmitDetails) => void;
  editing?: boolean;
  defaultEditing?: boolean;
  /** Called when editing starts or ends. `details.cancel()` keeps the current mode. */
  onEditingChange?: (editing: boolean, details: EditableEditingChangeDetails) => void;
  /** Called on every commit, also when the value did not change. */
  onSubmit?: (value: string, details: EditableSubmitDetails) => void;
  /** Called when the draft is discarded. */
  onCancel?: (details: EditableCancelDetails) => void;
  /** What on the preview starts editing. @default "click" */
  activationMode?: "click" | "dblclick" | "focus" | "none";
  /** What commits the draft. Blur cancels when it does not commit. @default "both" */
  submitMode?: "enter" | "blur" | "both" | "none";
  /** Selects the text when editing starts; otherwise the caret goes to the end. @default true */
  selectOnEdit?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  maxLength?: number;
  /** Submits the committed value with a form under this name. */
  name?: string;
}

/** Text that reads as text and becomes an input in place. Renders a `<div>`. */
const EditableRoot = ({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  editing: editingProp,
  defaultEditing = false,
  onEditingChange,
  onSubmit,
  onCancel,
  activationMode = "click",
  submitMode = "both",
  selectOnEdit = true,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  maxLength,
  name,
  render,
  children,
  ...props
}: EditableRootProps) => {
  const [value, setValue] = useControlledState(valueProp, defaultValue);
  const [editing, setEditing] = useControlledState(editingProp, defaultEditing);
  const [draft, setDraft] = React.useState(value);
  const rootRef = React.useRef<HTMLElement | null>(null);
  const previewRef = React.useRef<HTMLElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const returningFocus = React.useRef(false);
  // Where focus goes when editing ends by key or button: the part that started it.
  const returnTo = React.useRef<"preview" | "trigger">("preview");
  // Whether the end of the current edit should move focus back.
  const restoreFocus = React.useRef(false);

  const state = React.useMemo<EditableState>(
    () => ({ disabled, editing, empty: value === "", readOnly }),
    [disabled, editing, readOnly, value],
  );

  // Moves focus when the mode changes: into the input when editing starts, and back to the part
  // that started it when a key or button ends it.
  const onModeChange = React.useEffectEvent((isEditing: boolean) => {
    if (isEditing) {
      const input = inputRef.current;

      input?.focus();

      if (selectOnEdit) {
        input?.select();
      } else {
        input?.setSelectionRange(input.value.length, input.value.length);
      }

      return;
    }

    if (restoreFocus.current) {
      restoreFocus.current = false;
      const target = returnTo.current === "trigger" ? triggerRef.current : previewRef.current;

      returningFocus.current = true;
      target?.focus();
      returningFocus.current = false;
    }
  });

  React.useEffect(() => {
    onModeChange(editing);
  }, [editing]);

  const context = React.useMemo<EditableContextValue>(() => {
    const changeEditing = (next: boolean, reason: EditableEditingReason, event?: NativeEvent) => {
      const details = createChangeDetails(reason, event);

      onEditingChange?.(next, details);

      if (!details.isCanceled) {
        setEditing(next);
      }
    };

    const edit = (reason: EditableActivationReason, event?: NativeEvent) => {
      if (disabled || readOnly || editing) {
        return;
      }

      returnTo.current = reason === "trigger-press" ? "trigger" : "preview";
      setDraft(value);
      changeEditing(true, reason, event);
    };

    const commit = (reason: EditableSubmitReason, event?: NativeEvent) => {
      const details = createChangeDetails(reason, event);

      if (draft !== value) {
        onValueChange?.(draft, details);

        if (details.isCanceled) {
          return;
        }

        setValue(draft);
      }

      onSubmit?.(draft, details);
      restoreFocus.current = reason !== "blur";
      changeEditing(false, reason, event);
    };

    const cancel = (reason: EditableCancelReason, event?: NativeEvent) => {
      if (!editing) {
        return;
      }

      const details = createChangeDetails(reason, event);

      onCancel?.(details);

      if (details.isCanceled) {
        return;
      }

      setDraft(value);
      restoreFocus.current = reason !== "blur";
      changeEditing(false, reason, event);
    };

    // Enter and blur commit only when the submit mode includes them; a blur that does not
    // commit discards the draft.
    const submit = (reason: EditableSubmitReason, event?: NativeEvent) => {
      if (!editing) {
        return;
      }

      const byEnter = submitMode === "enter" || submitMode === "both";
      const byBlur = submitMode === "blur" || submitMode === "both";

      if (reason === "enter" && !byEnter) {
        return;
      }

      if (reason === "blur" && !byBlur) {
        cancel("blur", event);

        return;
      }

      commit(reason, event);
    };

    return {
      activationMode,
      cancel,
      draft,
      edit,
      inputRef,
      leaves: (next) => !(next instanceof Node && rootRef.current?.contains(next) === true),
      maxLength,
      placeholder,
      previewRef,
      required,
      returningFocus,
      rootRef,
      selectOnEdit,
      setDraft,
      state,
      submit,
      triggerRef,
      value,
    };
  }, [
    activationMode,
    disabled,
    draft,
    editing,
    maxLength,
    onCancel,
    onEditingChange,
    onSubmit,
    onValueChange,
    placeholder,
    readOnly,
    required,
    selectOnEdit,
    setEditing,
    setValue,
    state,
    submitMode,
    value,
  ]);

  const element = useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ children, ...dataAttributes(state) }, props),
    ref: rootRef,
    render,
    state,
  });

  return (
    <EditableContext value={context}>
      {element}
      {name === undefined ? null : (
        <input type="hidden" name={name} value={value} disabled={disabled} />
      )}
    </EditableContext>
  );
};

// Preview

/**
 * A `<button>` that shows the value, or the placeholder with `data-empty`, and starts editing per
 * `activationMode`. While editing it stays in the layout, hidden from assistive technology, so an
 * input laid over it keeps its size.
 */
const EditablePreview = ({
  render,
  children,
  ...props
}: useRender.ComponentProps<"button", EditableState>) => {
  const context = useEditableContext("Editable.Preview");
  const { state } = context;

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-hidden": state.editing || undefined,
        // A no-break space keeps an empty preview one line tall.
        children: children ?? (context.value === "" ? (context.placeholder ?? " ") : context.value),
        disabled: state.disabled || state.readOnly,
        onClick: (event) => {
          if (context.activationMode === "click") {
            context.edit("click", event);
          }
        },
        onDoubleClick: (event) => {
          if (context.activationMode === "dblclick") {
            context.edit("dblclick", event);
          }
        },
        onFocus: (event) => {
          if (context.activationMode === "focus" && !context.returningFocus.current) {
            context.edit("focus", event);
          }
        },
        tabIndex: state.editing ? -1 : undefined,
        type: "button",
        ...dataAttributes(state),
      },
      props,
    ),
    ref: context.previewRef,
    render,
    state,
  });
};

// Input

/**
 * The `<input>` that edits the draft. It is rendered in both modes, so it can share the preview's
 * box and text metrics, and is inert while not editing. Render a `<textarea>` through `render`
 * for multiline text: Enter then inserts a line, and Ctrl or Cmd with Enter commits.
 */
const EditableInput = ({
  render,
  ...props
}: Omit<useRender.ComponentProps<"input", EditableState>, "value" | "defaultValue">) => {
  const context = useEditableContext("Editable.Input");
  const { state } = context;

  return useRender({
    defaultTagName: "input",
    props: mergeProps<"input">(
      {
        "aria-hidden": !state.editing || undefined,
        "aria-required": context.required || undefined,
        disabled: state.disabled,
        maxLength: context.maxLength,
        onBlur: (event) => {
          if (state.editing && context.leaves(event.relatedTarget)) {
            context.submit("blur", event);
          }
        },
        onChange: (event) => {
          context.setDraft(event.currentTarget.value);
        },
        onKeyDown: (event) => {
          // IME composition uses Enter and Escape to confirm or drop candidates.
          // Safari reports the Enter that ends a composition with isComposing false and the
          // composition key code 229.
          // oxlint-disable-next-line typescript/no-deprecated -- keyCode is the only signal Safari gives.
          if (!state.editing || event.nativeEvent.isComposing || event.keyCode === 229) {
            return;
          }

          if (event.key === "Escape") {
            event.preventDefault();
            context.cancel("escape", event);
          } else if (event.key === "Enter") {
            const multiline = event.currentTarget.tagName === "TEXTAREA";

            if (multiline && !event.ctrlKey && !event.metaKey) {
              return;
            }

            event.preventDefault();
            context.submit("enter", event);
          }
        },
        placeholder: context.placeholder,
        readOnly: !state.editing || state.readOnly,
        tabIndex: state.editing ? undefined : -1,
        value: state.editing ? context.draft : context.value,
        ...dataAttributes(state),
      },
      props,
    ),
    ref: context.inputRef,
    render,
    state,
  });
};

// Buttons

/** Keeps focus in the input while a button is pressed, so blur does not end the edit first. */
const keepInputFocus = (event: React.PointerEvent) => {
  event.preventDefault();
};

/** A `<button>` that starts editing. Renders nothing while editing. */
const EditableTrigger = ({
  render,
  ...props
}: useRender.ComponentProps<"button", EditableState>) => {
  const context = useEditableContext("Editable.Trigger");
  const { state } = context;

  const element = useRender({
    defaultTagName: "button",
    enabled: !state.editing,
    props: mergeProps<"button">(
      {
        disabled: state.disabled || state.readOnly,
        onClick: (event) => {
          context.edit("trigger-press", event);
        },
        type: "button",
        ...dataAttributes(state),
      },
      props,
    ),
    ref: context.triggerRef,
    render,
    state,
  });

  return state.editing ? null : element;
};

/** A `<button>` that commits the draft. Renders only while editing. */
const EditableSubmit = ({
  render,
  ...props
}: useRender.ComponentProps<"button", EditableState>) => {
  const context = useEditableContext("Editable.Submit");
  const { state } = context;

  const element = useRender({
    defaultTagName: "button",
    enabled: state.editing,
    props: mergeProps<"button">(
      {
        onClick: (event) => {
          context.submit("submit-press", event);
        },
        onPointerDown: keepInputFocus,
        type: "button",
        ...dataAttributes(state),
      },
      props,
    ),
    render,
    state,
  });

  return state.editing ? element : null;
};

/** A `<button>` that discards the draft. Renders only while editing. */
const EditableCancel = ({
  render,
  ...props
}: useRender.ComponentProps<"button", EditableState>) => {
  const context = useEditableContext("Editable.Cancel");
  const { state } = context;

  const element = useRender({
    defaultTagName: "button",
    enabled: state.editing,
    props: mergeProps<"button">(
      {
        onClick: (event) => {
          context.cancel("cancel-press", event);
        },
        onPointerDown: keepInputFocus,
        type: "button",
        ...dataAttributes(state),
      },
      props,
    ),
    render,
    state,
  });

  return state.editing ? element : null;
};

export {
  EditableCancel,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableSubmit,
  EditableTrigger,
};

export type {
  EditableActivationReason,
  EditableCancelDetails,
  EditableCancelReason,
  EditableEditingChangeDetails,
  EditableEditingReason,
  EditableRootProps,
  EditableState,
  EditableSubmitDetails,
  EditableSubmitReason,
};
