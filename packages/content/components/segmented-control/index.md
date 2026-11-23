---
title: "Segmented Control"
description: "Choose between a few related options shown side by side."
---

Segments sit in a recessed track, and a raised indicator slides to the active one. The control only draws the segments. The element passed to `render` supplies the behavior, so pick it by what the choice does. The indicator comes from the [unstyled Segmented Control](/docs/react/segmented-control) in `@erbium-ui/react`.

**Import:** `@erbium/ui/components/segmented-control`

## Usage

```tsx
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { SegmentedControl, SegmentedControlItem } from "@erbium/ui/components/segmented-control";
```

```tsx
<SegmentedControl aria-label="Billing period" render={<RadioGroup defaultValue="monthly" />}>
  <SegmentedControlItem render={<Radio.Root value="monthly" />}>Monthly</SegmentedControlItem>
  <SegmentedControlItem render={<Radio.Root value="yearly" />}>Yearly</SegmentedControlItem>
</SegmentedControl>
```

Put behavior props such as `value`, `defaultValue`, `onValueChange`, `name` and `href` on the rendered element. Keep labelling props such as `aria-label` on `SegmentedControl`. Render Base UI's unstyled parts, not the styled `RadioGroupItem` or `ToggleGroupItem`, so no second indicator appears.

## Choose the behavior

| What the choice does                    | Render                                                 |
| --------------------------------------- | ------------------------------------------------------ |
| Picks one value, such as in a form      | Base UI `RadioGroup` with `Radio.Root` items           |
| Applies a filter or mode that can clear | Base UI `ToggleGroup` with `Toggle` items              |
| Moves to another route                  | `<nav>` with links, `aria-current="page"` on one       |
| Shows one of several panels             | [Tabs](/docs/components/tabs), not a segmented control |

Tabs share this component's track, segments and indicator, so both look the same.

## In a form

Inside `form.AppField`, use `field.SegmentedField` for a string value. It renders the label, the segments as a Base UI Radio Group, the description and the error. Pass the segments as `options`, each with a `value`, a `label` and an optional `disabled`.

```tsx
<form.AppField
  name="plan"
  validators={{ onDynamic: ({ value }) => (value ? undefined : "Choose a plan.") }}
>
  {(field) => (
    <field.SegmentedField
      label="Plan"
      options={[
        { label: "Starter", value: "starter" },
        { label: "Team", value: "team" },
      ]}
      required
    />
  )}
</form.AppField>
```

The field's label names the group, so it needs no `aria-label`. In a vertical field the track fills the width like an input, and the segments share it equally. While the field is invalid, the track shows the same outline as an invalid input, and a rejected submit shakes it.

For segments with icons or other custom content, compose the same parts by hand. Keep `SegmentedControl` a direct child of `field.Field` so the shake reaches it, and render the label as a `<div>` because a group has no single control for a native label:

```tsx
<field.Field required>
  <FieldLabel nativeLabel={false} render={<div />}>
    Plan
  </FieldLabel>
  <SegmentedControl
    render={
      <RadioGroup
        value={field.state.value}
        onValueChange={field.handleChange}
        onBlur={field.handleBlur}
        required
      />
    }
  >
    <SegmentedControlItem render={<Radio.Root value="starter" />}>Starter</SegmentedControlItem>
    <SegmentedControlItem render={<Radio.Root value="team" />}>Team</SegmentedControlItem>
  </SegmentedControl>
  <field.FieldError />
</field.Field>
```

See [Form](/docs/components/form) for validation and submission.

## Composition

```text
SegmentedControl
├── SegmentedControlItem
├── SegmentedControlItem
└── (indicator, rendered by SegmentedControl)
```

## Customizing

`SegmentedControl` has one size. Adjust it with `className`: a control that fills a containing row, such as `Control.Segmented`, passes `min-h-0 self-stretch p-0.5` to the track, `min-h-0 rounded-sm px-2` to each segment, and `*:data-[slot=segmented-control-indicator]:rounded-sm` for the indicator.

Segments grow to share a track wider than their labels, such as one given `w-full`. A track that may shrink and truncate its labels passes `min-w-0 flex-initial` to each segment, so each keeps its own label's width instead of an equal share.

Before the indicator measures, as in a server render, the active segment draws the raised pill itself.
