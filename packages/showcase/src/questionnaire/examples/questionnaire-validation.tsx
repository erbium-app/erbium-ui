import * as React from "react";
import { toast } from "@erbium/ui/components/toast";
import { z } from "zod";

import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@erbium/ui/components/card";
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
  { name: "detail", required: true },
  { name: "audience", required: true },
] as const;

const questionnaireSchema = z
  .object({
    audience: z.enum(["team", "public"]),
    detail: z.enum(["summary", "complete"]),
  })
  .superRefine((answers, context) => {
    if (answers.audience === "public" && answers.detail === "summary") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Public answers need enough context. Choose a complete answer.",
        path: ["detail"],
      });
    }
  });

type QuestionnaireItemName = keyof z.infer<typeof questionnaireSchema>;

type QuestionnaireErrors = Partial<Record<QuestionnaireItemName, string>>;

const ValidationProgress = () => <QuestionnaireStepIndicator className="min-w-0" />;

export const QuestionnaireValidation = () => {
  const [item, setItem] = React.useState("detail");
  const [errors, setErrors] = React.useState<QuestionnaireErrors>({});

  const clearError = (name: QuestionnaireItemName) => {
    setErrors((currentErrors) => {
      if (!currentErrors[name]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[name];

      return nextErrors;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = questionnaireSchema.safeParse(
      Object.fromEntries(new FormData(event.currentTarget)),
    );

    if (result.success) {
      setErrors({});
      toast.add({
        description: `Detail: ${result.data.detail} · Audience: ${result.data.audience}`,
        title: "Agent response configured",
      });

      return;
    }

    const nextErrors: QuestionnaireErrors = {};

    for (const issue of result.error.issues) {
      const name = issue.path[0];

      if ((name === "detail" || name === "audience") && !nextErrors[name]) {
        nextErrors[name] = issue.message;
      }
    }

    const firstInvalidItem = result.error.issues[0]?.path[0];

    setErrors(nextErrors);

    if (firstInvalidItem === "detail" || firstInvalidItem === "audience") {
      setItem(firstInvalidItem);
    }
  };

  return (
    <Questionnaire
      className="mx-auto max-w-md"
      item={item}
      items={items}
      onItemChange={setItem}
      onSubmit={handleSubmit}
    >
      <Card className="w-full">
        <QuestionnaireItem invalid={Boolean(errors.detail)} name="detail" required>
          <CardHeader>
            <QuestionnaireTitle>How much detail should the answer include?</QuestionnaireTitle>
            <QuestionnaireDescription>Choose the response depth.</QuestionnaireDescription>
            <CardAction>
              <ValidationProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice
                value="summary"
                onChange={() => {
                  clearError("detail");
                }}
              >
                Concise summary
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="complete"
                onChange={() => {
                  clearError("detail");
                }}
              >
                Complete answer
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>{errors.detail}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>

        <QuestionnaireItem invalid={Boolean(errors.audience)} name="audience" required>
          <CardHeader>
            <QuestionnaireTitle>Who will read the answer?</QuestionnaireTitle>
            <QuestionnaireDescription>
              Public answers require complete context.
            </QuestionnaireDescription>
            <CardAction>
              <ValidationProgress />
            </CardAction>
          </CardHeader>
          <CardContent>
            <QuestionnaireChoices>
              <QuestionnaireChoice
                value="team"
                onChange={() => {
                  clearError("audience");
                }}
              >
                My team
              </QuestionnaireChoice>
              <QuestionnaireChoice
                value="public"
                onChange={() => {
                  clearError("audience");
                }}
              >
                Public audience
              </QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError>{errors.audience}</QuestionnaireError>
          </CardContent>
        </QuestionnaireItem>

        <CardFooter>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Validate answers</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </Questionnaire>
  );
};
