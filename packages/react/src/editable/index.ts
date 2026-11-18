import {
  EditableCancel,
  EditableInput,
  EditablePreview,
  EditableRoot,
  EditableSubmit,
  EditableTrigger,
} from "./parts";

/**
 * Text that reads as text and becomes an input in place: `Root` holds the value and the editing
 * mode, `Preview` shows the value, `Input` edits a draft, and `Trigger`, `Submit` and `Cancel` are
 * optional buttons.
 */
const Editable = {
  Cancel: EditableCancel,
  Input: EditableInput,
  Preview: EditablePreview,
  Root: EditableRoot,
  Submit: EditableSubmit,
  Trigger: EditableTrigger,
};

export { Editable };

export type {
  EditableActivationReason,
  EditableCancelDetails,
  EditableCancelReason,
  EditableEditingChangeDetails,
  EditableEditingReason,
  EditableRootProps,
  EditableState,
  EditableSubmitDetails,
  EditableSubmitReason,
} from "./parts";
