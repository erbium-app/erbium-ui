# 10 — Opinionated sidebars

Reviewed 2026-11-17. The source comparison below is from 2026-10-05. This document records the proposed direction and implementation work; the API names below are illustrative, not shipped contracts.

## Goal

Provide consistent, polished sidebars through a constrained abstraction over shadcn compositions and Base UI behavior. Erbium owns layout, spacing, typography, states, and responsive behavior. Applications supply navigation, routing, and product content. The visual contract should live entirely in `packages/ui`.

## Source comparison

Reference: `/Volumes/AlirezaDev/Codes/Fullstack/elavie/packages/ui/web/src/components/sidebar.tsx`. The supplied `elavie ui` directory does not exist; the comparison used the `elavie` repository. Findings are from source inspection, not a rendered visual comparison.

| Area            | Elavie                                                   | Current Erbium                                             |
| --------------- | -------------------------------------------------------- | ---------------------------------------------------------- |
| Navigation rows | 28px height, 13px text, muted resting color, 2px gaps    | `h-control` rows, `text-control` text, no row gaps         |
| Header/footer   | Distinct spacing for each region                         | Both reuse the same `p-2` styles                           |
| Content padding | Horizontal padding belongs to the scroll viewport        | Padding belongs to each group                              |
| Inset frame     | Tight 0.3rem margin, layered shadows, spring animation   | 0.5rem margin, simple shadow                               |
| Resize          | Drag rail, bounded width, persisted width                | Click rail toggles visibility                              |
| Direction       | Resolves placement and tooltip direction through context | Some RTL styling; menu tooltip placement stays right       |
| API             | shadcn variants plus resize and trailing-content options | shadcn variants, sizes, render overrides, free composition |

Use Elavie's visual discipline as inspiration. Its API still exposes many knobs and should not be copied wholesale.

Current source:

- `packages/ui/src/components/sidebar.tsx`
- `packages/ui/src/lib/sidebar-styles.ts`
- `apps/docs/src/components/shell.tsx`

The docs app already imports shared menu styles, but its own CSS overrides group spacing, label weight, row padding, font size, radius, and active weight. Shared variants alone do not currently guarantee visual parity.

## Proposed boundaries

- [ ] Define an application sidebar with a fixed desktop collapse behavior and mobile drawer.
- [ ] Define a documentation sidebar with expanded desktop navigation and a mobile drawer.
- [ ] Establish fixed width, region spacing, row geometry, colors, and focus treatment for each supported pattern.
- [ ] Add an icon-rail pattern only after a concrete use case establishes its requirements.
- [ ] Keep resizing out of the initial implementation. Reconsider bounded resizing when a real application needs it.
- [ ] Define ownership of controlled state and persistence. Keep product-specific routing and persistence policy in applications.

## Constrained public API

- [ ] Provide semantic navigation links, actions, sections, and expandable sections instead of requiring arbitrary row composition.
- [ ] Let each row own label placement, icon geometry, truncation, active state, focus treatment, and collapsed tooltip behavior.
- [ ] Preserve `render` as a router integration point, along with necessary refs, accessibility attributes, and event props.
- [ ] Set `aria-current="page"` for active navigation links and consistently dismiss mobile navigation after activation.
- [ ] Expose header, navigation, and footer regions for application content while owning their spacing and scrolling internally.
- [ ] Separate passive metadata such as counts from interactive row actions. Avoid a generic trailing slot that encourages nested buttons or links.
- [ ] Remove public row-size, outline-treatment, tooltip-position, internal-padding, and collapse-mechanics choices from the opinionated layer.
- [ ] Decide whether existing low-level parts remain internal or available through an explicitly separate API; avoid presenting them as equivalent recommended patterns.

Illustrative composition:

```tsx
<SidebarLayout>
  <AppSidebar>
    <SidebarHeader>
      <WorkspaceSwitcher />
    </SidebarHeader>
    <SidebarNavigation label="Main navigation">
      <SidebarSection label="Workspace">
        <SidebarLink
          label="Inbox"
          icon={<InboxIcon />}
          active={isInbox}
          render={<Link to="/inbox" />}
        />
        <SidebarAction label="Create project" icon={<PlusIcon />} onClick={createProject} />
      </SidebarSection>
    </SidebarNavigation>
    <SidebarFooter>
      <AccountMenu />
    </SidebarFooter>
  </AppSidebar>
  <SidebarMain>{children}</SidebarMain>
</SidebarLayout>
```

## React and docs-site parity

- [ ] Move the complete visual contract into `packages/ui`: region spacing, row geometry, typography, nested navigation, scroll fades, and state styles.
- [ ] Have the docs app consume that contract while keeping markup and behavior appropriate for the web.
- [ ] Remove docs overrides for component-owned styling; retain page-layout responsibilities in docs CSS.
- [ ] Document necessary platform differences without introducing independent visual defaults.
- [ ] Preserve docs navigation scroll restoration and active-link updates during navigation.

## Implementation sequence and acceptance

1. [ ] Build one representative application sidebar and one docs sidebar using the proposed semantic API. Confirm the constraints cover actual usage before finalizing names and exports.
2. [ ] Establish shared styling and compare both rendered implementations with Elavie's reference. Choose final density and inset styling based on these examples.
3. [ ] Manually verify desktop expanded/collapsed states, mobile opening/dismissal, long labels, nested sections, active links, disabled actions, and scrolling.
4. [ ] Verify keyboard access, focus restoration, accessible labels, RTL placement/tooltips, reduced motion, and SSR/hydration behavior.
5. [ ] Migrate existing showcase examples and docs pages, document intentional restrictions, and remove redundant options after the replacement covers existing needs.
6. [ ] Rebuild affected UI/showcase registries and generated adapters. Follow [validation and release gates](./04-validation.md), including `bun run check` and `bun run ready` for release readiness.

Keep reusable components and styles in `packages/ui`, composition examples in `packages/showcase`, and application-specific content and routing in apps.
