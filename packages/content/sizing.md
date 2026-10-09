---
title: Sizing
description: Opinionated geometry and spacing for dense desktop tools and usable touch interfaces.
---

## Design decisions

Mira supplies the compact starting proportions. Fluid Functionalism supplies the useful principle that height, text, icons, and padding form one coordinated recipe. Erbium implements those relationships through CSS and existing component size props. There is no sizing context, hook, or global density switch.

Typography owns font roles and script-specific line height. Sizing owns minimum geometry and spacing. Surfaces own elevation and interaction states. A change to one must leave the other two usable.

## Control ladder

All values below assume a 16px root. Tokens use rem units and follow browser text sizing.

| Size    | Minimum height | Label      | Icon | Inline padding | Internal gap |
| ------- | -------------- | ---------- | ---- | -------------- | ------------ |
| xs      | 20px           | control-sm | 12px | 6px            | 4px          |
| sm      | 24px           | control-sm | 12px | 8px            | 4px          |
| default | 28px           | control-sm | 14px | 8px            | 4px          |
| lg      | 32px           | control    | 16px | 10px           | 6px          |

Use default for ordinary interface actions. Use sm for compact supplementary actions. Reserve xs for embedded controls inside another bounded component; it is not a general toolbar size. Use lg when an action needs more emphasis or sits beside larger content. Icon-only counterparts use the same ladder.

Minimum heights allow text-bearing controls to grow. Never force a translated label or an Arabic-script line into a fixed text box. Square icon buttons retain square geometry but expand on touch devices.

## Editable fields

Fields use the shared control minimum and the text-field role. Editable text stays 16px outside wide fine-pointer layouts, including touch tablets. Its larger line box can increase the actual field height beyond the nominal minimum. The minimum is a floor, not a promise of an exact measured height.

Input groups and number fields follow the same floor. Multiline fields grow with content. Embedded actions use the smaller size rather than competing with the outer field's padding.

## Desktop and touch

Density is not inferred from viewport width. A narrow desktop window remains a fine-pointer interface; a wide touch tablet still needs touch geometry. Below 48rem, general controls use a 36px minimum so they align with the larger editable text used at that width. This is a readability accommodation, not a compact-density toggle.

Regardless of width, with a coarse primary pointer, general buttons, triggers, fields, selectable menu rows, and segmented actions have a 44px minimum target. Typography retains its role; editable fields retain their 16px touch text. Specialized embedded actions need clearance within their containing control and are not automatically enlarged.

A narrow container should wrap or stack related controls before reducing text size. Use container queries for component composition and viewport queries for page structure. Preserve essential actions and reading order.

## Shared tokens

The system exposes nine shared decisions. Control heights are not Tailwind spacing-scale entries: they cannot accidentally become padding, margins, or gaps. Use component size props to select a coordinated recipe.

| Token                     | Default | Meaning                             |
| ------------------------- | ------- | ----------------------------------- |
| --control-height-embedded | 20px    | Embedded actions                    |
| --control-height-small    | 24px    | Small controls                      |
| --control-height          | 28px    | Default controls and menu rows      |
| --control-height-large    | 32px    | Large controls                      |
| --space-related           | 8px     | Related controls or label and field |
| --space-group             | 16px    | Distinct groups within a panel      |
| --space-section           | 24px    | Separate content sections           |
| --panel-padding           | 16px    | Default panel inset                 |
| --panel-padding-compact   | 12px    | Compact panel inset                 |

Equal values do not always mean equal decisions. Group separation and panel padding both default to 16px, but have different responsibilities. Conversely, menu rows and default controls share one height contract; they do not need two tokens.

## Fixed recipe details

Control padding, internal icon-to-label gaps, icon dimensions, menu insets, selection glyphs, badges, and tracks are fixed implementation values in sizing.css. They are not independent customization tokens. Their utility classes support component implementation; application authors should use the components and their size props.

The 36px narrow-screen floor and 44px coarse-pointer floor are automatic behavior, not selectable density modes. Typography retains its own role tokens. The private control-target-floor property coordinates inherited geometry inside a component and is not a public customization API.

