import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { SegmentedControl as SegmentedControlPrimitive } from "@erbium-ui/react/segmented-control";
import { cn } from "../lib/utils";

/*
 * Tabs share these classes, so a tab list and a segmented control look the same. Each adds its
 * own active state and indicator position: Base UI's `Tabs.Indicator` sets `--active-tab-*`, and
 * `SegmentedControlPrimitive.Indicator` sets `--active-segment-*`.
 */

/** The well the segments sit in. */
const segmentedTrackClass =
  "relative isolate inline-flex min-h-control w-fit items-center justify-center rounded-lg surface-well p-0.75 text-muted-foreground";

/** One segment. It stays transparent and draws above the indicator. */
const segmentedItemClass =
  "relative z-10 inline-flex segmented-size cursor-pointer items-center justify-center gap-control-gap rounded-md border border-transparent bg-transparent px-control-inset py-0 text-control-sm whitespace-nowrap text-muted-foreground transition-colors select-none duration-150 hover:text-foreground focus-visible:border-ring has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 motion-reduce:transition-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon";

/**
 * The raised pill under the active segment. Its position comes from list-relative variables, so
 * it slides only inside the track, never with the track as the page around it moves.
 */
const segmentedIndicatorClass =
  "pointer-events-none absolute top-0 left-0 z-0 rounded-md border surface-control transition-[translate,width,height] duration-ui ease-ui-out motion-reduce:transition-none";

/** Base UI's prop types do not admit data-* keys in object literals. */
const dataAttributes = (attributes: Record<string, string | undefined>) => attributes;

type SegmentedControlProps = useRender.ComponentProps<"div">;

/**
 * Segments with a sliding indicator. The element passed to `render` decides the behavior: a
 * Base UI Radio Group for a value, a Toggle Group for a filter that can be cleared, or `<nav>`
 * for links. Use Tabs when each segment shows a panel.
 */
const SegmentedControl = ({ className, children, render, ...props }: SegmentedControlProps) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        children: (
          <>
            {children}
            <SegmentedControlPrimitive.Indicator
              data-slot="segmented-control-indicator"
              className={cn(
                segmentedIndicatorClass,
                "h-(--active-segment-height) w-(--active-segment-width) translate-x-(--active-segment-left) translate-y-(--active-segment-top)",
              )}
            />
          </>
        ),
        className: cn(
          segmentedTrackClass,
          // Until the indicator measures (server render, no JavaScript), the active segment
          // paints the pill itself.
          "[&:has(>[data-slot=segmented-control-indicator][hidden])>:is([data-checked],[data-pressed],[aria-current=page])]:surface-control [&:has(>[data-slot=segmented-control-indicator][hidden])>:is([data-checked],[data-pressed],[aria-current=page])]:border-border",
          className,
        ),
        ...dataAttributes({ "data-slot": "segmented-control" }),
      },
      props,
    ),
    render,
  });

type SegmentedControlItemProps = useRender.ComponentProps<"button">;

/**
 * One segment. Pass the behavior's item to `render`: `<RadioPrimitive.Root value="…" />`,
 * `<TogglePrimitive value="…" />` or `<a href="…" aria-current="page" />`.
 */
const SegmentedControlItem = ({ className, render, ...props }: SegmentedControlItemProps) =>
  useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          segmentedItemClass,
          "aria-[current=page]:text-foreground data-pressed:text-foreground data-checked:text-foreground",
          className,
        ),
        ...dataAttributes({ "data-slot": "segmented-control-item" }),
        // A rendered radio, toggle or link brings its own element and type.
        type: render === undefined ? "button" : undefined,
      },
      props,
    ),
    render,
  });

export {
  SegmentedControl,
  SegmentedControlItem,
  segmentedIndicatorClass,
  segmentedItemClass,
  segmentedTrackClass,
};

export type { SegmentedControlItemProps, SegmentedControlProps };
