---
title: Introduction
description: An agent ready design system with taste built in
---

Erbium UI is the open-source component library and design system behind [erbium.app](https://erbium.app). Copy components and blocks into your project and adapt them to your design.

We build on [Base UI](https://base-ui.com/), [Shadcn/ui](https://ui.shadcn.com/), and [coss ui](https://coss.com/ui). Design and motion draw from [Fluid Functionalism](https://www.fluidfunctionalism.com/), [Sonner](https://sonner.emilkowal.ski/), [Animate UI](https://animate-ui.com/), [Transition](https://transition.dev/), and [ReUI](https://reui.io/).

We also wanted better building blocks for agentic interfaces: dedicated code blocks and diffs, tree views, matrix loaders, steppers, and toolbars. These needs guide both existing components and planned additions.

## Own the source

Install with shadcn or the Erbium CLI. Both copy components into your project so you can adapt the markup, behavior, and styles alongside the rest of your app.

Erbium records the revision and original bytes of each managed file. Commit `.erbium/` with your source. Use `erbium status` to see what changed, `erbium diff` to review upstream changes, and `erbium update` to merge them into your copy. Run `erbium check` to verify tracked files and package declarations offline.

[Install Erbium and manage updates](/docs/installation).

## A few more opinions

Focused APIs, thoughtful defaults, and a consistent visual language give developers and agents a considered starting point. We keep the scope small and leave room to compose.

We follow Base UI’s naming, APIs, and defaults. RTL support is baked in to make translating your UI and internationalization easier. Labels belong to fields, and our tokens use `error` instead of `destructive`.

## Loading is part of the UI layer

Loading states are where interfaces most often feel broken: spinners that hold the page hostage, skeletons that guess the layout wrong, and content that jumps when it finally arrives. Erbium makes loading a decision of the UI layer rather than of each screen.

- **Content you already have renders immediately.** Code shows as plain text while highlighting runs and is recoloured in place. Trees and panels keep their final size while they mount. A loading state never stands in for content the page already has.
- **Content you are fetching gets a measured skeleton.** Wrap what you render once the data arrives in [`Skeleton`](/docs/components/skeleton) and pass sample data. The skeleton is drawn from that content, with one bar per line of text and one block per control, so the real content lands in the same place.
- **Refetches keep their shape.** A skeleton drawn over data already on screen matches it exactly, and shapes are remembered across visits. Fast loads show no skeleton at all.
- **Components describe themselves.** Buttons, badges, switches, avatars, and the other primitives tell the skeleton how to draw them, so any composition of them loads consistently. Error and empty states use the same Alert and Empty components as the rest of the system.

Measured skeletons are built on [Skullet](https://skullet.lochie.me).

## A note on design

Surface and shadow tokens provide depth and hierarchy. Squircle corners soften components, with ordinary rounded corners as a fallback; circles and pills stay round.

Content, hierarchy, and flow matter as much as the components. Feedback stays close to its cause; [toasts](/docs/components/toast) are reserved for supplementary information that is safe to miss.

## Ready for agents

Documentation and Storybook examples explain both composition and intent. Every page has a `.md` version, alongside a [Markdown introduction](/index.md), [llms.txt index](/llms.txt), and [JSON API](/api/docs.json).

Erbium UI evolves with erbium.app; see the [roadmap](/docs/roadmap) for what’s planned.
