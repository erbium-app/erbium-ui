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
    <Questionnaire className="w-80">
      <QuestionnaireItem name="plan" required={args.required}>
        <QuestionnaireTitle>{args.prompt}</QuestionnaireTitle>
        <QuestionnaireDescription>{args.description}</QuestionnaireDescription>
        <QuestionnaireChoices>
          {Array.from({ length: args.choices }, (_, index) => (
            <QuestionnaireChoice key={index} value={`option-${index}`}>
              Option {index + 1}
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
