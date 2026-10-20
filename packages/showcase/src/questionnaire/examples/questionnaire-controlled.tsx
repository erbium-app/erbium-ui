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

const items = [
  { name: "scope", required: true },
  { name: "checks", required: true },
  { name: "output", required: true },
] as const;

const itemLabels: Record<string, string> = {
  checks: "Verification",
  output: "Final output",
  scope: "Change scope",
};

export const QuestionnaireControlled = () => {
  const [item, setItem] = React.useState("scope");
  // Furthest checkpoint reached. Dots beyond it are blocked; earlier ones are free.
  const [reach, setReach] = React.useState(0);
  const names = items.map((entry) => entry.name);

  const handleItemChange = (next: string) => {
    setItem(next);
    setReach((current) => Math.max(current, names.indexOf(next as (typeof names)[number])));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    toast.add({
      description: `Scope: ${getFormValue(formData, "scope", "None")} · Verification: ${getFormValue(formData, "checks", "None")} · Output: ${getFormValue(formData, "output", "None")}`,
      title: "Agent workflow configured",
    });
  };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
      <p className="absolute end-0 top-0 text-caption text-muted-foreground" role="status">
        Current checkpoint: {itemLabels[item]}
      </p>

      <Questionnaire
        className="mt-auto"
        item={item}
        items={items}
        onItemChange={handleItemChange}
        onSubmit={handleSubmit}
      >
        <QuestionnaireStepIndicator
          reach={reach}
          onValueChange={(index) => {
            setItem(names[index]);
          }}
        />

        <QuestionnaireItem name="scope" required>
          <QuestionnaireTitle>What may the agent change?</QuestionnaireTitle>
          <QuestionnaireDescription>
            The host stores the active checkpoint while Questionnaire navigates.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="component">Only the target component</QuestionnaireChoice>
            <QuestionnaireChoice value="tests">Component and related tests</QuestionnaireChoice>
            <QuestionnaireChoice value="feature">The complete feature area</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="checks" required>
          <QuestionnaireTitle>Which verification level should it use?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="targeted">Targeted tests</QuestionnaireChoice>
            <QuestionnaireChoice value="package">Package tests and typecheck</QuestionnaireChoice>
            <QuestionnaireChoice value="full">Full workspace verification</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="output" required>
          <QuestionnaireTitle>What should the agent return when finished?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="summary">Concise summary</QuestionnaireChoice>
            <QuestionnaireChoice value="diff">Summary with changed files</QuestionnaireChoice>
            <QuestionnaireChoice value="handoff">
              Detailed implementation handoff
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
    </div>
  );
};
