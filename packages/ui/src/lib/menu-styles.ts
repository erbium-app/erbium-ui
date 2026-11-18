/*
 * Class names shared by the menu family. Dropdown menus style Base UI's Menu parts with them, and
 * components built on other Menu-based primitives (the cascader) apply the same names to their
 * own parts, so every menu row, label and popup looks the same.
 */

const menuPositionerClassName = "isolate z-50 max-w-(--available-width) outline-none";

const menuPopupClassName =
  "z-50 flex max-h-(--available-height) min-w-40 max-w-(--available-width) flex-col origin-(--transform-origin) overflow-y-auto overscroll-contain rounded-lg surface-overlay p-1 text-popover-foreground duration-100 outline-none has-[>[data-slot=scroll-area]]:overflow-hidden has-[>[data-slot=scroll-area]]:p-0 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95";

const menuLabelClassName = "px-2 py-1.5 text-control-sm text-muted-foreground data-inset:ps-7";

/** An action row. Supports `data-variant="error"`. */
const menuItemClassName =
  "group/dropdown-menu-item relative flex cursor-default items-center rounded-md row-size text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=error]:hover:**:text-accent-foreground not-data-[variant=error]:focus:**:text-accent-foreground data-inset:ps-7 data-[variant=error]:text-error data-[variant=error]:hover:bg-error-interactive data-[variant=error]:hover:text-error data-[variant=error]:focus:bg-error-interactive data-[variant=error]:focus:text-error data-[variant=error]:data-highlighted:bg-error-interactive data-[variant=error]:data-highlighted:text-error data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon data-[variant=error]:*:[svg]:text-error";

/** A checkbox or radio row, with room at the end for its indicator. */
const menuChoiceItemClassName =
  "relative flex cursor-default items-center rounded-md row-size pe-8 text-control-sm whitespace-nowrap outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground hover:**:text-accent-foreground focus:**:text-accent-foreground data-inset:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-control-icon";

/** The end slot that holds a checkbox or radio row's indicator. */
const menuChoiceIndicatorClassName =
  "pointer-events-none absolute inset-e-2 flex items-center justify-center";

const menuListClassName = "p-1 outline-none in-data-has-overflow-y:pe-3";

const menuEmptyClassName =
  "px-control-inset py-panel text-center text-control text-muted-foreground";

export {
  menuChoiceIndicatorClassName,
  menuChoiceItemClassName,
  menuEmptyClassName,
  menuItemClassName,
  menuLabelClassName,
  menuListClassName,
  menuPopupClassName,
  menuPositionerClassName,
};
