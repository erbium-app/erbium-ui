import { render, screen } from "@testing-library/react";
import { Badge } from "@erbium/ui/components/badge";

test("renders a loading badge with a single decorative spinner", () => {
  const { container } = render(<Badge loading>Syncing</Badge>);
  const badge = container.querySelector('[data-slot="badge"]');
  expect(badge?.getAttribute("aria-busy")).toBe("true");
  expect(badge?.querySelectorAll('[data-slot="spinner"]')).toHaveLength(1);
  expect(screen.queryByRole("status")).toBeNull();
  expect(badge?.textContent).toBe("Syncing");
});
