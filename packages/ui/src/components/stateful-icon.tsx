import { HugeiconsIcon } from "@hugeicons/react";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "../lib/utils";

type StatefulIconProps<State extends string> = {
  /** The key of the icon or content to show. */
  state: State;
  /** Content to render for each state, such as Hugeicons or a Spinner. */
  icons: Readonly<Record<State, ReactNode>>;
  /** Accessible name for the current state. Omit when the icon is decorative. */
  labels?: Partial<Record<State, string>>;
  className?: string;
};

function StatefulIcon<State extends string>({
  state,
  icons,
  labels,
  className,
}: StatefulIconProps<State>) {
  const label = labels?.[state];

  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("inline-grid shrink-0 align-middle *:col-start-1 *:row-start-1", className)}
      data-slot="stateful-icon"
      data-state={state}
      role={label ? "img" : undefined}
    >
      <AnimatePresence mode="wait">
        <motion.span
          animate={{ rotate: 0, scale: 1 }}
          aria-hidden="true"
          className="col-start-1 row-start-1 grid place-items-center"
          data-active="true"
          data-state={state}
          exit={{ rotate: 90, scale: 0 }}
          initial={false}
          key={state}
          style={{ position: "relative" }}
          transition={{ duration: 0.15 }}
        >
          {icons[state]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type StatefulChevronProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  /** The closed orientation of the chevron. */
  direction?: "down" | "right" | "left";
};

function StatefulChevron({ direction = "down", className, ...props }: StatefulChevronProps) {
  const icon = direction === "down" ? ChevronDownIcon : ChevronRightIcon;
  const rotation = {
    down: "group-data-open:rotate-180 group-data-popup-open:rotate-180 group-data-panel-open:rotate-180",
    right:
      "rtl:rotate-180 group-data-open:rotate-90 group-data-popup-open:rotate-90 group-data-panel-open:rotate-90 rtl:group-data-open:rotate-[270deg] rtl:group-data-popup-open:rotate-[270deg] rtl:group-data-panel-open:rotate-[270deg]",
    left: "-rotate-90 group-data-open:rotate-0 group-data-popup-open:rotate-0 group-data-panel-open:rotate-0",
  }[direction];

  return (
    <HugeiconsIcon
      icon={icon}
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-200 ease-in-out motion-reduce:transition-none",
        rotation,
        className,
      )}
      data-slot="stateful-chevron"
      {...props}
    />
  );
}

export { StatefulChevron, StatefulIcon };
export type { StatefulChevronProps, StatefulIconProps };
