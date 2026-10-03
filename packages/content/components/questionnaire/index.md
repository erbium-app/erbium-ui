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
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
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
  <QuestionnaireProgress />
  {items.map((question) => (
    <QuestionnaireItem key={question.name} name={question.name} required={question.required}>
      <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
      <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
      <QuestionnaireChoices>
        {question.choices.map((choice) => (
          <QuestionnaireChoice key={choice.value} value={choice.value}>
            <span className="font-medium">{choice.label}</span>
            {"description" in choice ? (
              <span className="text-muted-foreground">{choice.description}</span>
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

Questionnaire owns the ordered items, active item, answer state, validation,

progress, and navigation. The containing page, card, dialog, or drawer owns

close and cancellation behavior, persistence, transport, and branching.

```text
Questionnaire
├── QuestionnaireProgress
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

## Server Rendering

Pass `items` to server-render the active item, progress, actions, and answer

shortcuts. See the

[headless Questionnaire](https://ui.shadcn.com/docs/react/questionnaire) for the complete behavior.

## Accessibility

`QuestionnaireItem` renders a `fieldset`, and `QuestionnaireTitle` renders its

`legend`. Descriptions and active errors are associated with the current item,

and invalid items and answer controls expose `aria-invalid`.

Fixed choices preserve native radio and checkbox behavior. Progress is exposed

as a named progressbar, navigation uses real buttons, and inactive items and

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
