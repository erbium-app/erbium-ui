import { HugeiconsIcon } from "@hugeicons/react";
import ChevronDownIcon from "@hugeicons/core-free-icons/ChevronDownIcon";
import ChevronRightIcon from "@hugeicons/core-free-icons/ChevronRightIcon";
import ChevronUpIcon from "@hugeicons/core-free-icons/ChevronUpIcon";
import Moon02Icon from "@hugeicons/core-free-icons/Moon02Icon";
import Sun03Icon from "@hugeicons/core-free-icons/Sun03Icon";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
          className="relative col-start-1 row-start-1 grid place-items-center"
          data-active="true"
          data-state={state}
          exit={{ rotate: 90, scale: 0 }}
          initial={false}
          key={state}
          transition={{ duration: 0.15 }}
        >
          {icons[state]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type RotatingChevronProps = Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon"> & {
  /** Closed direction: down for vertical content, inline-end for submenus. */
  direction?: "down" | "inline-end" | "inline-start" | "right" | "left";
  /** Use the nearest collapsible trigger's state in nested disclosures. */
  scope?: "collapsible";
};

function RotatingChevron({ direction = "down", scope, className, ...props }: RotatingChevronProps) {
  const icon = direction === "down" ? ChevronDownIcon : ChevronRightIcon;
  const rotation =
    direction === "down"
      ? scope === "collapsible"
        ? "group-data-open/collapsible-trigger:rotate-180 group-data-panel-open/collapsible-trigger:rotate-180"
        : "group-data-open:rotate-180 group-data-popup-open:rotate-180 group-data-panel-open:rotate-180"
      : direction === "inline-end" || direction === "right"
        ? "rtl:rotate-180 group-data-open:rotate-180 group-data-popup-open:rotate-180 group-data-panel-open:rotate-180 rtl:group-data-open:rotate-0 rtl:group-data-popup-open:rotate-0 rtl:group-data-panel-open:rotate-0"
        : "rotate-180 rtl:rotate-0 group-data-open:rotate-0 group-data-popup-open:rotate-0 group-data-panel-open:rotate-0 rtl:group-data-open:rotate-180 rtl:group-data-popup-open:rotate-180 rtl:group-data-panel-open:rotate-180";

  return (
    <HugeiconsIcon
      icon={icon}
      aria-hidden="true"
      className={cn(
        "shrink-0 transition-transform duration-200 ease-in-out motion-reduce:transition-none",
        rotation,
        className,
      )}
      data-slot="rotating-chevron"
      {...props}
    />
  );
}

type ExpandableChevronProps = {
  isOpen: boolean;
  className?: string;
};

/** Two chevrons exchange positions to indicate an open or closed state. */
function ExpandableChevron({ isOpen, className }: ExpandableChevronProps) {
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" as const };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative inline-block size-4 shrink-0 align-middle text-muted-foreground/60",
        className,
      )}
      data-slot="expandable-chevron"
      data-state={isOpen ? "open" : "closed"}
    >
      <motion.span
        animate={{ y: isOpen ? "12.5%" : "-25%" }}
        className="absolute inset-0"
        initial={false}
        transition={transition}
      >
        <HugeiconsIcon icon={ChevronUpIcon} className="size-full" strokeWidth={2} />
      </motion.span>
      <motion.span
        animate={{ y: isOpen ? "-12.5%" : "25%" }}
        className="absolute inset-0"
        initial={false}
        transition={transition}
      >
        <HugeiconsIcon icon={ChevronDownIcon} className="size-full" strokeWidth={2} />
      </motion.span>
    </span>
  );
}

type SidebarToggleIconProps = Omit<React.ComponentPropsWithoutRef<"svg">, "children"> & {
  isOpen: boolean;
  side?: "left" | "right";
  duration?: number;
};

/** Sidebar frame whose inner panel grows when the sidebar opens. */
function SidebarToggleIcon({
  isOpen,
  side = "left",
  duration = 0.3,
  className,
  ...props
}: SidebarToggleIconProps) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      {...props}
      aria-hidden="true"
      className={cn(
        "size-3.75 text-muted-foreground",
        side === "right" && "-scale-x-100",
        className,
      )}
      data-slot="sidebar-toggle-icon"
      data-state={isOpen ? "open" : "closed"}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="18"
        rx="4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        width="20"
        x="2"
        y="3"
      />
      <motion.rect
        animate={{ width: isOpen ? 6 : 2 }}
        fill="currentColor"
        height="12"
        initial={false}
        rx="1"
        transition={{ duration: reduceMotion ? 0 : duration }}
        x="5"
        y="6"
      />
    </svg>
  );
}

type ThemeToggleIconProps = {
  theme: "light" | "dark";
  className?: string;
};

/** Sun and moon icons rotate and scale as the active theme changes. */
function ThemeToggleIcon({ theme, className }: ThemeToggleIconProps) {
  const reduceMotion = useReducedMotion();
  const transition = { duration: reduceMotion ? 0 : 0.2 };
  const isDark = theme === "dark";

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-grid size-4 shrink-0 align-middle", className)}
      data-slot="theme-toggle-icon"
      data-theme={theme}
    >
      <motion.span
        animate={{ rotate: isDark ? -90 : 0, scale: isDark ? 0 : 1 }}
        className="absolute inset-0"
        initial={false}
        transition={transition}
      >
        <HugeiconsIcon icon={Sun03Icon} className="size-full" />
      </motion.span>
      <motion.span
        animate={{ rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0 }}
        className="absolute inset-0"
        initial={false}
        transition={transition}
      >
        <HugeiconsIcon icon={Moon02Icon} className="size-full" />
      </motion.span>
    </span>
  );
}

export { ExpandableChevron, RotatingChevron, SidebarToggleIcon, StatefulIcon, ThemeToggleIcon };
export type {
  ExpandableChevronProps,
  RotatingChevronProps,
  SidebarToggleIconProps,
  StatefulIconProps,
  ThemeToggleIconProps,
};
