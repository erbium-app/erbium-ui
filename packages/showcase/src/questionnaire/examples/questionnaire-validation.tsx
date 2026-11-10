import { Schema } from "effect";
import { toast } from "@erbium/ui/components/toast";

import { Card, CardAction, CardContent, CardFooter, CardHeader } from "@erbium/ui/components/card";
import {
  QuestionnaireActions,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireForm,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireStepIndicator,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  useQuestionnaireForm,
} from "@erbium/ui/components/questionnaire";

const items = [
  { name: "detail", required: true },
  { name: "audience", required: true },
] as const;

const Detail = Schema.Literals(["summary", "complete"]).annotate({
  message: "Choose how much detail to include.",
});

const Audience = Schema.Literals(["team", "public"]).annotate({
  message: "Choose who will read the answer.",
});

/** The answers, with a rule that spans both items. */
const Answers = Schema.Struct({ audience: Audience, detail: Detail }).check(
  Schema.makeFilter(({ audience, detail }) =>
    audience === "public" && detail === "summary"
      ? {
          issue: "Public answers need enough context. Choose a complete answer.",
          path: ["detail"],
        }
      : undefined,
  ),
);

const defaultValues = { audience: "", detail: "" };

const ValidationProgress = () => <QuestionnaireStepIndicator className="min-w-0" />;

export const QuestionnaireValidation = () => {
  const form = useQuestionnaireForm({
    defaultValues,
    onSubmit: ({ value }) => {
      const answers = Schema.decodeUnknownSync(Answers)(value);

      toast.add({
        description: `Detail: ${answers.detail} · Audience: ${answers.audience}`,
        title: "Agent response configured",
      });
    },
    validators: { onDynamic: Schema.toStandardSchemaV1(Answers) },
  });

  return (
    <QuestionnaireForm className="mx-auto max-w-md" form={form} items={items}>
      <Card className="w-full">
        <form.AppField name="detail">
          {(field) => (
            <field.QuestionnaireItem required>
              <CardHeader>
                <QuestionnaireTitle>How much detail should the answer include?</QuestionnaireTitle>
                <QuestionnaireDescription>Choose the response depth.</QuestionnaireDescription>
                <CardAction>
                  <ValidationProgress />
                </CardAction>
              </CardHeader>
              <CardContent>
                <QuestionnaireChoices>
                  <field.QuestionnaireChoice value="summary">
                    Concise summary
                  </field.QuestionnaireChoice>
                  <field.QuestionnaireChoice value="complete">
                    Complete answer
                  </field.QuestionnaireChoice>
                </QuestionnaireChoices>
                <field.QuestionnaireError />
              </CardContent>
            </field.QuestionnaireItem>
          )}
        </form.AppField>

        <form.AppField name="audience">
          {(field) => (
            <field.QuestionnaireItem required>
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
                  <field.QuestionnaireChoice value="team">My team</field.QuestionnaireChoice>
                  <field.QuestionnaireChoice value="public">
                    Public audience
                  </field.QuestionnaireChoice>
                </QuestionnaireChoices>
                <field.QuestionnaireError />
              </CardContent>
            </field.QuestionnaireItem>
          )}
        </form.AppField>

        <CardFooter>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Validate answers</QuestionnaireSubmit>
          </QuestionnaireActions>
        </CardFooter>
      </Card>
    </QuestionnaireForm>
  );
};
