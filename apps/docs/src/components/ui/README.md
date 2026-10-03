# Astro shell components

These components belong to the documentation app. They render native HTML with Astro slots, familiar Erbium component names, and matching `data-slot` attributes.

`Button` uses `@erbium/ui/lib/button-variants`; sidebar elements use `@erbium/ui/lib/sidebar-styles`. These definitions also drive the React components, so variant styling stays synchronized without mounting React for the static shell.

Use `class` for styling and `<slot />` for children. `Button` accepts the same `variant` and `size` values as React; `href` renders a link. `SidebarMenuButton` accepts `isActive`, `variant`, `size`, and link attributes. The static `Sidebar` supports `collapsible="none"`. Mobile navigation is composed separately with a native modal dialog in `shell/MobileNavigation.astro`.

These adapters do not implement React's `render` prop, context, or event-handler API. Interactive component showcases continue to run the actual shared React examples. Native shell behavior stays in the docs app.
