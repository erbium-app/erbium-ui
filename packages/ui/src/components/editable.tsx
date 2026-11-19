import { Editable as EditablePrimitive } from "@erbium-ui/react/editable";
import type { EditableRootProps } from "@erbium-ui/react/editable";
import { cn } from "../lib/utils";

/*
 * Erbium's Editable on the @erbium-ui/react editable primitive, which owns the draft, commits and
 * cancels, keys, blur and focus return. The design is one inline box: the input lies over the
 * preview, which keeps the box's size, and shows the value while not editing.
 */

type EditableProps = Omit<
  EditableRootProps,
  | "activationMode"
  | "className"
  | "onCancel"
  | "onEditingChange"
  | "onSubmit"
  | "onValueChange"
  | "render"
  | "submitMode"
> & {
  className?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onCancel?: () => void;
  onEditingChange?: (editing: boolean) => void;
  /** What on the text starts editing. @default "click" */
  triggerMode?: "click" | "doubleClick";
};

const Editable = ({ triggerMode = "click", className, ...props }: EditableProps) => (
  <EditablePrimitive.Root
    {...props}
    activationMode={triggerMode === "doubleClick" ? "dblclick" : "click"}
    data-slot="editable"
    render={<span />}
    className={cn("relative inline-grid max-w-full min-w-[2ch] align-middle text-field", className)}
  />
);

type EditablePreviewProps = Omit<
  React.ComponentProps<typeof EditablePrimitive.Preview>,
  "className"
> & {
  className?: string;
};

const EditablePreview = ({ className, ...props }: EditablePreviewProps) => (
  <EditablePrimitive.Preview
    data-slot="editable-preview"
    className={cn(
      "block w-full min-w-0 truncate border-0 bg-transparent p-0 text-start text-editable text-inherit outline-none not-data-readonly:not-data-disabled:cursor-text disabled:cursor-default data-empty:text-muted-foreground",
      "opacity-0",
      className,
    )}
    {...props}
  />
);

type EditableInputProps = Omit<
  React.ComponentProps<typeof EditablePrimitive.Input>,
  "className"
> & {
  className?: string;
};

const EditableInput = ({ className, ...props }: EditableInputProps) => (
  <EditablePrimitive.Input
    type="text"
    data-slot="editable-input"
    className={cn(
      "absolute inset-0 block size-full min-w-0 rounded-none border-0 bg-transparent p-0 text-start text-editable text-inherit outline-none not-data-editing:pointer-events-none placeholder:text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export { Editable, EditableInput, EditablePreview };

export type { EditableProps };
