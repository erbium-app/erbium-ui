import { act, fireEvent, render, screen } from "@testing-library/react";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import { ButtonShortcut } from "@erbium/ui/components/button";

test("keeps focus and blocks repeat activation while an action runs", async () => {
  let resolveAction: () => void = () => {};
  const onClick = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        resolveAction = resolve;
      }),
  );

  render(
    <StatefulButton onClick={onClick} successDuration={500} successLabel="Saved">
      Save
    </StatefulButton>,
  );
  const button = screen.getByRole("button", { name: "Save" });
  button.focus();
  fireEvent.click(button);

  expect(button).toBe(document.activeElement);
  expect(button.getAttribute("aria-busy")).toBe("true");
  expect(button.getAttribute("aria-disabled")).toBe("true");
  expect(button.getAttribute("data-state")).toBe("loading");
  expect(button.querySelector('[data-slot="spinner"]')?.hasAttribute("data-icon")).toBe(false);

  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);

  await act(async () => resolveAction());
  expect(button.getAttribute("data-state")).toBe("success");
  expect(button).toBe(document.activeElement);
  expect(screen.getByRole("status", { name: "Saved" })).toBeTruthy();
});

test("returns to idle after the Pacer success duration", async () => {
  vi.useFakeTimers();
  try {
    render(
      <StatefulButton onClick={async () => {}} successDuration={500}>
        Save
      </StatefulButton>,
    );
    const button = screen.getByRole("button");
    await act(async () => fireEvent.click(button));
    expect(button.getAttribute("data-state")).toBe("success");

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(button.getAttribute("data-state")).toBe("idle");
  } finally {
    vi.useRealTimers();
  }
});

test("resets after a rejected action and reports the error", async () => {
  const error = new Error("Save failed");
  const onError = vi.fn();
  render(
    <StatefulButton
      onClick={async () => {
        throw error;
      }}
      onError={onError}
    >
      Save
    </StatefulButton>,
  );
  const button = screen.getByRole("button");

  await act(async () => fireEvent.click(button));

  expect(button.getAttribute("data-state")).toBe("idle");
  expect(onError).toHaveBeenCalledWith(error);
});

test("keeps the shortcut with the idle label during state changes", async () => {
  let resolveAction: () => void = () => {};
  const { container } = render(
    <StatefulButton
      onClick={() =>
        new Promise<void>((resolve) => {
          resolveAction = resolve;
        })
      }
      successLabel="Saved"
    >
      Save
      <ButtonShortcut hotkey="Mod+S" />
    </StatefulButton>,
  );

  const button = screen.getByRole("button", { name: "Save" });
  const shortcut = container.querySelector('[data-slot="button-shortcut"]');
  expect(shortcut?.closest('[aria-hidden="false"]')).toBeTruthy();

  fireEvent.click(button);
  expect(button.getAttribute("data-state")).toBe("loading");
  expect(shortcut?.closest('[aria-hidden="true"]')).toBeTruthy();

  await act(async () => resolveAction());
  expect(button.getAttribute("data-state")).toBe("success");
  expect(shortcut?.closest('[aria-hidden="true"]')).toBeTruthy();
});
