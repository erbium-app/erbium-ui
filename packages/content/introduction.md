---
title: Introduction
description: An agent ready design system with taste built in
---

Erbium UI is the design system behind [erbium.app](https://erbium.app). It includes React components and the blocks built from them. All components are open source: copy the code into your own project and change it to suit your design.

## A few more opinions

We’re building on the shoulders of giants: [Base UI](https://base-ui.com/), [shadcn/ui](https://ui.shadcn.com/), and [coss ui](https://coss.com/ui). [Fluid Functionalism](https://www.fluidfunctionalism.com/) informs our approach to interface design.

Erbium adds a few more opinions to these foundations. We keep component APIs focused and more design decisions inside the components. We believe this is the right level of abstraction: enough flexibility to build with, without so many options that developers and coding agents have to guess. The defaults are considered, and the design stays consistent across components. The source is yours to edit when you want a different approach.

## A note on design

We want Erbium to have its own character. Surface and shadow tokens are built in to give interfaces depth and hierarchy, moving beyond the flat, familiar shadcn look common in AI-generated sites.

Tokens alone won’t give a project a design language. That takes taste, time, and attention to the details of what you’re building. These components are a starting point; making something distinct still asks something of you.

For us, UI means how an interface works as much as how it looks. What happens after a click, how a form explains an error, and whether a task feels clear are all part of the design.

## Code and examples

Components, styles, blocks, and Storybook examples can be installed into your project through the [shadcn CLI and registry](https://ui.shadcn.com/docs/registry). We keep the component registry and Storybook registry in sync with the source, so you can bring in the code and its working examples, then add your own twist.

We keep the documentation needed to use each component alongside its source and in its Storybook stories. Developers and agents can read the intent, inspect the examples, and reason about how the component behaves.

The system evolves with erbium.app. We’ll keep updating the primitives and the larger blocks composed from them as the product grows.

We also plan to add native Astro components with behavior comparable to their Base UI counterparts in React, carrying the same design decisions across both runtimes.

## A canvas for mockups

We plan to include a [Paper](https://paper.design/) canvas with all the components. Through Paper’s MCP connection, you’ll be able to use your preferred coding agent to assemble page mockups quickly from the same design system.
