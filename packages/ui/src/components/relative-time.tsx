import * as React from "react";
import {
  RelativeTime as RelativeTimePrimitive,
  useRelativeTimeLocale,
  useTimeZoneMatch,
} from "@erbium-ui/react/relative-time";
import type {
  RelativeTimeAbsoluteProps as RelativeTimeAbsolutePrimitiveProps,
  RelativeTimeRootProps,
  RelativeTimeSettings,
} from "@erbium-ui/react/relative-time";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "./popover";

const zoneDateFormat: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "medium" };

const titleDateFormat: Intl.DateTimeFormatOptions = { dateStyle: "full" };

const triggerClassName =
  "cursor-default rounded-xs text-start underline decoration-muted-foreground/60 decoration-dotted underline-offset-4 hover:decoration-current focus-visible:outline-2 focus-visible:outline-ring";

const defaultZones = ["UTC"];

const noZones: readonly string[] = [];

const RelativeTimeProvider = RelativeTimePrimitive.Provider;

type RelativeTimeProps = Omit<RelativeTimeRootProps, "className"> & { className?: string };

/** A live "3 hours ago". Not interactive, so it can sit inside a link, button or row. */
const RelativeTime = ({ className, ...props }: RelativeTimeProps) => (
  <RelativeTimePrimitive.Root
    data-slot="relative-time"
    className={cn("tabular-nums", className)}
    {...props}
  />
);

type RelativeTimeAbsoluteProps = Omit<RelativeTimeAbsolutePrimitiveProps, "className"> & {
  className?: string;
};

const RelativeTimeAbsolute = ({ className, ...props }: RelativeTimeAbsoluteProps) => (
  <RelativeTimePrimitive.Absolute
    data-slot="relative-time-absolute"
    className={cn("tabular-nums", className)}
    {...props}
  />
);

type RelativeTimeCardProps = RelativeTimeSettings &
  Pick<React.ComponentProps<typeof Popover>, "defaultOpen" | "onOpenChange" | "open"> & {
    /** A trigger and content of your own. Without them, the card renders both. */
    children?: React.ReactNode;
  };

/** A relative time that opens a card with the exact moment. */
const RelativeTimeCard = ({
  children,
  defaultOpen,
  onOpenChange,
  open,
  ...settings
}: RelativeTimeCardProps) => (
  <RelativeTimeProvider {...settings}>
    <Popover defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      {children ?? (
        <>
          <RelativeTimeCardTrigger />
          <RelativeTimeCardContent />
        </>
      )}
    </Popover>
  </RelativeTimeProvider>
);

/** The relative time as a button that opens the card on hover, press or a tap. */
const RelativeTimeCardTrigger = ({
  children,
  className,
  closeDelay = 150,
  delay = 400,
  openOnHover = true,
  render,
  ...props
}: Omit<React.ComponentProps<typeof PopoverTrigger>, "className"> & { className?: string }) => (
  <PopoverTrigger
    data-slot="relative-time-card-trigger"
    openOnHover={openOnHover}
    delay={delay}
    closeDelay={closeDelay}
    render={render}
    // A replaced element, such as a `Button`, brings its own look.
    className={cn(render === undefined && triggerClassName, className)}
    {...props}
  >
    {children ?? <RelativeTime />}
  </PopoverTrigger>
);

const RelativeTimeCardContent = ({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof PopoverContent>, "className"> & { className?: string }) => {
  // The popup renders in a portal, so it inherits neither from the trigger.
  const { direction, locale } = useRelativeTimeLocale();

  return (
    <PopoverContent
      data-slot="relative-time-card-content"
      dir={direction}
      lang={locale}
      className={cn("w-auto min-w-56", className)}
      {...props}
    >
      {children ?? (
        <>
          <RelativeTimeCardTitle />
          <RelativeTimeZoneList />
        </>
      )}
    </PopoverContent>
  );
};

/** The card's date in full, which also names the popup for screen readers. */
const RelativeTimeCardTitle = ({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof PopoverTitle>, "className"> & { className?: string }) => (
  <PopoverTitle
    data-slot="relative-time-card-title"
    className={cn("text-control", className)}
    {...props}
  >
    {children ?? <RelativeTimeAbsolute dateFormat={titleDateFormat} />}
  </PopoverTitle>
);

type RelativeTimeZoneProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** An IANA zone. @default the viewer's zone */
  timeZone?: string;
  /** In place of the zone's name, such as a city. */
  label?: React.ReactNode;
  dateFormat?: Intl.DateTimeFormatOptions;
  /** Leaves the row out when this zone is as far from UTC as one of these. */
  hideIfSameAs?: readonly string[];
};

const RelativeTimeZone = ({
  timeZone,
  label,
  dateFormat = zoneDateFormat,
  hideIfSameAs = noZones,
  className,
  ...props
}: RelativeTimeZoneProps) => {
  if (useTimeZoneMatch(hideIfSameAs, { timeZone })) {
    return null;
  }

  return (
    <div data-slot="relative-time-zone" className={cn("contents", className)} {...props}>
      <dt className="text-muted-foreground">
        {label === undefined ? (
          <RelativeTimePrimitive.TimeZoneName timeZone={timeZone} />
        ) : (
          <bdi>{label}</bdi>
        )}
      </dt>
      <dd className="text-end">
        <RelativeTimeAbsolute timeZone={timeZone} dateFormat={dateFormat} />
      </dd>
    </div>
  );
};

type RelativeTimeZoneListProps = React.ComponentProps<"dl"> & {
  /**
   * Zones listed after the viewer's, which is left out when it repeats one of them. Ignored with
   * children. @default ["UTC"]
   */
  timeZones?: readonly string[];
};

const RelativeTimeZoneList = ({
  children,
  className,
  timeZones = defaultZones,
  ...props
}: RelativeTimeZoneListProps) => (
  <dl
    data-slot="relative-time-zone-list"
    className={cn("grid grid-cols-[auto_auto] items-baseline gap-x-4 gap-y-1", className)}
    {...props}
  >
    {children ?? (
      <>
        <RelativeTimeZone hideIfSameAs={timeZones} />
        {timeZones.map((timeZone) => (
          <RelativeTimeZone key={timeZone} timeZone={timeZone} />
        ))}
      </>
    )}
  </dl>
);

export {
  RelativeTime,
  RelativeTimeAbsolute,
  RelativeTimeCard,
  RelativeTimeCardContent,
  RelativeTimeCardTitle,
  RelativeTimeCardTrigger,
  RelativeTimeProvider,
  RelativeTimeZone,
  RelativeTimeZoneList,
};

export type {
  RelativeTimeAbsoluteProps,
  RelativeTimeCardProps,
  RelativeTimeProps,
  RelativeTimeZoneListProps,
  RelativeTimeZoneProps,
};

export { useRelativeTime } from "@erbium-ui/react/relative-time";

export type { RelativeTimeProviderProps } from "@erbium-ui/react/relative-time";
