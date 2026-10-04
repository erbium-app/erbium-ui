---
title: Introduction
description: An agent ready design system with taste built in
---

Erbium UI is the design system behind [erbium.app](https://erbium.app). It includes React components and the blocks built from them. All components are open source: copy the code into your own project and change it to suit your design.

## A few more opinions

We’re building on the shoulders of giants: [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/), and [coss ui](https://coss.com/ui). Our design and motion also draw from [Fluid Functionalism](https://www.fluidfunctionalism.com/), [Sonner](https://sonner.emilkowal.ski/), [Animate UI](https://animate-ui.com/), [Transition](https://transition.dev/), and [ReUI](https://reui.io/).

Erbium keeps APIs focused, with thoughtful defaults and consistent design. We narrow the design space to guide developers and agents toward considered choices, while leaving room to compose.

Between Base UI’s primitives and the broad collections of components, blocks, and templates in some registries, we keep a focused scope. Every component, block, and story must earn its place through use. Storybook documents composition and best practices; we remove unnecessary API options and thin wrappers.

## Closer to Base UI

We follow Base UI’s naming, APIs, and defaults, including where they differ from shadcn’s conventions.

Internationalization and RTL support are built in, with Base UI’s [Direction Provider](/docs/providers/direction) handling text direction.

Our tokens use `error` instead of `destructive` to name the state.

OTP, Field, Fieldset, and Toast use Base UI directly. Labels belong to fields rather than a separate Label component. Validation errors and repeated toasts can shake for emphasis.

We use [TanStack Charts](https://tanstack.com/charts/latest), [Form](https://tanstack.com/form/latest), [Hotkeys](https://tanstack.com/hotkeys/latest), [Pacer](https://tanstack.com/pacer/latest), and [Table](https://tanstack.com/table/latest) for charts, forms, shortcuts, timing, and tables.

## A note on design

Surface and shadow tokens give interfaces depth and hierarchy beyond the familiar shadcn look of many AI-generated sites.

Squircle corners give components and these docs a softer shape. We use native CSS where supported and fall back to ordinary rounded corners elsewhere. Circles and pills stay round.

A distinct design language still takes taste, time, and attention to the product.

> “It’s not just what it looks like and feels like. Design is how it works.”
>
> — Steve Jobs, [The Guts of a New Machine](https://www.nytimes.com/2003/11/30/magazine/the-guts-of-a-new-machine.html), 2003

We treat behavior as part of design. Loading states, validation feedback, and overlay layouts are built into the primitives and blocks, giving projects a foundation they would otherwise rebuild.

## Ready for agents

Useful abstractions let agents do more with less code and fewer tokens. They can read the source when needed, but shouldn’t have to reconstruct every decision from raw code. Focused APIs, documentation, and examples give them a shorter path to a working interface.

Every documentation page has a `.md` version, with a [Markdown introduction](/index.md), [llms.txt index](/llms.txt), and [JSON API](/api/docs.json). Component guidance links to Base UI’s docs.

Install components, styles, blocks, and stories through the [shadcn CLI and registry](https://ui.shadcn.com/docs/registry). Both registries stay in sync with the source.

Usage guidance lives alongside the source and in Storybook stories. Cards and dialogs need layout and content decisions beyond the primitive. Installable stories give agents examples to adapt while leaving composition open.

Primitives and blocks evolve with erbium.app. See the [roadmap](/docs/roadmap) for planned components, agent tools, and platforms.
