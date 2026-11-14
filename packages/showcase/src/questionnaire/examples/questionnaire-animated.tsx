import { getFormValue } from "../../form/examples/form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireStepIndicator,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  { name: "task", required: true },
  { name: "review", required: true },
  { name: "delivery", required: true },
] as const;

const itemClassName =
  "data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-bottom-2 data-active:duration-300 motion-reduce:animate-none";

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  toast.add({
    description: `Task: ${getFormValue(formData, "task", "None")} · Review: ${getFormValue(formData, "review", "None")} · Delivery: ${getFormValue(formData, "delivery", "None")}`,
    title: "Agent workflow saved",
  });
};

export const QuestionnaireAnimated = () => (
  <Questionnaire
    className="mx-auto max-w-md"
    defaultItem="task"
    items={items}
    onSubmit={handleSubmit}
  >
    <QuestionnaireStepIndicator />

    <QuestionnaireItem className={itemClassName} name="task">
      <QuestionnaireTitle>What should the agent do?</QuestionnaireTitle>
      <QuestionnaireDescription>Choose the task for this run.</QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="implement">Implement the requested change</QuestionnaireChoice>
        <QuestionnaireChoice value="debug">Debug the current behavior</QuestionnaireChoice>
        <QuestionnaireChoice value="review">Review the implementation</QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>

    {/* No description and two answers: the questionnaire eases to the shorter question. */}
    <QuestionnaireItem className={itemClassName} name="review">
      <QuestionnaireTitle>How should the work be reviewed?</QuestionnaireTitle>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="targeted">Targeted checks</QuestionnaireChoice>
        <QuestionnaireChoice value="complete">Complete test suite</QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>

    {/* A longer description and four described answers: it eases to the taller question. */}
    <QuestionnaireItem className={itemClassName} name="delivery">
      <QuestionnaireTitle>How should the result be delivered?</QuestionnaireTitle>
      <QuestionnaireDescription>
        Choose the final handoff format. The agent attaches the run log to every format, so pick the
        one your reviewers read first.
      </QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="summary">
          Concise summary
          <QuestionnaireChoiceDescription>
            A few lines on what changed.
          </QuestionnaireChoiceDescription>
        </QuestionnaireChoice>
        <QuestionnaireChoice value="diff">
          Summary and changed files
          <QuestionnaireChoiceDescription>
            Each file with a note on why it changed.
          </QuestionnaireChoiceDescription>
        </QuestionnaireChoice>
        <QuestionnaireChoice value="handoff">
          Detailed review handoff
          <QuestionnaireChoiceDescription>
            Decisions, risks and what to check by hand.
          </QuestionnaireChoiceDescription>
        </QuestionnaireChoice>
        <QuestionnaireChoice value="pull-request">
          Pull request
          <QuestionnaireChoiceDescription>
            Opened as a draft with the summary as its body.
          </QuestionnaireChoiceDescription>
        </QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>

    <QuestionnaireActions>
      <QuestionnairePrevious />
      <QuestionnaireNext>Next</QuestionnaireNext>
      <QuestionnaireSubmit>Save workflow</QuestionnaireSubmit>
    </QuestionnaireActions>
  </Questionnaire>
);
