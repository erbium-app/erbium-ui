import { getFormValue } from "./form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@erbium/ui/components/dialog";
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
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  { name: "scope", required: true },
  { name: "tests", required: true },
] as const;

export function QuestionnaireDialog() {
  const [open, setOpen] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setOpen(false);
    toast.add({
      title: "Clarification sent",
      description: `Scope: ${getFormValue(formData, "scope", "None")} · Verification: ${getFormValue(formData, "tests", "None")}`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open clarification</DialogTrigger>
      <DialogPanel>
        <DialogContent className="p-0">
          <Questionnaire
            defaultItem="scope"
            items={items}
            onSubmit={handleSubmit}
            className="gap-0"
          >
            <QuestionnaireItem name="scope" required>
              <div className="flex flex-col gap-1 border-b px-4 pt-4 pb-2">
                <QuestionnaireProgress />
                <QuestionnaireTitle render={<DialogTitle />}>
                  Which files are in scope?
                </QuestionnaireTitle>
                <QuestionnaireDescription render={<DialogDescription />}>
                  Choose how broadly the agent can update the workspace.
                </QuestionnaireDescription>
              </div>
              <QuestionnaireChoices className="px-4 pb-4">
                <QuestionnaireChoice value="component">Component only</QuestionnaireChoice>
                <QuestionnaireChoice value="feature">
                  Complete feature directory
                </QuestionnaireChoice>
                <QuestionnaireChoice value="workspace">
                  Any related workspace file
                </QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError className="px-4" />
            </QuestionnaireItem>

            <QuestionnaireItem name="tests" required>
              <div className="flex flex-col gap-1 border-b px-4 pt-4 pb-2">
                <QuestionnaireProgress />
                <QuestionnaireTitle render={<DialogTitle />}>
                  How much verification is needed?
                </QuestionnaireTitle>
                <QuestionnaireDescription render={<DialogDescription />}>
                  Choose the checks the agent should run before handoff.
                </QuestionnaireDescription>
              </div>
              <QuestionnaireChoices className="px-4 pb-4">
                <QuestionnaireChoice value="targeted">Targeted tests</QuestionnaireChoice>
                <QuestionnaireChoice value="package">Package tests</QuestionnaireChoice>
                <QuestionnaireChoice value="full">Full workspace verification</QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError className="px-4" />
            </QuestionnaireItem>

            <div className="flex flex-col-reverse gap-2 border-t bg-muted/50 px-4 py-3 sm:flex-row sm:justify-end">
              <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
              <QuestionnaireActions>
                <QuestionnairePrevious />
                <QuestionnaireNext>Next</QuestionnaireNext>
                <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
              </QuestionnaireActions>
            </div>
          </Questionnaire>
        </DialogContent>
      </DialogPanel>
    </Dialog>
  );
}
