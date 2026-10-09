export const states = [
  ["rest", {}, ""],
  ["hover", {}, "[--surface-tint:var(--surface-hover-tint)]"],
  ["selected / open", { "aria-pressed": true }, ""],
  ["pressed", {}, "[--surface-tint:var(--surface-press-tint)]"],
  ["focus", {}, "ring-3 ring-focus-halo-strong"],
  ["invalid", { "aria-invalid": true }, ""],
  ["disabled", { "aria-disabled": true }, "opacity-50"],
] as const;

export function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container grid w-full min-w-0 place-items-center bg-surface-canvas text-caption text-foreground">
      {children}
    </div>
  );
}

export const ladder = [
  ["canvas", "bg-surface-canvas", "page"],
  ["panel", "border surface-panel", "card, frame"],
  ["control", "border surface-control", "button, trigger"],
  ["field", "border surface-field", "input, textarea"],
  ["overlay", "border surface-overlay", "popover, menu"],
  ["modal", "border surface-modal", "dialog, sheet, drawer"],
  ["top", "border surface-overlay [--surface-face:var(--surface-top)]", "menu in a dialog"],
] as const;

export const control =
  "inline-flex control-size control-adaptive items-center rounded-lg text-control-sm font-medium transition-[background-color,box-shadow] duration-150";

export const coloredSurfaces = [
  [
    "error",
    "surface-fill-error text-error-foreground",
    "surface-tint-error-soft text-error-soft-foreground",
  ],
  [
    "info",
    "surface-fill-info text-info-foreground",
    "surface-tint-info-soft text-info-soft-foreground",
  ],
  [
    "success",
    "surface-fill-success text-success-foreground",
    "surface-tint-success-soft text-success-soft-foreground",
  ],
  [
    "warning",
    "surface-fill-warning text-warning-foreground",
    "surface-tint-warning-soft text-warning-soft-foreground",
  ],
] as const;

export const tagColors = [
  ["gray", "surface-tag-gray text-tag-gray"],
  ["red", "surface-tag-red text-tag-red"],
  ["orange", "surface-tag-orange text-tag-orange"],
  ["yellow", "surface-tag-yellow text-tag-yellow-foreground"],
  ["green", "surface-tag-green text-tag-green"],
  ["cyan", "surface-tag-cyan text-tag-cyan"],
  ["blue", "surface-tag-blue text-tag-blue"],
  ["purple", "surface-tag-purple text-tag-purple"],
  ["magenta", "surface-tag-magenta text-tag-magenta"],
] as const;

export const sunk =
  "[--surface-catchlight:transparent] [--surface-backing:transparent] [--surface-drop:0_0_0_0_transparent,0_0_0_0_transparent,0_0_0_0_transparent] [--surface-recess:0_2px_3px_-1px_var(--surface-shadow-inset)]";

export const stateRoles = [
  ["surface-control", true],
  ["surface-fill-primary text-primary-foreground", true],
  ["surface-flat text-muted-foreground", false],
  ["surface-ghost-error-soft text-error-soft-foreground", false],
] as const;
