---
title: "Stepper"
description: "Headless multi-step flow: steps, panels, navigation, guards and a pure state machine."
---

A multi-step flow. The flow is a pure state machine with no React and no form library, so it is tested on its own and runs on the server. The parts bind it to React and expose its state as `data-*` attributes and ARIA.

Use [styled Stepper](/docs/components/stepper) for Erbium's marks, connectors and controls.

**Import:** `@erbium-ui/react/stepper`, and `@erbium-ui/react/stepper/core` for the machine alone.

## Anatomy

```tsx
import { Stepper } from "@erbium-ui/react/stepper";

const steps = [{ id: "account" }, { id: "extras", optional: true }, { id: "review", review: true }];

<Stepper.Root steps={steps} onFinish={submit}>
  <Stepper.List aria-label="Checkout">
    {steps.map((step) => (
      <Stepper.Item key={step.id} value={step.id}>
        <Stepper.Trigger>
          <Stepper.Indicator />
          <Stepper.Title>{titles[step.id]}</Stepper.Title>
          <Stepper.Description>…</Stepper.Description>
        </Stepper.Trigger>
        <Stepper.Separator />
      </Stepper.Item>
    ))}
  </Stepper.List>
  {steps.map((step) => (
    <Stepper.Panel key={step.id} value={step.id}>
      …
    </Stepper.Panel>
  ))}
  <Stepper.Previous>Back</Stepper.Previous>
  <Stepper.Skip>Skip</Stepper.Skip>
  <Stepper.Next>Next</Stepper.Next>
  <Stepper.Announcer />
</Stepper.Root>;
```

## Concepts

### Steps

Steps are identified by a stable `id`, never an index, so a step keeps its status when others are added, hidden or reordered. The root reads them from `steps`; parts never register themselves.

- `optional`: the step can be skipped. Steps are required by default.
- `disabled`: the step is out of the flow. Its status is kept for when it returns.
- `review`: only on the last enabled step. It opens once every other step is ready, and has no guard: Next on it finishes.
- `invalidatesDownstream: false`: in linear navigation, reopening this optional step leaves the later steps resolved. A required step always reopens them.

### Status

A step's status is derived, never stored: `current`, else `complete` or `skipped`, else `pending`. `resolution` is what the user has done with the step whatever its status, so a completed step the user returns to is `current` with resolution `complete`; fill connectors and marks from `data-resolution`. A step is `reached` once the user has got to it: it is current or resolved, or the step before it is, so a step left by going back stays reached. Alongside these, a step can be `invalid` (its guard or the final submit reported issues), `optional`, `disabled`, `review` and `reachable`.

### Navigation

- `linear` (default): back is free. Forward checks the current step, and cannot pass a required step that is not resolved. Resolved steps always form a prefix.
- `free`: any enabled step is reachable. Forward still checks the current step. `leaveInvalid="allow"` lets the user leave a step that failed it.

Next on the last step finishes: it checks the step, then runs `onFinish`. Finishing needs every required step resolved and no step with issues. One move runs at a time; another action while it runs resolves as `pending`.

### Guards

A guard checks the current step before it is left forward or the flow finishes:

```ts
type StepperGuard = (context: { step; to; signal }) =>
  | boolean
  | { status: "valid" }
  | { status: "skip" } // optional steps only; a required step treats it as invalid
  | { status: "invalid"; issues?: unknown[] }
  | Promise<…>;
```

Pass one to the root as `guard`, or register one for a step with `useStepperGuard(id, guard)`. Throwing rejects the move with `error`. `signal` aborts when the move is cancelled, the flow is reset, the steps change or the root unmounts.

### Results

Every action resolves, never rejects, to `{ accepted: true, from, to }` (`to` is `null` once finished) or `{ accepted: false, reason }`. Reasons: `pending`, `finished`, `unknown`, `disabled`, `same`, `first`, `blocked`, `incomplete`, `invalid`, `required`, `error`, `cancelled`, `stale`.

`onValueChange(value, { reason, from })` runs whenever the current step changes, including when the flow moves it on its own: `next`, `previous`, `go-to`, `skip`, `finish-failed`, `invalidated`, `steps`, `disabled`, `missing`, `unreachable`, `incomplete`, `reset`, `restore`. Unlike other primitives its details have no `cancel()`: refuse a move by keeping a controlled `value`, or with `event.preventDefault()` in a control's `onClick`.

### Controlled value and persistence

