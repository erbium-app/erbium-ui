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

export default function QuestionnaireSubmitStateExample() {
  const [state, setState] = React.useState<StatefulButtonState>("idle");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (state !== "idle") {
      return;
    }

    // The host owns the request; the button only reflects its state.
    setState("loading");
    setTimeout(() => {
      setState("success");
      toast.add({ title: "Deployment queued" });
    }, 1200);
  };

  return (
    <Questionnaire className="mx-auto max-w-md" items={items} onSubmit={handleSubmit}>
      <QuestionnaireStepIndicator />

      <QuestionnaireItem name="environment">
        <QuestionnaireTitle>Where should this deploy?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
          <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
          <QuestionnaireChoice value="production">Production</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="rollout">
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
