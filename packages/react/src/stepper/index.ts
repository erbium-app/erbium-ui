import {
  StepperAnnouncer,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperList,
  StepperNext,
  StepperPanel,
  StepperPrevious,
  StepperRoot,
  StepperSeparator,
  StepperSkip,
  StepperTitle,
  StepperTrigger,
} from "./parts";

/**
 * A multi-step flow. `Root` holds it, `List` and `Item` lay out the steps with a `Trigger`,
 * `Indicator`, `Title`, `Description` and `Separator`, `Panel` shows the current step's content,
 * and `Previous`, `Next` and `Skip` move through it. The flow itself is the pure machine in
 * `@erbium-ui/react/stepper/core`.
 */
const Stepper = {
  Announcer: StepperAnnouncer,
  Description: StepperDescription,
  Indicator: StepperIndicator,
  Item: StepperItem,
  List: StepperList,
  Next: StepperNext,
  Panel: StepperPanel,
  Previous: StepperPrevious,
  Root: StepperRoot,
  Separator: StepperSeparator,
  Skip: StepperSkip,
  Title: StepperTitle,
  Trigger: StepperTrigger,
};

export { Stepper };

export { useStepper, useStepperGuard, useStepperItem, useStepperSelector } from "./parts";

export type {
  StepperAnnouncerProps,
  StepperApi,
  StepperControlState,
  StepperIndicatorProps,
  StepperItemProps,
  StepperItemState,
  StepperLabels,
  StepperListState,
  StepperNextState,
  StepperOrientation,
  StepperPanelProps,
  StepperPanelState,
  StepperRootProps,
  StepperRootState,
} from "./parts";

export { createStepperFormFinish, useStepperFormGroup } from "./form";

export type {
  StepperFieldMeta,
  StepperForm,
  StepperFormFinishOptions,
  StepperFormGroup,
  StepperFormGroupOptions,
} from "./form";

export type {
  StepperChangeDetails,
  StepperFinish,
  StepperFinishFailure,
  StepperFinishResult,
  StepperGuard,
  StepperGuardContext,
  StepperGuardVerdict,
  StepperView,
} from "./store";

export * from "./core";
