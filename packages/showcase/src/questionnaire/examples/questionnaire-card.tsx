import { getFormValue } from "../../form/examples/form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
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
  {
    choices: [{ value: "fix" }, { value: "refactor" }, { value: "docs" }],
    name: "task",
    required: true,
  },
  {
    choices: [{ value: "summary" }, { value: "files" }, { value: "review" }],
    name: "output",
    required: true,
  },
] as const;

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  toast.add({
    description: `Task: ${getFormValue(formData, "task", "None")} · Handoff: ${getFormValue(formData, "output", "None")}`,
    title: "Agent task created",
  });
};

export const QuestionnaireCard = () => {
  const taskTitleId = React.useId();
  const outputTitleId = React.useId();

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="task"
      items={items}
      shortcuts="numbers"
      onSubmit={handleSubmit}
    >
      <Card>
        <QuestionnaireItem aria-labelledby={taskTitleId} name="task">
          <CardHeader>
            <QuestionnaireTitle id={taskTitleId} render={<CardTitle />}>
              What should the agent work on?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Choose the task that should be handled next.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireStepIndicator />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="fix">Fix the failing tests</QuestionnaireChoice>
              <QuestionnaireChoice value="refactor">Refactor the data layer</QuestionnaireChoice>
              <QuestionnaireChoice value="docs">Update the integration guide</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem aria-labelledby={outputTitleId} name="output">
          <CardHeader>
            <QuestionnaireTitle id={outputTitleId} render={<CardTitle />}>
              What should the final handoff include?
            </QuestionnaireTitle>
            <QuestionnaireDescription render={<CardDescription />}>
              Pick the level of detail needed for review.
            </QuestionnaireDescription>
            <CardAction>
              <QuestionnaireStepIndicator />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="summary">Summary only</QuestionnaireChoice>
              <QuestionnaireChoice value="files">Summary and changed files</QuestionnaireChoice>
              <QuestionnaireChoice value="review">Full review handoff</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions className="w-full">
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Create task</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  );
};