Do not add a token for every repeated number. Add one when components share a meaningful decision that must change together. Keep decorative and media dimensions local.

## Spacing relationships

Internal and external gaps have different purposes. Do not use the icon-to-label gap as the default gap between unrelated actions. Keep ordinary Tailwind spacing available for application-specific layouts; semantic tokens describe recurring relationships rather than replacing the entire spacing scale.

## Menus and portals

Menu rows use a shared 28px minimum with their own inset and typography. They adapt to touch independently. These are explicit popup defaults: CSS inheritance does not cross React portals. Do not rely on a parent data attribute to size a portaled menu.

## Surfaces and nested geometry

A surface does not select density. Fields, raised controls, flat actions, and selected segments share the same control ladder while retaining their surface roles.

Cards coordinate their inset and section gap through one local card-spacing variable. Headers, content, and footers align to that inset. Segmented controls include their outer padding in the height budget; their inner segments are smaller than the outer control. Badges, checkbox glyphs, switch tracks, slider thumbs, avatars, and media have distinct geometry and should not be stretched to the general control height.

## Composition and overrides

Use existing size props first. Avoid overriding only height while leaving font, icon, and padding at another size. If a component lacks a size variant, its default is the system recipe; add a variant only for a demonstrated composition need.

Keep logical inline padding for RTL. Allow rows containing descriptive content to grow and wrap. Fixed dimensions remain appropriate for illustrations, tracks, icons, and media rather than prose containers.

## Verification

Check components together: buttons beside fields and selects, menus beside their triggers, and actions inside cards. Cover narrow containers, desktop, touch tablets, long labels, Arabic and Persian, browser text enlargement, and 200% zoom. Confirm that focus indicators remain visible and enlarged hit areas do not overlap.

## Component coverage

| Family                                                          | Geometry contract                                                                                |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Button, stateful button, toggle, pagination, navigation actions | Shared control ladder; composed variants inherit Button defaults                                 |
| Input, textarea, autocomplete, combobox, toolbar fields         | Shared control floor with text-field and content growth                                          |
| Input group, number field, inspector controls                   | Shared outer floor; embedded actions reset the inherited target floor                            |
| Tabs and menubar                                                | Outer control minimum includes a 3px inset on each side; inner segments use the remaining height |
| Select, command, dropdown and context menus                     | Explicit row-size contract, independent of trigger inheritance                                   |
| Sidebar and calendar                                            | Shared action minimum; calendar cell size coordinates navigation and days                        |
| Checkbox and radio                                              | 14px glyphs; surrounding labels and rows provide interaction space                               |
| Slider, meter, progress                                         | Shared 4px track; slider has its own 12px thumb and a larger interaction plane                   |
| Badge and keyboard shortcut                                     | 20px minimum supporting geometry, independent of the general action target                       |
| Card, item, alert, dialog, sheet, drawer, popover, hover card   | Shared panel and relationship spacing; multiline content has natural height                      |
| OTP and questionnaire                                           | Readable editable text and responsive target floors                                              |
| Message, bubble, toast, empty states, code blocks               | Shared content relationships; text and content determine height                                  |
| Avatar, attachment, icons, spinners, markers                    | Intrinsic media/glyph dimensions; no automatic control scaling                                   |
| Scroll area, carousel, resizable, chart                         | Container or data geometry; shared controls inside them inherit their own recipes                |
| Editable and text morph                                         | Text geometry follows the owning typography role                                                 |
| Aspect ratio, separator, skeleton, collapsible                  | Structural geometry rather than a control size                                                   |
| Direction, overlay and CSP providers                            | No owned visual sizing                                                                           |

Component-specific media dimensions, popup placement offsets, animation measurements, and page/sidebar widths remain local. They do not represent repeated control contracts and do not need new global tokens.

## Enforcement

The existing shadcn lint integration validates the CSS utilities. Erbium's use-geometry rule additionally rejects raw 20–36px height and square-size utilities in the shared control recipes, including variants and local class aliases. Keep those dimensions in sizing.css, and select the complete recipe rather than overriding one dimension. The rule deliberately does not ban ordinary layout spacing, illustration sizes, or content-specific widths.
