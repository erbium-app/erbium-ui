import { getFormValue } from "../../form/examples/form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

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

const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  toast.add({
    description: `Runtime: ${getFormValue(formData, "runtime", "None")} · Environment: ${getFormValue(formData, "environment", "Not applicable")} · Approval: ${getFormValue(formData, "approval", "None")}`,
    title: "Execution plan saved",
  });
};

export default function QuestionnaireConditionalExample() {
  const [runtime, setRuntime] = React.useState("local");

  const items = React.useMemo(
    () => [
      { name: "runtime", required: true },
      {
        disabled: runtime !== "cloud",
        name: "environment",
        required: true,
      },
      { name: "approval", required: true },
    ],
    [runtime],
  );

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      defaultItem="runtime"
      items={items}
      onSubmit={handleSubmit}
    >
      <QuestionnaireStepIndicator />

      <QuestionnaireItem name="runtime">
        <QuestionnaireTitle>Where should the agent run?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Cloud runs add an environment question to this flow.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice
            checked={runtime === "local"}
            value="local"
            onChange={() => {
              setRuntime("local");
            }}
          >
            Local workspace
          </QuestionnaireChoice>
          <QuestionnaireChoice
            checked={runtime === "cloud"}
            value="cloud"
            onChange={() => {
              setRuntime("cloud");
            }}
          >
            Cloud workspace
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem disabled={runtime !== "cloud"} name="environment">
        <QuestionnaireTitle>Which cloud environment should it use?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
          <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
          <QuestionnaireChoice value="isolated">Isolated sandbox</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireItem name="approval">
        <QuestionnaireTitle>When should the agent request approval?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="writes">Before writing files</QuestionnaireChoice>
          <QuestionnaireChoice value="commands">Before running commands</QuestionnaireChoice>
          <QuestionnaireChoice value="sensitive">Only for sensitive actions</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>

      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Save execution plan</QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