`value` is controllable, for a router search param. A value the flow cannot reach is refused, and `onValueChange` answers once with the step the flow stays on and the reason `unreachable`. Completion is not a second controlled prop, since two sources of truth can disagree; save `useStepper().snapshot()` and resume it with `defaultSnapshot` or `restore()`.

## Forms

The core never imports a form library. For TanStack Form, name each step's `FormGroup` after the step and bind it:

```tsx
<Stepper.Panel value="account">
  <form.FormGroup name="account" validators={{ onDynamic: accountSchema }}>
    {(group) => {
      const { formProps } = useStepperFormGroup(group);

      return <form {...formProps}>…</form>;
    }}
  </form.FormGroup>
</Stepper.Panel>
```

Next and Enter submit the group, and the step passes when it is valid. An untouched optional step is skipped. Editing a completed answer reopens the step, fixing an invalid one clears its mark, and the first invalid field takes focus. Only the current step is ever validated, so unmounted fields never matter.

`createStepperFormFinish(form, { fieldErrors })` is an `onFinish` that submits the whole form: its full schema runs over every step, and steps whose fields fail become invalid, sending the user to the first one. `fieldErrors` maps a thrown server error to messages by field path, shown on the fields through `setErrorMap`.

The adapter reads the form structurally, so `@erbium-ui/react` does not depend on TanStack Form. Another form library works through `guard` and `onFinish`.

## Accessibility

WAI-ARIA has no stepper pattern. The steps are an ordered list of buttons, not tabs: tabs promise free arrow-key access and `aria-controls` relationships a linear flow does not keep.

- The current step's trigger has `aria-current="step"`. Its accessible name ends with what was done with the step, such as ", completed, optional", which a step the user returns to keeps. Override the words with `labels`.
- A step that cannot be reached, and a control that cannot act, is `aria-disabled`, not `disabled`, so it keeps focus and its place in the reading order. A control is `aria-busy` while a guard runs.
- After a move, the new panel takes focus when focus would otherwise be lost. `Stepper.Announcer` is a polite live region that names the new step, for when focus stays on the control.
- `Title` and `Description` are `<span>`s, which are valid inside the trigger's button.

## API

### Root

Renders a `<div>`. State: `value`, `orientation`, `navigation`, `pending`, `finished`.

| Prop                                     | Description                                             |
| ---------------------------------------- | ------------------------------------------------------- |
| `steps`                                  | The steps, in order. Compared by content, not identity. |
| `navigation`                             | `linear` (default) or `free`.                           |
| `leaveInvalid`                           | Free navigation: `block` (default) or `allow`.          |
| `value`, `defaultValue`, `onValueChange` | The current step.                                       |
| `defaultSnapshot`                        | A saved flow to resume.                                 |
| `guard`                                  | Checks the current step, for steps without their own.   |
| `onFinish`                               | Runs after the last check. Return `{ issues }` to fail. |
| `orientation`                            | `horizontal` (default) or `vertical`.                   |
| `labels`                                 | Words for status and announcements.                     |

### List, Item and its parts

`List` renders an `<ol>`. `Item` takes `value` and renders an `<li>`; `Trigger` (`<button>`), `Indicator` (`<span>`, its position by default, hidden from assistive technology), `Title`, `Description` (`<span>`s) and `Separator` (`<div>`) read its state: `status`, `resolution`, `invalid`, `optional`, `disabled`, `review`, `reachable`, `pending`.

### Panel

Takes `value` and `keepMounted`. Renders a `<div>`, `hidden` and `inert` while inactive. State: `active`, `status`, `invalid`.

### Previous, Next and Skip

`<button>`s with state `disabled`, `pending` and `blocked` (`data-blocked` is the reason). `Next` adds `finishes` and `review`. With `type="submit"`, `Next` submits its form instead of moving. `Skip` renders nothing on a required step.

### Hooks

- `useStepper()`: stable actions: `next`, `previous`, `goTo`, `skip`, `invalidate`, `clearIssues`, `reset`, `restore`, `snapshot`, `cancel`, `get`.
- `useStepperSelector(selector, isEqual)`: a slice of `{ flow, state }`, re-rendering only when it changes.
- `useStepperItem()`: the surrounding item's state.
- `useStepperGuard(id, guard)`: a step's own guard.
- `useStepperFormGroup(group, options)` and `createStepperFormFinish(form, options)`: the TanStack Form adapter.

### Core

`@erbium-ui/react/stepper/core` exports the machine: `createFlow`, `createInitialState`, `reduce`, the `get*Block` queries the parts use, `getStepStatus` and `getSnapshot`.
