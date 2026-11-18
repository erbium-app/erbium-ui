import { Icon } from "./icon";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../lib/utils";

interface StatefulIconProps<State extends string> {
  /** The key of the icon or content to show. */
  state: State;
  /** Content to render for each state, such as Hugeicons or a Spinner. */
  icons: Readonly<Record<State, ReactNode>>;
  /** Accessible name for the current state. Omit when the icon is decorative. */
  labels?: Partial<Record<State, string>>;
  className?: string;
  /** Placement hint for button spacing. */
  "data-icon"?: "inline-start" | "inline-end";
}

const StatefulIcon = <State extends string>({
  state,
  icons,
  labels,
  className,
  "data-icon": placement,
}: StatefulIconProps<State>) => {
  const reduceMotion = useReducedMotion() === true;
  const label = labels?.[state];
  const hasLabel = label !== undefined && label !== "";

  return (
    <span
      aria-hidden={hasLabel ? undefined : true}
      aria-label={label}
      className={cn("inline-grid shrink-0 align-middle *:col-start-1 *:row-start-1", className)}
      data-icon={placement}
      data-slot="stateful-icon"
      data-state={state}
      role={hasLabel ? "img" : undefined}
    >
      {Object.entries<ReactNode>(icons).map(([key, icon]) => {
        const active = key === state;

        return (
          <motion.span
            animate={{ rotate: active || reduceMotion ? 0 : 90, scale: active ? 1 : 0 }}
            aria-hidden="true"
            className="relative col-start-1 row-start-1 grid place-items-center"
            data-active={active}
            data-state={key}
            initial={false}
            key={key}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
          >
            {icon}
          </motion.span>
        );
      })}
    </span>
  );
};

type RotatingChevronProps = Omit<React.ComponentProps<typeof Icon>, "name"> & {
  /** Closed direction: down for vertical content, inline-end for submenus. */
  direction?: "down" | "inline-end" | "inline-start" | "right" | "left";
  /** Use the nearest collapsible trigger's state in nested disclosures. */
  scope?: "collapsible";
};

const RotatingChevron = ({
  direction = "down",
  scope,
  className,
  ...props
}: RotatingChevronProps) => {
  const name = direction === "down" ? "chevron-down" : "chevron-right";

  let rotation: string;

  if (direction === "down") {
    rotation =
      scope === "collapsible"
        ? "group-data-open/collapsible-trigger:rotate-180 group-data-panel-open/collapsible-trigger:rotate-180"
        : "group-data-open:rotate-180 group-data-popup-open:rotate-180 group-data-panel-open:rotate-180";
  } else if (direction === "inline-end" || direction === "right") {
    rotation =
      "rtl:rotate-180 group-data-open:rotate-180 group-data-popup-open:rotate-180 group-data-panel-open:rotate-180 rtl:group-data-open:rotate-0 rtl:group-data-popup-open:rotate-0 rtl:group-data-panel-open:rotate-0";
  } else {
    rotation =
      "rotate-180 rtl:rotate-0 group-data-open:rotate-0 group-data-popup-open:rotate-0 group-data-panel-open:rotate-0 rtl:group-data-open:rotate-180 rtl:group-data-popup-open:rotate-180 rtl:group-data-panel-open:rotate-180";
  }

  return (
    <Icon
      name={name}
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
};

interface ExpandableChevronProps {
  isOpen: boolean;
  className?: string;
}

/** Two chevrons exchange positions to indicate an open or closed state. */
const ExpandableChevron = ({ isOpen, className }: ExpandableChevronProps) => {
  const reduceMotion = useReducedMotion() === true;
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.2, ease: "easeOut" as const };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative inline-block size-4 shrink-0 align-middle text-muted-foreground",
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
        <Icon name="chevron-up" className="size-full [--icon-stroke-width:2]" />
      </motion.span>
      <motion.span
        animate={{ y: isOpen ? "-12.5%" : "25%" }}
        className="absolute inset-0"
        initial={false}
        transition={transition}
      >
        <Icon name="chevron-down" className="size-full [--icon-stroke-width:2]" />
      </motion.span>
    </span>
  );
};

type SidebarToggleIconProps = Omit<React.ComponentPropsWithoutRef<"svg">, "children"> & {
  isOpen: boolean;
  side?: "left" | "right";
  duration?: number;
};

/** Sidebar frame whose inner panel grows when the sidebar opens. */
const SidebarToggleIcon = ({
  isOpen,
  side = "left",
  duration = 0.3,
  className,
  ...props
}: SidebarToggleIconProps) => {
  const reduceMotion = useReducedMotion() === true;

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
};

interface ThemeToggleIconProps {
  theme: "light" | "dark";
  className?: string;
}

/**
 * Sun and moon icons rotate and scale as the active theme changes. Like `StatefulIcon`, the
 * glyphs take their size from the control around them (a button sizes them to its icon size).
 */
const ThemeToggleIcon = ({ theme, className }: ThemeToggleIconProps) => {
  const reduceMotion = useReducedMotion() === true;
  const transition = { duration: reduceMotion ? 0 : 0.2 };
  const isDark = theme === "dark";

  return (
    <span
      aria-hidden="true"
      className={cn("inline-grid shrink-0 align-middle *:col-start-1 *:row-start-1", className)}
      data-slot="theme-toggle-icon"
      data-theme={theme}
    >
      <motion.span
        animate={{ rotate: isDark ? -90 : 0, scale: isDark ? 0 : 1 }}
        className="grid place-items-center"
        initial={false}
        transition={transition}
      >
        <Icon name="sun-03" />
      </motion.span>
      <motion.span
        animate={{ rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0 }}
        className="grid place-items-center"
        initial={false}
        transition={transition}
      >
        <Icon name="moon-02" />
      </motion.span>
    </span>
  );
};

/** Shared draw-on check and mixed mark. Place inside a keepMounted indicator with group/check-indicator. */
const CheckboxStateIcon = ({ className }: { className?: string }) => (
  <span
    aria-hidden="true"
    data-slot="checkbox-state-icon"
    className={cn("inline-grid size-3.5 shrink-0", className)}
  >
    {/* Dash properties inherit into the sprite, so the draw-on runs on the svg itself. */}
    <Icon
      name="check"
      aria-hidden="true"
      className="col-start-1 row-start-1 size-full opacity-0 transition-[opacity,stroke-dashoffset] duration-120 [stroke-dasharray:32] [stroke-dashoffset:32] group-data-checked/check-indicator:opacity-100 group-data-checked/check-indicator:delay-75 group-data-checked/check-indicator:[stroke-dashoffset:0] motion-reduce:transition-none"
    />
    <Icon
      name="minus"
      aria-hidden="true"
      className="col-start-1 row-start-1 size-full opacity-0 transition-[opacity,stroke-dashoffset] duration-120 [stroke-dasharray:24] [stroke-dashoffset:24] group-data-indeterminate/check-indicator:opacity-100 group-data-indeterminate/check-indicator:[stroke-dashoffset:0] motion-reduce:transition-none"
    />
  </span>
);

export {
  CheckboxStateIcon,
  ExpandableChevron,
  RotatingChevron,
  SidebarToggleIcon,
  StatefulIcon,
  ThemeToggleIcon,
};

export type {
  ExpandableChevronProps,
  RotatingChevronProps,
  SidebarToggleIconProps,
  StatefulIconProps,
  ThemeToggleIconProps,
};
