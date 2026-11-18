/**
 * What a change callback receives besides the new value: why the change happened, the DOM event
 * behind it, and a way to reject it. Mirrors Base UI's event details.
 */
interface ChangeDetailsBase<TReason extends string> {
  /** What caused the change. */
  reason: TReason;
  /** The DOM event behind the change, when there is one. */
  event: Event | undefined;
  /** Rejects the change: the primitive keeps its current state. */
  cancel: () => void;
  /** Whether a callback called `cancel()`. */
  readonly isCanceled: boolean;
}

type ChangeDetails<
  TReason extends string,
  TExtra extends object = object,
> = ChangeDetailsBase<TReason> & TExtra;

const createChangeDetails = <TReason extends string, TExtra extends object = object>(
  reason: TReason,
  event?: Event | { nativeEvent: Event },
  extra?: TExtra,
): ChangeDetails<TReason, TExtra> => {
  let canceled = false;
  const nativeEvent = event !== undefined && "nativeEvent" in event ? event.nativeEvent : event;

  const details: ChangeDetailsBase<TReason> = {
    cancel: () => {
      canceled = true;
    },
    event: nativeEvent,
    get isCanceled() {
      return canceled;
    },
    reason,
  };

  // Keep the getter: spreading would freeze `isCanceled` at false.
  return Object.assign(details, extra);
};

export { createChangeDetails };

export type { ChangeDetails };
