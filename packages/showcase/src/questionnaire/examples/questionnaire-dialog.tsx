import { getFormValue } from "../../form/examples/form-value";
import * as React from "react";
import { toast } from "@erbium/ui/components/toast";

import { Button } from "@erbium/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogPanel,
  DialogContent,
  DialogHeader,
  DialogFooter,
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
  QuestionnaireStepIndicator,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@erbium/ui/components/questionnaire";

const items = [
  { name: "scope", required: true },
  { name: "tests", required: true },
] as const;

export const QuestionnaireDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    setOpen(false);
    toast.add({
      description: `Scope: ${getFormValue(formData, "scope", "None")} · Verification: ${getFormValue(formData, "tests", "None")}`,
      title: "Clarification sent",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>Open clarification</DialogTrigger>
      <DialogPanel>
        <DialogTitle className="sr-only">Workspace clarification</DialogTitle>
        <DialogDescription className="sr-only">
          Choose the scope and verification for this request.
        </DialogDescription>
        <Questionnaire
          defaultItem="scope"
          items={items}
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 gap-0"
        >
          <QuestionnaireItem name="scope" required className="min-h-0 flex-1 gap-0">
            <DialogHeader>
              <QuestionnaireStepIndicator />
              <QuestionnaireTitle>Which files are in scope?</QuestionnaireTitle>
              <QuestionnaireDescription>
                Choose how broadly the agent can update the workspace.
              </QuestionnaireDescription>
            </DialogHeader>
            <DialogContent>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="component">Component only</QuestionnaireChoice>
                <QuestionnaireChoice value="feature">
                  Complete feature directory
                </QuestionnaireChoice>
                <QuestionnaireChoice value="workspace">
                  Any related workspace file
                </QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError />
            </DialogContent>
          </QuestionnaireItem>

          <QuestionnaireItem name="tests" required className="min-h-0 flex-1 gap-0">
            <DialogHeader>
              <QuestionnaireStepIndicator />
              <QuestionnaireTitle>How much verification is needed?</QuestionnaireTitle>
              <QuestionnaireDescription>
                Choose the checks the agent should run before handoff.
              </QuestionnaireDescription>
            </DialogHeader>
            <DialogContent>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="targeted">Targeted tests</QuestionnaireChoice>
                <QuestionnaireChoice value="package">Package tests</QuestionnaireChoice>
                <QuestionnaireChoice value="full">Full workspace verification</QuestionnaireChoice>
              </QuestionnaireChoices>
              <QuestionnaireError />
            </DialogContent>
          </QuestionnaireItem>

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext>Next</QuestionnaireNext>
              <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
            </QuestionnaireActions>
          </DialogFooter>
        </Questionnaire>
      </DialogPanel>
    </Dialog>
  );
};
