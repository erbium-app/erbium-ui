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
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  {
    choices: [{ value: "inspect" }, { value: "tests" }, { value: "patch" }],
    name: "action",
    required: true,
  },
] as const;

type ShortcutMode = React.ComponentProps<typeof Questionnaire>["shortcuts"];

export const QuestionnaireShortcuts = () => {
  const [shortcuts, setShortcuts] = React.useState<ShortcutMode>("letters");

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const action = getFormValue(new FormData(event.currentTarget), "action");

    toast.add({
      description: `Action: ${action ?? "None"} · Shortcuts: ${shortcuts ?? "none"}`,
      title: "Next action selected",
    });
  };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-md flex-col">
      <select
        aria-label="Shortcut style"
        className="absolute end-0 top-0"
        value={shortcuts ?? "none"}
        onChange={(event) => {
          const { value } = event.target;
          setShortcuts(value === "letters" || value === "numbers" ? value : undefined);
        }}
      >
        <option value="none">No shortcuts</option>
        <option value="letters">Letters</option>
        <option value="numbers">Numbers</option>
      </select>

      <Questionnaire
        className="mt-auto"
        items={items}
        shortcuts={shortcuts}
        onSubmit={handleSubmit}
      >
        <QuestionnaireItem name="action">
          <QuestionnaireTitle>What should the agent do next?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Use the displayed shortcut or navigate with the keyboard.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="inspect">Inspect the implementation</QuestionnaireChoice>
            <QuestionnaireChoice value="tests">Run the relevant tests</QuestionnaireChoice>
            <QuestionnaireChoice value="patch">Prepare the patch</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireActions>
          <QuestionnaireSubmit>Confirm action</QuestionnaireSubmit>
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  );
};
