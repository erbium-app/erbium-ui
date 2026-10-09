---
title: Sizing
description: Dense controls, meaningful spacing, and coordinated adaptation for desktop and touch.
---

## The system

Erbium starts with Mira's dense proportions and adopts Fluid Functionalism's useful principle: height, text, icons, padding, and internal gaps form one coordinated recipe. Choose a component size; its recipe supplies the geometry. There is no global density switch or sizing provider.

[Typography](/docs/foundations/typography) owns the text hierarchy. Sizing provides room for that text and its interaction. [Surfaces](/docs/foundations/surfaces) provide visual and interaction states. A different surface does not imply a different size.

## Control ladder

| Size      | Desktop minimum | Text role  | Icon | Inline padding | Internal gap | Purpose                                |
| --------- | --------------- | ---------- | ---- | -------------- | ------------ | -------------------------------------- |
| `xs`      | 20px            | control-sm | 12px | 6px            | 4px          | Embedded action inside another control |
| `sm`      | 24px            | control-sm | 12px | 8px            | 4px          | Supplementary compact action           |
| `default` | 28px            | control-sm | 14px | 8px            | 4px          | Ordinary interface action              |
| `lg`      | 32px            | control    | 16px | 10px           | 6px          | Larger or emphasized action            |

Measurements assume a 16px root and use rem units. These are minimums, not fixed boxes. Text-bearing controls can grow for longer line boxes, translated content, or text enlargement. Icon-only counterparts use the same ladder. Not every component needs every size variant: use its default unless its existing API exposes a meaningful alternative.

Use default for buttons, select triggers, toggles, and tabs that sit together. Keep adjacent controls on the same size step. Use an existing size prop rather than overriding height, icon size, or padding independently. Use xs only within a containing control, not as a general toolbar action.

Fields use the shared minimum with editable typography. Single-line fields grow when their text needs more room; textareas grow with content. Input groups and number fields coordinate their outer geometry with their embedded actions. Do not force an arbitrary height onto a field to align it with a button.

## Responsive behavior

| Environment                          | General control minimum | Editable text | Layout behavior                          |
| ------------------------------------ | ----------------------- | ------------- | ---------------------------------------- |
| At least 48rem, fine primary pointer | Selected desktop size   | 14px          | Dense composition when it fits           |
| Below 48rem, fine primary pointer    | 36px                    | 16px          | Wrap or stack before compressing content |
| Coarse primary pointer, any width    | 44px                    | 16px          | Preserve usable targets and separation   |

Touch behavior follows the primary pointer, not a phone-width assumption. A wide touch tablet still uses touch targets. Narrow fine-pointer layouts receive the 36px readability floor so fields and neighboring actions stay aligned. Embedded actions retain their supporting geometry and need clear placement within their containing control.

Adapt composition to available space. Use container queries for a component within a narrow column and viewport queries for page structure. Preserve important actions, reading order, and visible focus. Never shrink prose, hide required actions, or overlap hit areas merely to keep a toolbar on one line.

## Spacing and panels

| Relationship        | Default | Use                                   |
| ------------------- | ------- | ------------------------------------- |
| Related             | 8px     | Neighboring controls, label and field |
| Group               | 16px    | Separate groups within a panel        |
| Section             | 24px    | Separate content sections             |
| Panel inset         | 16px    | Default card interior                 |
| Compact panel inset | 12px    | Card with `size="sm"`                 |

Use `gap-related`, `gap-group`, and `gap-section` for those recurring relationships. Internal icon-to-label spacing belongs to the control recipe, not the surrounding layout. Give unrelated groups more space than their members.

Cards coordinate header, content, footer insets, and section gaps. A compact card reduces its spacing while retaining typography roles. Footer backgrounds reach the bottom edge, including when neighboring cards stretch to equal height. Do not compensate with negative margins or extra separator siblings.

Use logical inline spacing for RTL. Preserve alignment between labels, fields, content, and actions. Content can wrap or grow naturally; media and glyphs can retain intrinsic dimensions.

## Specialized geometry

- Search headers in command, combobox search, and the docs search dialog use a 40px desktop minimum with 8px vertical padding. Narrow and coarse-pointer layouts use at least 48px; rows grow further when their actions or editable text need more room. Search triggers remain ordinary controls.
- Menus use a 28px row minimum and a 44px touch minimum, with their own inset. Portaled popups apply these defaults explicitly; parent CSS inheritance cannot size them.
- Segmented controls include their outer inset in the height budget. Their inner segments occupy the remaining space rather than adding another full control height.
- Checkbox and radio glyphs are 14px; their labels and surrounding rows provide interaction space.
- Sliders, meters, and progress indicators share 4px tracks. The slider's 12px thumb sits within a larger interaction plane.
- Badges and keyboard keys use a 20px supporting minimum. They are not ordinary action targets.
- Calendar cells coordinate days and navigation. Sidebar actions follow the shared control ladder.
- Avatars, attachments, illustrations, charts, and media retain dimensions appropriate to their content. Structural primitives such as separators and aspect ratios do not select a control size.

## Shared decisions

The system has nine shared tokens:

| Token                       | Value | Meaning                        |
| --------------------------- | ----- | ------------------------------ |
| `--control-height-embedded` | 20px  | Embedded actions               |
| `--control-height-small`    | 24px  | Small controls                 |
| `--control-height`          | 28px  | Default controls and menu rows |
| `--control-height-large`    | 32px  | Large controls                 |
| `--space-related`           | 8px   | Related items                  |
| `--space-group`             | 16px  | Separate groups                |
| `--space-section`           | 24px  | Separate sections              |
| `--panel-padding`           | 16px  | Default panel inset            |
| `--panel-padding-compact`   | 12px  | Compact panel inset            |

Equal values do not imply the same meaning: group separation and panel inset have distinct responsibilities. Default controls and menu rows intentionally share one height decision. Icon dimensions, control padding, internal gaps, and responsive floors are fixed recipe details rather than additional customization knobs.

## Usage contract

- Compose existing components and choose their size props. Keep adjacent controls consistent.
- Use relationship spacing for repeated patterns. Keep content-specific widths and media geometry local.
- Let text-bearing components grow. Adapt layouts before reducing readable text or hiding essential content.
- Keep typography, size, and surface responsibilities separate. A compact card or flat action must preserve the same content hierarchy.
- Verify narrow containers, desktop, touch tablets, long labels, RTL, text enlargement, and keyboard focus. Check composed controls together, not only isolated specimens.

Repository checks reject independent control-height overrides in shared recipes and component usage. The opening Controls showcase covers the ladder, toolbar alignment, segmented controls, and Persian text. Composition demonstrates forms and footers in default and compact cards without changing the reading hierarchy.

### Overlay composition

Panel components own the surface. Header and Footer own their gutters; DialogContent, DrawerContent, and SheetContent own body padding and scrolling. Keep independently scrolling search results beside Content in the panel. Do not nest ScrollArea, Command, or another result list inside Content. PopoverContent and HoverCardContent already provide compact padding: do not override it or add a padded body wrapper.

The existing sizing lint rule `erbium-sizing/use-overlay-layout` enforces these compositions in shared components, applications, and stories. It checks imported components (including aliases), static class expressions, and inline padding or overflow styles. Portalled child overlays begin a separate surface and are allowed. Keep layout classes statically readable so the linter can inspect them; runtime-generated classes and opaque custom component internals still need review.

Control padding and icon gaps belong to the control recipe, alongside its height and typography. The geometry lint rule rejects padding and gap overrides on shared controls in consumers. Card sections follow the same padding ownership contract as overlays; message scroller viewports are scroll owners and cannot be nested inside another scroll body.
