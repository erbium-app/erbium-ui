import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { mergeProps } from "@base-ui/react/merge-props";
import CheckIcon from "@hugeicons/core-free-icons/CheckIcon";
import MinusIcon from "@hugeicons/core-free-icons/MinusIcon";
import { HugeiconsIcon } from "@hugeicons/react";
import { flushSync } from "react-dom";

import { useDragSelect } from "../hooks/use-drag-select";
import { cn } from "../lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-lg border border-input transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-label:not-aria-invalid:ring-0 group-has-focus-visible/field-label:not-data-checked:not-aria-invalid:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:hover:scale-105 not-data-disabled:not-data-readonly:active:scale-95 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-error/20 aria-invalid:focus-visible:border-error aria-invalid:data-checked:border-error aria-invalid:data-indeterminate:border-error motion-reduce:transition-none dark:bg-input/30 dark:aria-invalid:border-error/50 dark:aria-invalid:ring-error/40 dark:aria-invalid:focus-visible:border-error/50 dark:aria-invalid:data-checked:border-error/50 dark:aria-invalid:data-indeterminate:border-error/50 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground group-has-focus-visible/field-label:data-checked:not-aria-invalid:border-primary dark:data-checked:bg-primary dark:data-indeterminate:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        keepMounted
        className="group/checkbox-indicator grid place-content-center text-current"
      >
        <HugeiconsIcon
          aria-hidden="true"
          className="col-start-1 row-start-1 size-3.5 opacity-0 transition-opacity duration-120 group-data-checked/checkbox-indicator:opacity-100 group-data-checked/checkbox-indicator:delay-75 [&>path]:[stroke-dasharray:32] [&>path]:[stroke-dashoffset:32] [&>path]:transition-[stroke-dashoffset] [&>path]:duration-120 group-data-checked/checkbox-indicator:[&>path]:[stroke-dashoffset:0] group-data-checked/checkbox-indicator:[&>path]:delay-75 motion-reduce:transition-none motion-reduce:[&>path]:transition-none"
          icon={CheckIcon}
          strokeWidth={3.5}
        />
        <HugeiconsIcon
          aria-hidden="true"
          className="col-start-1 row-start-1 size-3.5 opacity-0 transition-opacity duration-120 group-data-indeterminate/checkbox-indicator:opacity-100 [&>path]:[stroke-dasharray:24] [&>path]:[stroke-dashoffset:24] [&>path]:transition-[stroke-dashoffset] [&>path]:duration-120 group-data-indeterminate/checkbox-indicator:[&>path]:[stroke-dashoffset:0] motion-reduce:transition-none motion-reduce:[&>path]:transition-none"
          icon={MinusIcon}
          strokeWidth={3.5}
        />
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
