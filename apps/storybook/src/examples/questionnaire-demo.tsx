import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireNext,
} from "@erbium/ui/components/questionnaire";
export default function Demo() {
  return (
    <Questionnaire>
      <QuestionnaireItem name="plan">
        <QuestionnaireTitle>What is your preferred plan?</QuestionnaireTitle>
        <QuestionnaireDescription>Choose one option to continue.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="starter">Starter</QuestionnaireChoice>
          <QuestionnaireChoice value="pro">Pro</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireActions>
          <QuestionnaireNext>Continue</QuestionnaireNext>
        </QuestionnaireActions>
      </QuestionnaireItem>
    </Questionnaire>
  );
}
