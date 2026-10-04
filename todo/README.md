# Erbium UI work plan

Reviewed against the repository on 2026-10-04. The [public roadmap](../packages/content/roadmap.md) describes planned features; this directory tracks implementation details. Source files and generated manifests are the authority for what has shipped. Unchecked validation work does not mean an existing component is missing.

## Current baseline

- Base UI-backed Field, Fieldset, OTP Field, Meter, Toast, Direction Provider, and CSP Provider exist in `packages/ui/src/components`.
- OverlayProvider coordinates Base UI drawers; DrawerIndent exposes page indentation. Automatic responsive presentation across other overlays remains separate work.
- Shared surface roles, semantic `error` tokens, and native squircle corners with rounded-corner fallback are implemented.
- `packages/showcase` owns composition examples, installable stories, generated Storybook adapters, and the example registry. Documentation has Markdown mirrors, llms indexes, a JSON API, and a usage skill.
- Command still uses `cmdk`. Its Base UI migration is planned.
- Paper parity, reusable Astro and React Native libraries, Lightbox, Stepper, and agent integrations remain planned.

## Work areas

1. [Naming and boundaries](./00-naming-and-boundaries.md)
2. [Component additions](./01-missing-primitives.md)
3. [Base UI APIs](./02-base-ui-api.md)
4. [Blocks and stories](./03-blocks-and-particles.md)
5. [Validation](./04-validation.md)
6. [Paper design kit](./05-paper-design-system.md) and [research snapshot](./05-paper-design-research.md)
7. [Surfaces](./06-surfaces-and-depth.md)
8. [Searchable menus and Command](./07-searchable-menus.md)
9. [Responsive overlays](./08-responsive-overlays.md)
10. [Agent tooling and platforms](./09-agent-tooling-and-platforms.md)

Keep these notes aligned with the public roadmap when scope changes. Add components and stories for recurring needs, not inventory parity.
