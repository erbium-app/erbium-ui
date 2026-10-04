---
title: Introduction
description: An agent ready design system with taste built in
---

Erbium UI is the open-source component library and design system behind [erbium.app](https://erbium.app). Copy components and blocks into your project and adapt them to your design.

We build on [Base UI](https://base-ui.com/), [Shadcn/ui](https://ui.shadcn.com/), and [coss ui](https://coss.com/ui). Design and motion draw from [Fluid Functionalism](https://www.fluidfunctionalism.com/), [Sonner](https://sonner.emilkowal.ski/), [Animate UI](https://animate-ui.com/), [Transition](https://transition.dev/), and [ReUI](https://reui.io/).

We also wanted better building blocks for agentic interfaces: dedicated code blocks and diffs, tree views, matrix loaders, steppers, and toolbars. These needs guide both existing components and planned additions.

## A few more opinions

Focused APIs, thoughtful defaults, and a consistent visual language give developers and agents a considered starting point. We keep the scope small and leave room to compose.

We follow Base UI’s naming, APIs, and defaults. RTL support is baked in to make translating your UI and internationalization easier. Labels belong to fields, and our tokens use `error` instead of `destructive`.

## A note on design

Surface and shadow tokens provide depth and hierarchy. Squircle corners soften components, with ordinary rounded corners as a fallback; circles and pills stay round.

Content, hierarchy, and flow matter as much as the components. Feedback stays close to its cause; [toasts](/docs/components/toast) are reserved for supplementary information that is safe to miss.

## Ready for agents

Documentation and Storybook examples explain both composition and intent. Every page has a `.md` version, alongside a [Markdown introduction](/index.md), [llms.txt index](/llms.txt), and [JSON API](/api/docs.json).

Install through the [Shadcn CLI and registry](https://ui.shadcn.com/docs/registry) or copy the source directly. Erbium UI evolves with erbium.app; see the [roadmap](/docs/roadmap) for what’s planned.
