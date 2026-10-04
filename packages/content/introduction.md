---
title: Introduction
description: An agent ready design system with taste built in
---

Erbium UI is a set of components and the design system behind [erbium.app](https://erbium.app). All components and blocks are open source. Copy the code into your own project and change it to suit your design.

We build on [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/), and [coss ui](https://coss.com/ui). Our design and motion also draw from [Fluid Functionalism](https://www.fluidfunctionalism.com/), [Sonner](https://sonner.emilkowal.ski/), [Animate UI](https://animate-ui.com/), [Transition](https://transition.dev/), and [ReUI](https://reui.io/).

## A few more opinions

Erbium keeps APIs focused, with thoughtful defaults and consistent design. We narrow the design space to guide developers and agents toward considered choices, while leaving room to compose.

Between Base UI’s primitives and the broad collections of components, blocks, and templates in some registries, we keep a focused scope. We remove unnecessary options and thin wrappers. Storybook stories document composition and best practices.

## Closer to Base UI

We follow Base UI’s naming, APIs, and defaults, including where they differ from shadcn’s conventions.

Internationalization and RTL support are built in, with Base UI’s [Direction Provider](/docs/providers/direction) handling text direction.

Our tokens use `error` instead of `destructive` to name the state.

OTP, Field, Fieldset, and Toast use Base UI directly. Labels belong to fields rather than a separate Label component.

## A note on design

Surface and shadow tokens give interfaces depth and hierarchy.

Squircle corners give components and these docs a softer shape. We use native CSS where supported and fall back to ordinary rounded corners elsewhere. Circles and pills stay round.

Components provide a foundation. Content, hierarchy, and flow still need care. A finished interface can still be hard to use. Our examples give developers and agents a shared starting point to review and refine together.

> “It’s not just what it looks like and feels like. Design is how it works.”
>
> — Steve Jobs, [The Guts of a New Machine](https://www.nytimes.com/2003/11/30/magazine/the-guts-of-a-new-machine.html), 2003

Loading states, validation feedback, and overlay layouts are part of that work. We build them into the primitives and blocks so projects don’t have to start again. Validation errors and repeated toasts can shake for emphasis.

## Ready for agents

Useful abstractions save code and tokens. Documentation and examples explain the decisions behind them. Agents can read the source without having to reconstruct the intent.

Every documentation page has a `.md` version, with a [Markdown introduction](/index.md), [llms.txt index](/llms.txt), and [JSON API](/api/docs.json). Component guidance links to Base UI’s docs.

Install components, styles, blocks, and stories through the [shadcn CLI and registry](https://ui.shadcn.com/docs/registry) or copy paste them into your codebase manually.

Primitives and blocks evolve with erbium.app. See the [roadmap](/docs/roadmap) for planned components, agent tools, and platforms.
