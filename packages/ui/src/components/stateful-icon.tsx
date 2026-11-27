import { Icon } from "./icon";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type StatefulIconProps<State extends string> = Omit<React.ComponentProps<"span">, "children"> & {
  /** The key of the icon or content to show. */
  state: State;
  /** Content to render for each state, such as Hugeicons or a Spinner. */
  icons: Readonly<Record<State, ReactNode>>;
};

// The classes are shared with markup built outside React, such as a streaming response's.
const statefulIconClassName = "inline-grid shrink-0 align-middle *:col-start-1 *:row-start-1";

const statefulIconItemClassName =
  "relative grid place-items-center transition-[scale,opacity] duration-ui ease-ui-out motion-reduce:transition-none";

const statefulIconStateClassNames = {
  active: "scale-100 opacity-100",
  inactive: "scale-50 opacity-0",
} as const;

const checkboxStateIconClassName = "inline-grid size-3.5 shrink-0";

const checkboxCheckClassName =
  "col-start-1 row-start-1 size-full opacity-0 transition-[opacity,stroke-dashoffset] duration-ui-fast [stroke-dasharray:32] [stroke-dashoffset:32] group-data-checked/check-indicator:opacity-100 group-data-checked/check-indicator:delay-75 group-data-checked/check-indicator:[stroke-dashoffset:0] motion-reduce:transition-none";

/**
 * Crossfades between caller-provided content when `state` changes. It is decorative, so name the
 * control around it.
 */
const StatefulIcon = <State extends string>({
  state,
  icons,
  className,
  ...props
}: StatefulIconProps<State>) => (
  <span
    aria-hidden="true"
    className={cn(statefulIconClassName, className)}
    data-slot="stateful-icon"
    data-state={state}
    {...props}
  >
    {Object.entries<ReactNode>(icons).map(([key, icon]) => {
      const active = key === state;

      return (
        <span
          className={cn(
            statefulIconItemClassName,
            statefulIconStateClassNames[active ? "active" : "inactive"],
          )}
          data-active={active}
          data-state={key}
          key={key}
        >
          {icon}
        </span>
      );
    })}
  </span>
);

type RotatingChevronProps = Omit<React.ComponentProps<typeof Icon>, "name"> & {
  /** Closed direction: down for content that expands below, inline-end for submenus. */
  direction?: "down" | "inline-end";
};

// Both turn half way while the trigger, marked `group/disclosure`, has `aria-expanded="true"`.
const chevrons = {
  down: { name: "chevron-down", rotation: "group-aria-expanded/disclosure:rotate-180" },
  "inline-end": {
    name: "chevron-right",
    rotation:
      "rtl:rotate-180 group-aria-expanded/disclosure:rotate-180 rtl:group-aria-expanded/disclosure:rotate-0",
  },
} as const;

/**
 * Chevron that turns while its disclosure trigger is open. The triggers in this library already
 * carry `group/disclosure`; add it to a custom trigger that sets `aria-expanded`.
 */
const RotatingChevron = ({ direction = "down", className, ...props }: RotatingChevronProps) => (
  <Icon
    name={chevrons[direction].name}
    aria-hidden="true"
    className={cn(
      "shrink-0 transition-[rotate] duration-ui ease-ui-move motion-reduce:transition-none",
      chevrons[direction].rotation,
      className,
    )}
    data-slot="rotating-chevron"
    {...props}
  />
);

/** Shared draw-on check and mixed mark. Place inside a keepMounted indicator with group/check-indicator. */
const CheckboxStateIcon = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    data-slot="checkbox-state-icon"
    className={cn(checkboxStateIconClassName, className)}
  >
    {/* Dash properties inherit into the sprite, so the draw-on runs on the svg itself. */}
    <Icon name="check" aria-hidden="true" className={checkboxCheckClassName} />
    <Icon
      name="minus"
      aria-hidden="true"
      className="col-start-1 row-start-1 size-full opacity-0 transition-[opacity,stroke-dashoffset] duration-ui-fast [stroke-dasharray:24] [stroke-dashoffset:24] group-data-indeterminate/check-indicator:opacity-100 group-data-indeterminate/check-indicator:[stroke-dashoffset:0] motion-reduce:transition-none"
    />
  </span>
);

export { CheckboxStateIcon, RotatingChevron, StatefulIcon };

export {
  checkboxCheckClassName,
  checkboxStateIconClassName,
  statefulIconClassName,
  statefulIconItemClassName,
  statefulIconStateClassNames,
};

export type { RotatingChevronProps, StatefulIconProps };
