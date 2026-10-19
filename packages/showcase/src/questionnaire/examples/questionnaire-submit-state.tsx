import * as React from "react";
import { toast } from "@erbium/ui/components/toast";
import type { StatefulButtonState } from "@erbium/ui/components/stateful-button";

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireStepIndicator,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  { name: "environment", required: true },
  { name: "rollout", required: true },
] as const;

export function QuestionnaireSubmitState() {
  const [state, setState] = React.useState<StatefulButtonState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state !== "idle") {
      return;
    }

    // The host owns the request; the button only reflects its state.
    setState("loading");
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setState("success");
    toast.add({ title: "Deployment queued" });
  }

  return (
    <Questionnaire className="mx-auto max-w-md" items={items} onSubmit={handleSubmit}>
      <QuestionnaireStepIndicator />

      <QuestionnaireItem name="environment" required>
        <QuestionnaireTitle>Where should this deploy?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
          <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
          <QuestionnaireChoice value="production">Production</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="rollout" required>
        <QuestionnaireTitle>How should it roll out?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="all">All at once</QuestionnaireChoice>
          <QuestionnaireChoice value="gradual">Gradually</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit state={state} onStateChange={setState} successLabel="Queued">
          Deploy
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
