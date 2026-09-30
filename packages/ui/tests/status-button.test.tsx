import { act, fireEvent, render, screen } from "@testing-library/react";
import { StatusButton } from "@erbium/ui/components/status-button";

test("keeps focus and blocks repeat activation while an action runs", async () => {
  let resolveAction: () => void = () => {};
  const onClick = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveAction = resolve;
      }),
  );

  render(
    <StatusButton onClick={onClick} successDuration={500} successLabel="Saved">
      Save
    </StatusButton>,
  );
  const button = screen.getByRole("button", { name: "Save" });
  button.focus();
  fireEvent.click(button);

  expect(button).toBe(document.activeElement);
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(button.getAttribute("aria-disabled")).toBe("true");
  expect(button.getAttribute("data-status")).toBe("loading");

  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);

  await act(async () => resolveAction());
  expect(button.getAttribute("data-status")).toBe("success");
  expect(button).toBe(document.activeElement);
  expect(screen.getByRole("status", { name: "Saved" })).toBeTruthy();
});

test("returns to idle after the Pacer success duration", async () => {
  vi.useFakeTimers();
  try {
    render(
      <StatusButton onClick={async () => {}} successDuration={500}>
        Save
      </StatusButton>,
    );
    const button = screen.getByRole("button");
    await act(async () => fireEvent.click(button));
    expect(button.getAttribute("data-status")).toBe("success");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(button.getAttribute("data-status")).toBe("idle");
  } finally {
    vi.useRealTimers();
  }
});

test("resets after a rejected action and reports the error", async () => {
  const error = new Error("Save failed");
  const onError = vi.fn();
  render(
    <StatusButton
      onClick={async () => {
        throw error;
      }}
      onError={onError}
    >
      Save
    </StatusButton>,
  );
  const button = screen.getByRole("button");

  await act(async () => fireEvent.click(button));

  expect(button.getAttribute("data-status")).toBe("idle");
  expect(onError).toHaveBeenCalledWith(error);
});
