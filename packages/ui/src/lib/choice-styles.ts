/*
 * The look of Erbium's choice controls, shared by `RadioGroupItem`, `Checkbox`, the card `Field`
 * and controls that draw the same choice around another input, such as the questionnaire's
 * choices. State comes from `data-checked`, `data-indeterminate` and `aria-invalid` on the element.
 */

export const radioClassName =
  "group/radio-group-item peer relative flex aspect-square size-choice shrink-0 rounded-full border border-input transition-[border-color,box-shadow,scale] duration-150 ease-out outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-card:not-aria-invalid:ring-0 group-has-focus-visible/field-card:not-data-checked:not-aria-invalid:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:active:scale-90 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo aria-invalid:focus-visible:border-error aria-invalid:data-checked:border-error motion-reduce:transition-none dark:bg-input/30 dark:aria-invalid:border-invalid dark:aria-invalid:focus-visible:border-invalid dark:aria-invalid:data-checked:border-invalid data-checked:border-selection group-has-focus-visible/field-card:data-checked:not-aria-invalid:border-selection";

/** The radio's dot, centred in `radioClassName`. */
export const radioDotClassName = "size-2 rounded-full bg-selection";

export const checkboxClassName =
  "peer relative flex size-choice shrink-0 items-center justify-center rounded-lg border border-input transition-[color,background-color,border-color,box-shadow,scale] duration-150 ease-out outline-none group-has-disabled/field:opacity-50 group-has-focus-visible/field-card:not-aria-invalid:ring-0 group-has-focus-visible/field-card:not-data-checked:not-aria-invalid:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring not-data-disabled:not-data-readonly:hover:scale-105 not-data-disabled:not-data-readonly:active:scale-95 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-error aria-invalid:ring-[1.5px] aria-invalid:ring-invalid-halo aria-invalid:focus-visible:border-error aria-invalid:data-checked:border-error aria-invalid:data-indeterminate:border-error motion-reduce:transition-none dark:bg-input/30 dark:aria-invalid:border-invalid dark:aria-invalid:focus-visible:border-invalid dark:aria-invalid:data-checked:border-invalid dark:aria-invalid:data-indeterminate:border-invalid data-checked:border-selection data-checked:bg-selection data-checked:text-selection-foreground data-indeterminate:border-selection data-indeterminate:bg-selection data-indeterminate:text-selection-foreground group-has-focus-visible/field-card:data-checked:not-aria-invalid:border-selection dark:data-checked:bg-selection dark:data-indeterminate:bg-selection";

/**
 * A selectable surface-frame: flat, hairline-framed and translucent, so it reads on the canvas, a
 * panel, a popover or a dialog. Hover and a checked control inside tint it; focus and validity
 * colour the rim.
 */
export const choiceCardClassName =
  "group/field-card relative rounded-lg border surface-frame p-panel-sm transition-[background-color,box-shadow] duration-150 motion-reduce:transition-none not-data-disabled:not-has-data-checked:hover:[--surface-tint:var(--surface-tint-hover)] has-data-checked:[--surface-rim:color-mix(in_srgb,var(--selection)_30%,transparent)] has-data-checked:[--surface-tint:var(--surface-tint-selected)] has-focus-visible:[--surface-rim:var(--ring)] data-invalid:[--surface-rim:var(--error)]";
