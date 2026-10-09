import { CheckboxStateIcon } from "./stateful-icon";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { mergeProps } from "@base-ui/react/merge-props";
import { flushSync } from "react-dom";

import { useDragSelect } from "../hooks/use-drag-select";
import { cn } from "../lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-choice shrink-0 items-center justify-center rounded-lg border border-input transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-card:not-aria-invalid:ring-0 group-has-focus-visible/field-card:not-data-checked:not-aria-invalid:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:hover:scale-105 not-data-disabled:not-data-readonly:active:scale-95 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo aria-invalid:focus-visible:border-error aria-invalid:data-checked:border-error aria-invalid:data-indeterminate:border-error motion-reduce:transition-none dark:bg-input/30 dark:aria-invalid:border-invalid dark:aria-invalid:focus-visible:border-invalid dark:aria-invalid:data-checked:border-invalid dark:aria-invalid:data-indeterminate:border-invalid data-checked:border-selection data-checked:bg-selection data-checked:text-selection-foreground data-indeterminate:border-selection data-indeterminate:bg-selection data-indeterminate:text-selection-foreground group-has-focus-visible/field-card:data-checked:not-aria-invalid:border-selection dark:data-checked:bg-selection dark:data-indeterminate:bg-selection",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        className="group/check-indicator grid place-content-center text-current"
      >
        <CheckboxStateIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// Drag targets every checkbox except the `parent`, which follows its children.
const DRAGGABLE = '[data-slot="checkbox"]:not([data-parent])';

const checkboxesIn = (group: HTMLElement) => [...group.querySelectorAll<HTMLElement>(DRAGGABLE)];

const isEditable = (checkbox: HTMLElement) =>
  !checkbox.hasAttribute("data-disabled") && !checkbox.hasAttribute("data-readonly");

// The row under the pointer is its closest ancestor holding exactly one checkbox,
// so labels, `Field`s, and plain wrappers all work as rows.
function checkboxAt(target: Element, group: HTMLElement) {
  for (let node: Element | null = target; node && node !== group; node = node.parentElement) {
    const found = node.matches(DRAGGABLE) ? [node] : node.querySelectorAll(DRAGGABLE);
    if (found.length > 0) {
      return found.length === 1 ? (found[0] as HTMLElement) : null;
    }
  }
  return null;
}

/** Shares one `value` array across checkboxes. Press a row and drag to set the rows it crosses. */
function CheckboxGroup({ className, ...props }: CheckboxGroupPrimitive.Props) {
  const dragSelect = useDragSelect({
    resolve(target, group) {
      const checkbox = checkboxAt(target, group);
      if (!checkbox || !isEditable(checkbox)) {
        return null;
      }
      return {
        index: checkboxesIn(group).indexOf(checkbox),
        selected: checkbox.hasAttribute("data-checked"),
      };
    },
    selectRange(start, end, selected, group) {
      for (const checkbox of checkboxesIn(group).slice(start, end + 1)) {
        if (isEditable(checkbox) && checkbox.hasAttribute("data-checked") !== selected) {
          // A real click keeps Base UI's value, form state, and callbacks in charge. Flush each one
          // because a group with a `parent` checkbox computes the next value from the last render.
          flushSync(() => checkbox.click());
        }
      }
    },
  });

  return (
    <CheckboxGroupPrimitive
      data-slot="checkbox-group"
      className={cn("flex flex-col gap-3", className)}
      {...mergeProps(dragSelect, props)}
    />
  );
}

export { Checkbox, CheckboxGroup };
