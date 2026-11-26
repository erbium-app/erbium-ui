---
title: "Stepper"
description: "A multi-step flow with steps, panels and navigation that validates before it moves on."
---

## Usage

Import from `@erbium/ui/components/stepper`. Pass the steps, in order, with a stable `id` each. The stepper owns the flow: which step is current, which are complete or skipped, and whether the user can move on.

```tsx
const steps = [{ id: "plan" }, { id: "workspace" }, { id: "invite" }];

<Stepper steps={steps}>
  <StepperList aria-label="Setup">
    {steps.map((step) => (
      <StepperItem key={step.id} value={step.id}>
        <StepperTrigger>
          <StepperIndicator />
          <StepperText>
            <StepperTitle>{titles[step.id]}</StepperTitle>
          </StepperText>
        </StepperTrigger>
        <StepperSeparator />
      </StepperItem>
    ))}
  </StepperList>
  {steps.map((step) => (
    <StepperPanel key={step.id} value={step.id}>
      …
    </StepperPanel>
  ))}
  <StepperActions>
    <StepperPrevious />
    <StepperNext />
  </StepperActions>
</Stepper>;
```

Built on the unstyled [Stepper primitive](/docs/react/stepper), which explains the flow, its guards and results in full.

## Steps

- **Required** by default. Next checks the step before moving on.
- **`optional`** steps show `StepperSkip` and `StepperOptional`. A skipped step reads differently from a completed one, with a dashed mark and a dash.
- **`disabled`** steps are out of the flow, for steps that only apply to some answers. They keep their status while disabled.
- **`review`** on the last step makes it a review: it opens only once every other step is ready, and Next on it finishes without a check of its own.

## Navigation

`navigation="linear"` (default) lets the user go back freely and forward only past resolved required steps. `navigation="free"` opens every step; moving forward still checks the current one, and `leaveInvalid="allow"` lets the user leave a step that failed it.

`guard` checks the current step before Next, a forward jump, or finishing. Return `true`, `false`, or `{ status: "invalid", issues }`; a promise shows a spinner on Next while it runs. `onFinish` runs after the last check.

## Forms

Put each step's fields in a TanStack `form.FormGroup` named after the step, and wrap them in `StepperForm`. Next and Enter submit the group, invalid fields shake and the first one takes focus, editing a completed answer reopens the later steps, and `createStepperFormFinish(form)` sends a failed final submit back to the step it belongs to. See the TanStack Form example.

## Parts

- `Stepper`: the root. It announces each new step to screen readers.
- `StepperList`, `StepperItem`, `StepperTrigger`: the steps as an ordered list of buttons. The current one has `aria-current="step"`, and a step the user cannot reach yet is `aria-disabled`.
- `StepperIndicator`: a number, a check, a dash, an alert or a spinner, by status. Pass children for your own.
- `StepperText`, `StepperTitle`, `StepperDescription`, `StepperOptional`: the text beside the mark. On narrow screens only the current step's text shows.
- `StepperSeparator`: the connector, filled once its step is complete, and still filled when the user returns to it.
- `StepperContent`: content under a step in a vertical stepper, whose border is the connector.
- `StepperDots`: the steps as the [step indicator's](/docs/components/step-indicator) dots, in place of the list, for a compact flow such as a tour. Name each dot with `label`. The Questionnaire's step indicator is one.
- `StepperPanel`: one step's content. Only the current one is mounted unless `keepMounted`.
- `StepperActions`, `StepperPrevious`, `StepperSkip`, `StepperNext`: the controls. Next reads `finishLabel` on the last step.
- `StepperForm`: a step's form, bound to its `FormGroup`.
