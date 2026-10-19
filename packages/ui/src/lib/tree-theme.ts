import { fieldShadow } from "./surface-shadows";

// Pierre renders into a shadow root; inherit Erbium's scheme and role tokens.
const treeThemeCSS = `
:host {
  color-scheme: inherit;
  --trees-file-icon-color: currentColor;
  --trees-border-radius-override: var(--radius-md);
  --trees-item-padding-x-override: 0.5rem;
  --trees-item-row-gap-override: 0.25rem;
  --trees-item-margin-x-override: 0px;
  --trees-padding-inline-override: 0.5rem;
  --trees-font-family-override: var(--font-sans);
  --trees-font-size-override: var(--text-control-sm, 0.75rem);
  --trees-fg-override: var(--sidebar-foreground);
  --trees-fg-muted-override: var(--muted-foreground);
  --trees-bg-override: transparent;
  --trees-bg-muted-override: var(--sidebar-accent);
  --trees-accent-override: var(--primary);
  --trees-border-color-override: var(--surface-edge);
  --trees-focus-ring-color-override: var(--ring);
  --trees-selected-fg-override: var(--sidebar-accent-foreground);
  --trees-selected-bg-override: var(--sidebar-accent);
  --trees-selected-focused-border-color-override: var(--ring);
  --trees-search-fg-override: var(--sidebar-foreground);
  --trees-search-bg-override: var(--surface-input);
  --trees-status-added-override: var(--success);
  --trees-status-deleted-override: var(--error);
  --trees-status-modified-override: var(--warning);
  --trees-status-renamed-override: var(--muted-foreground);
  --trees-status-untracked-override: var(--muted-foreground);
  --trees-status-ignored-override: var(--muted-foreground);
}
/* Match Input's surface-field recipe inside Pierre's shadow root. */
[data-file-tree-search-container] { padding-block: 0.25rem; margin-bottom: 0.5rem; }
[data-file-tree-search-input] {
  box-sizing: border-box;
  min-width: 0;
  height: var(--control-height);
  margin-block: 0;
  padding: 0.1875rem 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-lg);
  color: var(--foreground);
  background: var(--surface-input);
  font-size: var(--text-control);
  line-height: var(--text-control--line-height);
  box-shadow: ${fieldShadow};
  transition: color 150ms, background-color 150ms, box-shadow 150ms;
}
[data-file-tree-search-input]::placeholder { color: var(--muted-foreground); }
[data-file-tree-search-input]:focus-visible,
[data-file-tree-search-input][data-file-tree-search-input-fake-focus="true"] {
  outline: 2px solid var(--focus-halo-strong);
  outline-offset: 2px;
}
@media (width < 48rem), (pointer: coarse) {
  [data-file-tree-search-input] {
    height: 2.25rem;
    font-size: var(--text-body);
    line-height: var(--text-body--line-height);
  }
}
@media (pointer: coarse) { [data-file-tree-search-input] { height: 2.75rem; } }
@media (prefers-reduced-motion: reduce) { [data-file-tree-search-input] { transition: none; } }
@media (forced-colors: active) { [data-file-tree-search-input] { border-color: CanvasText; } }
[data-type="item"][data-item-selected="true"] { font-weight: 500; }
[data-type="item"]:hover { color: var(--sidebar-accent-foreground); }
[data-file-tree-virtualized-scroll] { overscroll-behavior: contain; scrollbar-width: thin; }
`;

export { treeThemeCSS };
