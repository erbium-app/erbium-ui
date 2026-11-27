import { CheckboxStateIcon } from "./stateful-icon";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { mergeProps } from "@base-ui/react/merge-props";
// oxlint-disable-next-line react-doctor/no-flush-sync -- drag select flushes each click, because a group with a parent checkbox computes the next value from the last render.
import { flushSync } from "react-dom";

import { useDragSelect } from "../hooks/use-drag-select";
import { skeletonBlock } from "../lib/skeleton-hints";
import { checkboxClassName, checkboxIndicatorClassName } from "../lib/choice-styles";
import { cn } from "../lib/utils";

const Checkbox = ({ className, ...props }: CheckboxPrimitive.Root.Props) => (
  <CheckboxPrimitive.Root
    data-slot="checkbox"
    {...skeletonBlock}
    data-choice=""
    className={cn(checkboxClassName, className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      keepMounted
      className={checkboxIndicatorClassName}
    >
      <CheckboxStateIcon />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

// Drag targets every checkbox except the `parent`, which follows its children.
const DRAGGABLE = '[data-slot="checkbox"]:not([data-parent])';

const checkboxesIn = (group: HTMLElement) => [...group.querySelectorAll<HTMLElement>(DRAGGABLE)];

const isEditable = (checkbox: HTMLElement) =>
  !Object.hasOwn(checkbox.dataset, "disabled") && !Object.hasOwn(checkbox.dataset, "readonly");

// The row under the pointer is its closest ancestor holding exactly one checkbox,
// so labels, `Field`s, and plain wrappers all work as rows.
const checkboxAt = (target: Element, group: HTMLElement) => {
  for (let node: Element | null = target; node && node !== group; node = node.parentElement) {
    const found = node.matches(DRAGGABLE) ? [node] : node.querySelectorAll(DRAGGABLE);

    if (found.length > 0) {
      const [only] = found;

      return found.length === 1 && only instanceof HTMLElement ? only : null;
    }
  }

  return null;
};

/** Shares one `value` array across checkboxes. Press a row and drag to set the rows it crosses. */
const CheckboxGroup = ({ className, ...props }: CheckboxGroupPrimitive.Props) => {
  const dragSelect = useDragSelect({
    resolve(target, group) {
      const checkbox = checkboxAt(target, group);

      if (!checkbox || !isEditable(checkbox)) {
        return null;
      }

      return {
        index: checkboxesIn(group).indexOf(checkbox),
        selected: Object.hasOwn(checkbox.dataset, "checked"),
      };
    },
    selectRange(start, end, selected, group) {
      for (const checkbox of checkboxesIn(group).slice(start, end + 1)) {
        if (isEditable(checkbox) && Object.hasOwn(checkbox.dataset, "checked") !== selected) {
          // A real click keeps Base UI's value, form state, and callbacks in charge. Flush each one
          // because a group with a `parent` checkbox computes the next value from the last render.
          flushSync(() => {
            checkbox.click();
          });
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
};

export { Checkbox, CheckboxGroup };
