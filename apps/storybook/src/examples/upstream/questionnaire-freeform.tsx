import { getFormValue } from "./form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  {
    choices: [{ value: "incremental" }, { value: "module" }, { value: "rewrite" }],
    name: "approach",
    required: true,
  },
] as const;

export function QuestionnaireFreeform() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const approach = getFormValue(new FormData(event.currentTarget), "approach");

    toast.add({ title: "Approach selected", description: `Approach: ${approach ?? "None"}` });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      items={items}
      shortcuts="letters"
      onSubmit={handleSubmit}
    >
      <QuestionnaireItem name="approach" required>
        <QuestionnaireTitle>How should the agent approach this refactor?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose a strategy or write a more specific instruction.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="incremental">
            Make the smallest safe change
          </QuestionnaireChoice>
          <QuestionnaireChoice value="module">Refactor one module at a time</QuestionnaireChoice>
          <QuestionnaireChoice value="rewrite">
            Replace the implementation completely
          </QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another refactoring approach"
            placeholder="Describe another approach…"
          />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnaireSubmit>Use this approach</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
