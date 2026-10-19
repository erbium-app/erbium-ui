import { getFormValue } from "../../form/examples/form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

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
  { name: "scope", required: true },
  { name: "strategy", required: true },
  { name: "tests", required: true },
  { name: "delivery", required: true },
] as const;

export function QuestionnaireProgressExample() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    toast.add({
      description: `Scope: ${getFormValue(formData, "scope", "None")} · Commits: ${getFormValue(formData, "strategy", "None")} · Tests: ${getFormValue(formData, "tests", "None")} · Delivery: ${getFormValue(formData, "delivery", "None")}`,
      title: "Pull request plan ready",
    });
  }

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="scope"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireStepIndicator />

      <QuestionnaireItem name="scope" required>
        <QuestionnaireTitle>How large is the change?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="small">Small patch</QuestionnaireChoice>
          <QuestionnaireChoice value="medium">Feature-sized change</QuestionnaireChoice>
          <QuestionnaireChoice value="large">Cross-package change</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="strategy" required>
        <QuestionnaireTitle>How should commits be organized?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="single">Single commit</QuestionnaireChoice>
          <QuestionnaireChoice value="logical">Logical commits</QuestionnaireChoice>
          <QuestionnaireChoice value="squash">Squash before review</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="tests" required>
        <QuestionnaireTitle>Which tests should run?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="targeted">Targeted tests</QuestionnaireChoice>
          <QuestionnaireChoice value="package">Package suite</QuestionnaireChoice>
          <QuestionnaireChoice value="workspace">Full workspace</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="delivery" required>
        <QuestionnaireTitle>How should the work be delivered?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="patch">Patch only</QuestionnaireChoice>
          <QuestionnaireChoice value="commit">Committed locally</QuestionnaireChoice>
          <QuestionnaireChoice value="branch">Push a review branch</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Finish plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
