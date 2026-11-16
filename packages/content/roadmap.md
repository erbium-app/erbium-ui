---
title: Roadmap
description: Where we’re taking Erbium UI.
---

Erbium is growing from a set of primitives into a focused system for building data interfaces, editing content, and working with agents. The direction comes from recurring product needs. Each component, block, and story still has to earn its place; these plans have no fixed release dates.

## Working with data

We’re building toward a full-featured data table on [TanStack Table](https://tanstack.com/table/latest), with sorting, pagination, selection, grouping, column controls, and [TanStack Virtual](https://tanstack.com/virtual/latest) for large datasets. Filters will share a field, operator, and value model across tables, lists, and search.

Editable data sheets extend that direction with cell editing, range selection, clipboard operations, and undo/redo. Table behavior and editing will remain composable, with applications owning fetching and persistence.

## Composing product interfaces

We want common product decisions to have useful starting points: property and settings panels, searchable tags with optional creation, and icon and emoji selection. These will be small compositions with stories that explain their use.

Multi-step forms bring together Questionnaire, StepIndicator, and [TanStack Form](https://tanstack.com/form/latest) validation. Responsive overlays and searchable menus will carry the same interaction decisions across desktop and mobile. Command will move from CMDK toward Base UI command and autocomplete behavior.

## Code and terminal commands

CodeBlock displays source code with syntax highlighting, overflow handling, optional language or file labels, and shared copy feedback. A TerminalCommand block (working name) will compose shell and CLI snippets with optional package-manager or platform selection. It will copy the selected command without decorative prompts and reuse CodeBlock where useful. This planned block is separate from the Command palette.

## Files and media

File handling will connect picking, drag and drop, validation, and attachment previews. Lightbox handles image viewing and navigation, and can share its state with Carousel. Audio playback, waveforms, and transcripts are another area we’re exploring.

FileTree, FileView, and DiffView build on [Pierre](https://pierre.computer/)’s [Trees](https://trees.software/) and [Diffs](https://diffs.com/). Next come changed-file review, review comments, and multi-file review composed from those blocks.

## Interfaces for agents

Agent sessions will draw from [OpenCode](https://opencode.ai/), with chat compositions and a prompt composer for attachments and submission states. [OpenUI](https://www.openui.com/) and [MCP-UI](https://mcpui.dev/) support will connect these interfaces to agent workflows, with skills documenting integration and composition.

A [Paper](https://paper.design/) canvas will connect components, states, and page compositions to the same source tokens and Storybook examples. Agents will be able to assemble mockups through Paper’s MCP connection.

## Consistent across platforms

The React Native library will share Erbium’s design and public APIs wherever the platform allows, with behavior suited to its runtime. Keyboard access, RTL, reduced motion, and meaningful state coverage will remain part of the system as it grows.
