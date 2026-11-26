import {
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireNext,
  Questionnaire,
} from "@erbium/ui/components/questionnaire";

export const defaultProps = {
  choices: 2,
  description: "Choose one option.",
  prompt: "Which plan works best?",
  required: true,
} satisfies {
  prompt: string;
  description: string;
  required: boolean;
  choices: number;
};

export default function QuestionnairePlaygroundExample(
  args: {
    prompt: string;
    description: string;
    required: boolean;
    choices: number;
  } = defaultProps,
) {
  return (
    <Questionnaire className="w-80" items={[{ name: "plan", required: args.required }]}>
      <QuestionnaireItem name="plan">
        <QuestionnaireTitle>{args.prompt}</QuestionnaireTitle>
        <QuestionnaireDescription>{args.description}</QuestionnaireDescription>
        <QuestionnaireChoices>
          {Array.from({ length: args.choices }, (_, index) => index + 1).map((option) => (
            <QuestionnaireChoice key={option} value={`option-${option}`}>
              Option {option}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireActions>
          <QuestionnaireNext>Continue</QuestionnaireNext>
        </QuestionnaireActions>
      </QuestionnaireItem>
    </Questionnaire>
  );
}
