---
title: "Questionnaire"
description: "Collect answers through a series of questions."
---

## Usage

Compose a multi-step flow with single-choice, multiple-choice, freeform, and skippable questions.

**Import:** `@erbium/ui/components/questionnaire`

## Usage

Define the collection once: pass it to `Questionnaire` for server-rendered

progress, actions, and shortcuts, then map it into the parts.

```tsx
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireSkip,
  QuestionnaireStepIndicator,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";
```

```tsx
const items = [
  {
    name: "direction",
    required: true,
    prompt: "What should we prototype next?",
    description: "Choose a direction or write your own.",
    choices: [
      {
        value: "delegation",
        label: "Delegation",
        description: "Show how work moves to a specialist.",
      },
      {
        value: "questions",
        label: "Question prompts",
        description: "Show choices while the interface waits.",
      },
      { value: "both", label: "Both together" },
    ],
    input: { label: "Another answer", placeholder: "Type another answer…" },
  },
  {
    name: "detail",
    required: false,
    prompt: "How much detail should it include?",
    description: "Skip this if you are not sure yet.",
    choices: [
      { value: "focused", label: "Focused" },
      { value: "complete", label: "Complete flow" },
    ],
  },
] as const;
```

```tsx
<Questionnaire items={items} onSubmit={handleSubmit}>
  <QuestionnaireStepIndicator />
  {items.map((question) => (
    <QuestionnaireItem key={question.name} name={question.name}>
      <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
      <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
      <QuestionnaireChoices>
        {question.choices.map((choice) => (
          <QuestionnaireChoice key={choice.value} value={choice.value}>
            {choice.label}
            {"description" in choice ? (
              <QuestionnaireChoiceDescription>{choice.description}</QuestionnaireChoiceDescription>
            ) : null}
          </QuestionnaireChoice>
        ))}
        {"input" in question ? (
          <QuestionnaireInput
            aria-label={question.input.label}
            placeholder={question.input.placeholder}
          />
        ) : null}
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>
  ))}
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

```tsx
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const answers = new FormData(event.currentTarget);
  // answers.get("direction"), answers.getAll(...) for multiple items.
}
```

## Composition

Questionnaire is a [Stepper](/docs/components/stepper): its flow owns the ordered items, the active item, which items can be reached, their marks and finishing, so Next, Enter, Skip, the step dots and submit all move through one place that checks the shown question first. The answers (choices, inputs and shortcuts) come from the headless primitive. The containing page, card, dialog, or drawer owns close and cancellation behavior, persistence, transport, and branching.

- `items` is required: the questions in order, with `required` and `disabled`.
- `item`, `defaultItem` and `onItemChange` control the shown question. `defaultItem` resumes there, counting the questions before it as answered.
- `guard` checks an answered question before the questionnaire leaves it, as a stepper guard does.
- `onFinish` replaces the native submit once the last question passes; `QuestionnaireForm` uses it to submit TanStack Form.

```text
Questionnaire
├── QuestionnaireStepIndicator
├── QuestionnaireItem
│   ├── QuestionnaireTitle
│   ├── QuestionnaireDescription
│   ├── QuestionnaireChoices
│   │   ├── QuestionnaireChoice
│   │   └── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit
```

## Required Answers

A question that cannot be skipped is `required` in the questionnaire's `items`, declared once: each `QuestionnaireItem` takes it from its definition. Its title then ends with the same required mark as a required field's label, and `QuestionnaireSkip` hides for it. Next, Enter, a step dot ahead and submit are rejected while the active question is unanswered: the flow marks it, the error eases in under the answers, and the answers shake on every rejected attempt, as a field's control does after a rejected form submit. Answering clears the mark. Nothing needs wiring in the composition.

## Server Rendering

Pass `items` to server-render the active item, progress, actions, and answer

shortcuts. See the

[headless Questionnaire](https://ui.shadcn.com/docs/react/questionnaire) for the complete behavior.

## Accessibility

`QuestionnaireItem` renders a `fieldset`, and `QuestionnaireTitle` renders its

`legend`. Descriptions and active errors are associated with the current item,

and invalid items and answer controls expose `aria-invalid`.

Fixed choices preserve native radio and checkbox behavior. The step indicator is

an ordered list of step buttons named "Question 1 of 3", navigation uses real buttons, and inactive items and

actions are hidden and inert. Successful navigation focuses the newly active

item; failed validation focuses an available answer control.

Always give `QuestionnaireInput` an accessible name with a visible label,

`aria-label`, or `aria-labelledby`. A placeholder is not a label. See the

[Questionnaire accessibility guide](https://ui.shadcn.com/docs/react/questionnaire#accessibility)

for labeling custom compositions and the complete keyboard behavior.

## Unstyled

The behavior in `Questionnaire` comes from the `@shadcn/react` package. To use

it directly with your own markup and styles, see

[Questionnaire](https://ui.shadcn.com/docs/react/questionnaire) under @shadcn/react.
