import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "../lib/utils";

type EditableContextValue = {
  value: string;
  draft: string;
  editing: boolean;
  disabled: boolean;
  readOnly: boolean;
  placeholder?: string;
  triggerMode: "click" | "doubleClick";
  inputId: string;
  previewRef: React.RefObject<HTMLButtonElement | null>;
  setDraft: (value: string) => void;
  beginEdit: () => void;
  finishEdit: (commit: boolean, restoreFocus?: boolean) => void;
};

const EditableContext = React.createContext<EditableContextValue | null>(null);

function useEditableContext(part: string) {
  const context = React.useContext(EditableContext);
  if (!context) throw new Error(`${part} must be used within Editable`);
  return context;
}

type EditableProps = Omit<React.ComponentProps<"span">, "onSubmit"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  editing?: boolean;
  defaultEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  placeholder?: string;
  triggerMode?: "click" | "doubleClick";
  disabled?: boolean;
  readOnly?: boolean;
};

function Editable({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onCancel,
  editing: editingProp,
  defaultEditing = false,
  onEditingChange,
  placeholder,
  triggerMode = "click",
  disabled = false,
  readOnly = false,
  className,
  children,
  ...props
}: EditableProps) {
  const [localValue, setLocalValue] = React.useState(defaultValue);
  const [localEditing, setLocalEditing] = React.useState(defaultEditing);
  const value = valueProp ?? localValue;
  const editing = editingProp ?? localEditing;
  const [draft, setDraft] = React.useState(value);
  const inputId = React.useId();
  const previewRef = React.useRef<HTMLButtonElement>(null);

  function setEditing(next: boolean) {
    if (editingProp === undefined) setLocalEditing(next);
    onEditingChange?.(next);
  }

  function beginEdit() {
    if (disabled || readOnly || editing) return;
    setDraft(value);
    setEditing(true);
  }

  function finishEdit(commit: boolean, restoreFocus = false) {
    if (!editing) return;
    if (commit) {
      if (draft !== value) {
        if (valueProp === undefined) setLocalValue(draft);
        onValueChange?.(draft);
      }
      onSubmit?.(draft);
    } else {
      setDraft(value);
      onCancel?.();
    }
    setEditing(false);
    if (restoreFocus) {
      queueMicrotask(() => previewRef.current?.focus());
    }
  }

  return (
    <EditableContext.Provider
      value={{
        value,
        draft,
        editing,
        disabled,
        readOnly,
        placeholder,
        triggerMode,
        inputId,
        previewRef,
        setDraft,
        beginEdit,
        finishEdit,
      }}
    >
      <span
        data-slot="editable"
        data-editing={editing ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        className={cn("relative inline-grid min-w-[2ch] max-w-full align-middle", className)}
        {...props}
      >
        {children}
      </span>
    </EditableContext.Provider>
  );
}

function EditablePreview({
  className,
  onClick,
  onDoubleClick,
  children,
  ...props
}: ButtonPrimitive.Props) {
  const context = useEditableContext("EditablePreview");
  return (
    <ButtonPrimitive
      {...props}
      type="button"
      ref={context.previewRef}
      data-slot="editable-preview"
      data-empty={!context.value ? "" : undefined}
      data-interactive={!context.disabled && !context.readOnly ? "" : undefined}
      disabled={context.disabled || context.readOnly}
      aria-hidden={context.editing || undefined}
      tabIndex={context.editing ? -1 : props.tabIndex}
      className={cn(
        "block w-full min-w-0 truncate border-0 bg-transparent p-0 text-start text-inherit leading-[inherit] tracking-[inherit] font-[inherit] text-[length:inherit] outline-none placeholder:text-muted-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default data-empty:text-muted-foreground data-interactive:cursor-text",
        "opacity-0",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && context.triggerMode === "click") context.beginEdit();
      }}
      onDoubleClick={(event) => {
        onDoubleClick?.(event);
        if (!event.defaultPrevented && context.triggerMode === "doubleClick") context.beginEdit();
      }}
    >
      {children ?? (context.value || context.placeholder || "\u00a0")}
    </ButtonPrimitive>
  );
}

function EditableInput({
  className,
  onBlur,
  onChange,
  onKeyDown,
  ...props
}: Omit<InputPrimitive.Props, "value" | "defaultValue">) {
  const context = useEditableContext("EditableInput");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (context.editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [context.editing]);

  return (
    <InputPrimitive
      {...props}
      type="text"
      id={context.inputId}
      ref={inputRef}
      data-slot="editable-input"
      data-editing={context.editing ? "" : undefined}
      disabled={context.disabled}
      readOnly={!context.editing || context.readOnly}
      aria-hidden={!context.editing || undefined}
      tabIndex={context.editing ? props.tabIndex : -1}
      placeholder={context.placeholder}
      value={context.editing ? context.draft : context.value}
      className={cn(
        "absolute inset-0 block size-full min-w-0 rounded-none border-0 bg-transparent p-0 text-start text-inherit leading-[inherit] tracking-[inherit] font-[inherit] text-[length:inherit] outline-none placeholder:text-muted-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring not-data-editing:pointer-events-none",
        className,
      )}
      onChange={(event) => {
        onChange?.(event);
        if (!event.defaultPrevented) context.setDraft(event.currentTarget.value);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.defaultPrevented) context.finishEdit(true);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.nativeEvent.isComposing) return;
        if (event.key === "Enter") {
          event.preventDefault();
          context.finishEdit(true, true);
        } else if (event.key === "Escape") {
          event.preventDefault();
          context.finishEdit(false, true);
        }
      }}
    />
  );
}

export { Editable, EditablePreview, EditableInput };
export type { EditableProps };
