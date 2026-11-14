import { getFormValue } from "../../form/examples/form-value";
import * as React from "react";
import type { QuestionnaireItemStatus } from "@shadcn/react/questionnaire";
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
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireStepIndicator,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  { name: "task", required: true },
  { name: "constraints" },
  { name: "review", required: true },
] as const;

export const QuestionnaireSkipExample = () => {
  const [constraintStatus, setConstraintStatus] =
    React.useState<QuestionnaireItemStatus>("unanswered");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const answers = {
      constraintStatus,
      constraints: getFormValue(formData, "constraints"),
      review: getFormValue(formData, "review"),
      task: getFormValue(formData, "task"),
    };

    toast.add({
      description: `Task: ${answers.task ?? "None"} · Constraints: ${
        answers.constraintStatus === "skipped" ? "Skipped" : (answers.constraints ?? "None")
      } · Review: ${answers.review ?? "None"}`,
      title: "Agent brief submitted",
    });
  };

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireStepIndicator />

      <QuestionnaireItem name="task">
        <QuestionnaireTitle>What kind of change is this?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the category that best describes the work.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="feature">New feature</QuestionnaireChoice>
          <QuestionnaireChoice value="fix">Bug fix</QuestionnaireChoice>
          <QuestionnaireChoice value="refactor">Refactor</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="constraints" onStatusChange={setConstraintStatus}>
        <QuestionnaireTitle>Are there any implementation constraints?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Answer if needed, or intentionally skip this question.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="no-dependencies">Do not add dependencies</QuestionnaireChoice>
          <QuestionnaireChoice value="no-migrations">
            Do not change the database
          </QuestionnaireChoice>
          <QuestionnaireChoice value="preserve-api">Preserve the public API</QuestionnaireChoice>
          <QuestionnaireInput
            aria-label="Another implementation constraint"
            placeholder="Describe another constraint…"
          />
        </QuestionnaireChoices>
      </QuestionnaireItem>

      <QuestionnaireItem name="review">
        <QuestionnaireTitle>How should the work be reviewed?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Choose the checks the agent should complete before handoff.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="tests">Run the test suite</QuestionnaireChoice>
          <QuestionnaireChoice value="diff">Review the final diff</QuestionnaireChoice>
          <QuestionnaireChoice value="both">Tests and diff review</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Submit brief</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
};
