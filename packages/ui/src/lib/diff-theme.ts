// Pierre's internals live in a shadow root. Inherit Erbium's explicit scheme
// rather than letting the operating system choose light-dark() colors.
import { controlInsetShadow, controlShadow } from "./surface-shadows";

const diffTheme = { light: "vitesse-light", dark: "vitesse-dark" };
const diffThemeCSS = `
:host {
  color-scheme: inherit;
  --diffs-font-family: var(--font-mono);
  --diffs-header-font-family: var(--font-sans);
  --diffs-font-size: var(--code-font-size, 0.875rem);
  --diffs-line-height: calc(var(--code-font-size, 0.875rem) * var(--code-line-height, 1.6));
  --diffs-tab-size: 2;
  --diffs-gap-block: 0;
  --diffs-gap-inline: 0;
  --diffs-gap-style: 0;
  --diffs-bg: var(--surface-panel);
  --diffs-fg: var(--foreground);
  --diffs-fg-number-override: var(--muted-foreground);
  --diffs-fg-number-addition-override: var(--success);
  --diffs-fg-number-deletion-override: var(--error);
  --diffs-addition-color-override: var(--success);
  --diffs-deletion-color-override: var(--error);
  --diffs-modified-color-override: var(--muted-foreground);
  --diffs-bg-context-override: var(--surface-panel);
  --diffs-bg-context-gutter-override: var(--surface-panel);
  --diffs-bg-buffer-override: var(--surface-panel);
  --diffs-bg-hover-override: var(--muted-hover);
  --diffs-bg-separator-override: var(--surface-control);
  /* Tints that read on a light panel disappear on a dark one, so dark mixes more. */
  --diffs-bg-addition-override: light-dark(
    color-mix(in oklab, var(--success) 8%, var(--surface-panel)),
    color-mix(in oklab, var(--success) 14%, var(--surface-panel))
  );
  --diffs-bg-addition-number-override: light-dark(
    color-mix(in oklab, var(--success) 12%, var(--surface-panel)),
    color-mix(in oklab, var(--success) 20%, var(--surface-panel))
  );
  --diffs-bg-addition-emphasis-override: light-dark(
    color-mix(in oklab, var(--success) 22%, var(--surface-panel)),
    color-mix(in oklab, var(--success) 34%, var(--surface-panel))
  );
  --diffs-bg-deletion-override: light-dark(
    color-mix(in oklab, var(--error) 8%, var(--surface-panel)),
    color-mix(in oklab, var(--error) 14%, var(--surface-panel))
  );
  --diffs-bg-deletion-number-override: light-dark(
    color-mix(in oklab, var(--error) 12%, var(--surface-panel)),
    color-mix(in oklab, var(--error) 20%, var(--surface-panel))
  );
  --diffs-bg-deletion-emphasis-override: light-dark(
    color-mix(in oklab, var(--error) 22%, var(--surface-panel)),
    color-mix(in oklab, var(--error) 34%, var(--surface-panel))
  );
  --diffs-selection-color-override: var(--primary);
  --diffs-bg-selection-override: color-mix(in oklab, var(--primary) 12%, var(--surface-panel));
  --diffs-bg-selection-number-override: color-mix(in oklab, var(--primary) 18%, var(--surface-panel));
}
pre { font-variant-ligatures: none; }
[data-expand-button] {
  box-sizing: border-box;
  align-self: center;
  min-width: 0;
  width: 24px;
  height: 24px;
  margin-inline: 4px;
  border: 1px solid transparent;
  color: var(--muted-foreground);
  background-color: var(--surface-control);
  border-radius: var(--radius-sm, 0.25rem);
  box-shadow: ${controlShadow};
}
[data-expand-button]:hover {
  background-color: color-mix(in oklab, var(--surface-tint-hover), var(--surface-control));
}
[data-expand-button]:active {
  background-color: color-mix(in oklab, var(--surface-tint-pressed), var(--surface-control));
  box-shadow: ${controlInsetShadow};
}
[data-expand-button]:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: -2px;
  border-radius: var(--radius-sm, 0.25rem);
}
`;

export { diffTheme, diffThemeCSS };
