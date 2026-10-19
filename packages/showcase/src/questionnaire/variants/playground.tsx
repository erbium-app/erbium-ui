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

const Example = (args: {
  prompt: string;
  description: string;
  required: boolean;
  choices: number;
}) => (
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

export default Example;
