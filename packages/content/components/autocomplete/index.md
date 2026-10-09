---
title: "Autocomplete"
description: "Text input with suggestions as you type."
---

## Usage

An input that suggests options as you type. Autocomplete allows free text; use Combobox when the value must come from the suggestions.

## Current interaction contract

The root forwards Base UI's current props and event details. Let the primitive own focus, matching, and keyboard navigation instead of duplicating them in application handlers.

Use `AutocompleteSearchInput` for an inline search panel: flush header, shared responsive search sizing, field typography, and a full-width separator. Use `AutocompleteInput` for a standalone form field. The SearchSurface story shows the panel composition.

For remote suggestions, set `filter={null}` when the service already filters results, cancel obsolete requests, and enable `autoHighlight` when keyboard users should be able to choose the first arriving suggestion.

`onItemHighlighted(item, details)` can drive a contextual preview. The originating event is available in `details.event`; pointer interactions can report MouseEvent or PointerEvent, while typing can report the reason `none`. Do not assume highlighting means selection.

Popup retention is explicit: `actionsRef` alone does not keep the popup mounted. Only call `details.preventUnmountOnClose()` in `onOpenChange` when the application owns delayed cleanup, then call `actionsRef.current?.unmount()` when that work completes. Let popups unmount normally by default; retaining every popup adds unnecessary lifetime and state.

## Scrolling surfaces

Use the component's built-in scrolling list or content area. It uses the product's thin scrollbar, scroll-aware edge fade, and keyboard-aware viewport. Search headers stay outside the scrolling list. Do not put a second native overflow container around the list or swap in a thicker scrollbar. The available popup space constrains the list while the header keeps its shared responsive geometry.
