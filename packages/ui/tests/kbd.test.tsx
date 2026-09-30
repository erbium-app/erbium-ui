import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { Kbd } from "@erbium/ui/components/kbd";

test.each([
  ["MacIntel", "⇧ ⌘ K"],
  ["Win32", "Ctrl+Shift+K"],
])("formats Mod for %s", (platform, label) => {
  const originalPlatform = Object.getOwnPropertyDescriptor(navigator, "platform");
  Object.defineProperty(navigator, "platform", { configurable: true, value: platform });

  try {
    render(<Kbd hotkey="Mod+Shift+K" />);
    expect(screen.getByText(label).tagName).toBe("KBD");
  } finally {
    if (originalPlatform) Object.defineProperty(navigator, "platform", originalPlatform);
  }
});

test("formats injected text and standalone keys", () => {
  const { container } = render(
    <div>
      <Kbd>Escape</Kbd>
      <Kbd hotkey="Enter" />
    </div>,
  );

  expect(container.querySelectorAll("kbd")).toHaveLength(2);
  expect(screen.getByText("Esc")).toBeTruthy();
});

test("uses a stable server label before client platform detection", () => {
  const originalPlatform = Object.getOwnPropertyDescriptor(navigator, "platform");
  Object.defineProperty(navigator, "platform", { configurable: true, value: "MacIntel" });

  try {
    expect(renderToString(<Kbd hotkey="Mod+K" />)).toContain("Ctrl+K");
    render(<Kbd hotkey="Mod+K" />);
    expect(screen.getByText("⌘ K")).toBeTruthy();
  } finally {
    if (originalPlatform) Object.defineProperty(navigator, "platform", originalPlatform);
  }
});
