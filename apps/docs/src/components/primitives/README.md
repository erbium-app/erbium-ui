# Astro shell components

These components belong to the documentation app. They render native HTML with Astro slots, familiar Erbium component names, and matching `data-slot` attributes.

`Button` uses `@erbium/ui/lib/button-variants`; sidebar elements use `@erbium/ui/lib/sidebar-styles`. These definitions also drive the React components, so variant styling stays synchronized without mounting React for the static shell.

Use `class` for styling and `<slot />` for children. `Button` accepts the same `variant` and `size` values as React; `href` renders a link. `SidebarMenuButton` accepts `isActive`, `variant`, `size`, and link attributes. The static `Sidebar` supports `collapsible="none"`. Mobile navigation is composed separately with a native modal dialog in `shell/MobileNavigation.astro`.

These adapters do not implement React's `render` prop, context, or event-handler API. Interactive component showcases continue to run the actual shared React examples. Native shell behavior stays in the docs app.

`Input` and `Textarea` use `@erbium/ui/lib/form-control-styles`, shared with their React equivalents. They accept native attributes, `value` and `defaultValue`. Native events update the DOM; React controlled state and Base UI field context belong to the React examples.

`Select` composes with `SelectItem`, accepts `size="sm" | "default"`, and uses the browser's native select keyboard and popup behavior. Set `selected` on the initial item. `Switch` uses a native checkbox with `role="switch"`, `checked`/`defaultChecked`, `disabled`, and matching size values. It submits native checkbox values and emits native input/change events. It preserves RTL thumb direction and reduced-motion preferences.

`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption` use the same slots and composition as the React table. Pass native attributes such as `scope` and accessible names.

## Styling

The docs use Tailwind v4 through `@tailwindcss/vite` in `astro.config.mjs`. `src/styles/globals.css` imports `@erbium/ui/globals.css`, so fonts, semantic colors, surfaces, carved rules, and variants come from the shared library. Explicit `@source` entries include the docs and workspace showcase files. Keep complete utility names in source so Tailwind can detect them.

Use Tailwind utilities in Astro `class` attributes, `class:list` for arrays, and `cn` when merging adapter classes. Repeated prose and code-block utilities live in `src/styles/content.ts`; the Markdown rehype plugin uses the same code-block recipe as the Astro component. Keep CSS limited to global browser behavior and runtime theme or syntax values.
