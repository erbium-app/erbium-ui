---
title: Introduction
description: An agent ready design system with taste built in
---

Erbium UI is the open-source component library and design system behind [erbium.app](https://erbium.app). Copy styled components and blocks into your project and adapt them to your design. Use [`@erbium-ui/react`](/docs/react) to build your own interfaces with Erbium’s unstyled Cascader, Filters, Editable, and Pagination primitives.

We build on [Base UI](https://base-ui.com/), [Shadcn/ui](https://ui.shadcn.com/), and [coss ui](https://coss.com/ui), and [Shelf UI](https://shelfui.dev/). Design and motion draw from [Fluid Functionalism](https://www.fluidfunctionalism.com/), [Sonner](https://sonner.emilkowal.ski/), [Animate UI](https://animate-ui.com/), [Transition](https://transition.dev/), and [ReUI](https://reui.io/).

Several components wrap focused open-source packages. Code blocks are highlighted with [Shiki](https://shiki.style/), and diff views, file views, and file trees run on [Pierre](https://pierre.computer/). The lightbox adapts [Chánh Đại’s Lightbox](https://chanhdai.com/components/lightbox) on top of [Ramka](https://ramka.dev/docs). Calendars and date pickers use [React DayPicker](https://daypicker.dev), carousels use [Embla Carousel](https://www.embla-carousel.com/), and resizable layouts use [react-resizable-panels](https://react-resizable-panels.vercel.app). Text morphing comes from [Torph](https://torph.lochie.me), intent prediction from [ForesightJS](https://foresightjs.com), and animation from [Motion](https://motion.dev/). Tables, forms, and charts are built on [TanStack](https://tanstack.com/) Table, Form, and Charts.

We also wanted better building blocks for agentic interfaces: dedicated code blocks and diffs, tree views, matrix loaders, steppers, and toolbars. These needs guide both existing components and planned additions.

## Own the source

Install with shadcn or the Erbium CLI. Both copy components into your project so you can adapt the markup, behavior, and styles alongside the rest of your app.

Erbium records the revision and original bytes of each managed file. Commit `.erbium/lock.json` and `.erbium/bases/` with your source. Use `erbium status` to see what changed, `erbium diff` to review upstream changes, and `erbium update` to merge them into your copy. Run `erbium check` to verify tracked files and package declarations offline.

[Install Erbium](/docs/installation) or read the [CLI guide](/docs/cli) for command options and update workflows.

## A few more opinions

Focused APIs, thoughtful defaults, and a consistent visual language give developers and agents a considered starting point. We keep the scope small and leave room to compose.

We follow Base UI’s naming, APIs, and defaults. RTL support is baked in to make translating your UI and internationalization easier. Labels belong to fields, and our tokens use `error` instead of `destructive`.

Loading, error, and empty states belong to the UI layer, not to each screen. Content the page already has renders immediately and upgrades in place: code shows as plain text until highlighting finishes, and trees and panels keep their final size while they mount. Content still being fetched gets a [`Skeleton`](/docs/components/skeleton) measured from sample data with [Skullet](https://skullet.lochie.me), so the real content lands where the skeleton was. Primitives describe how they draw while loading, and error and empty states reuse the Alert and Empty components with the same reveal.

Animation is opinionated. Components ship with chosen durations, easing, and enter and exit transitions, so you do not tune each one, and they respect reduced-motion settings.

The source is linted with Ultracite’s core, React, anti-slop, and shadcn presets, plus Erbium’s own typography and sizing rules. The anti-slop rules reject the patterns generated code tends to leave behind, so the components you copy need no cleanup first.

## A note on design

Surface and shadow tokens provide depth and hierarchy. Squircle corners soften components, with ordinary rounded corners as a fallback; circles and pills stay round.

Content, hierarchy, and flow matter as much as the components. Feedback stays close to its cause; [toasts](/docs/components/toast) are reserved for supplementary information that is safe to miss.

## Ready for agents

Documentation and Storybook examples explain both composition and intent. Every page has a `.md` version, alongside a [Markdown introduction](/index.md), [llms.txt index](/llms.txt), and [JSON API](/api/docs.json).

Erbium UI evolves with erbium.app; see the [roadmap](/docs/roadmap) for what’s planned.
