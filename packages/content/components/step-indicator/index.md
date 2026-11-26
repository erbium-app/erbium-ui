---
title: "Step Indicator"
description: "A compact row of dots that shows where the user is in a sequence."
---

## Usage

Import from `@erbium/ui/blocks/step-indicator`. Pass `count` and the zero-based `value` of the current step. Passing `onValueChange` makes every step selectable; without it the indicator is read-only.

```tsx
const [step, setStep] = useState(0);

<StepIndicator count={4} value={step} onValueChange={setStep} />;
```

The indicator only displays a position: carousel slides, tabs, a tour or an upload's progress. It never renders step content, owns navigation rules, or validates. A flow that checks each step before moving on, and keeps which steps are done, is a [Stepper](/docs/components/stepper): `StepperDots` draws it with these dots, and the Questionnaire's step indicator is one.

## Composition

Use `StepIndicatorItem` children when steps need their own state or names. Each item takes its zero-based `index`.

```tsx
<StepIndicator value={step} onValueChange={setStep}>
  {steps.map((item, index) => (
    <StepIndicatorItem key={item.id} index={index} label={item.label} invalid={item.invalid} />
  ))}
</StepIndicator>
```

`count` is shorthand for rendering default items and is ignored when children are provided.

## API

`StepIndicator`

- `value`, `defaultValue`, `onValueChange(index)`: zero-based current step. Follows the Base UI controlled and uncontrolled convention. `onValueChange` also turns the items into buttons.
- `count`: shorthand for that many default items.
- `progress`: fills the current step from 0 to 1. Defaults to 1. Pass a motion value to move the fill every frame without re-rendering, when something else owns the clock. Takes precedence over `autoplay`.
- `autoplay`: fills the current step over time, then selects the next. `true` or `{ duration, paused, loop }`: `duration` is the time on each step in milliseconds (default 3000), `paused` holds the fill, and `loop` (default true) returns to the first step after the last. It counts `count` steps, so pass `count` alongside item children. Reduced motion turns it off.
- `variant`: `steps` (default) reads earlier steps as complete; `dots` marks only the current one, for peers such as carousel slides.
- `orientation`: `horizontal` (default) or `vertical`.
- `render`: replaces the `ol`. Receives `{ value, count, orientation, interactive }`.

`StepIndicatorItem`

- `index`: position of the step.
- `status`: `complete`, `current` or `upcoming`. Derived from `value` by default (earlier steps are complete); set it when completion is not linear.
- `invalid`: marks the step as having errors.
- `disabled`: blocks this step.
- `label`: accessible name. Defaults to "Step N"; ", completed" and ", has errors" are appended. Translate it by passing your own.
- `render`: replaces the control (a `button` when interactive, otherwise a `span`), for example to render a router link. Receives `{ index, status, invalid, disabled }`.

## Hover and blocking

Interactive steps get a simple hover area around the dot. A `disabled` step shows a not-allowed cursor and no hover, and you can refuse a change inside `onValueChange`. Blocking steps the user has not reached yet, or has not passed a check for, is the stepper's job: use `StepperDots`.

## Styling and accessibility

Items expose `data-status`, `data-invalid` and `data-disabled`; the root and items expose `data-orientation`. The root carries `data-progress="live"` while a motion value or `autoplay` drives the fill. The root is an ordered list labeled "Progress" and the current step has `aria-current="step"`. Give the root an `aria-label` that names the sequence. Transitions respect reduced motion and the layout mirrors under RTL.
