---
title: Roadmap
description: What we’re planning for Erbium UI.
---

We’re extending Erbium with a few new components, agent tools, and platform libraries. These plans have no fixed release dates and will evolve with the product.

## Components and blocks

Our planned additions are:

- **Command:** a CMDK replacement built on Base UI command and autocomplete behavior.
- **Lightbox:** an image viewer with navigation.
- **Stepper:** step navigation, validation, and a step indicator.
- **Agent sessions:** chat and session UI drawing from [OpenCode](https://opencode.ai/).
- **Files and diffs:** compositions using [Pierre](https://pierre.computer/)’s [Trees](https://trees.software/) and [Diffs](https://diffs.com/). We’re also considering its icons and other reusable pieces.

## Agent tooling

We plan to support [OpenUI](https://www.openui.com/) and [MCP-UI](https://mcpui.dev/), with agent skills for their integration and for composing Erbium interfaces.

A [Paper](https://paper.design/) canvas will bring components, states, and page compositions into one design kit. It will follow the source tokens and Storybook examples, allowing agents to assemble mockups through Paper’s MCP connection.

## Platforms

Astro and React Native libraries are planned with consistent design and the same public API wherever the platforms allow. Behavior will suit each platform.

## Continued work

We’ll continue improving composition stories, searchable menus, and responsive overlays, including keyboard access, RTL, reduced motion, and state coverage. Components and stories will grow around recurring needs, with each addition earning its place through use.
