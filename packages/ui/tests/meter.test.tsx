import { render, screen } from "@testing-library/react";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@erbium/ui/components/meter";

test("exposes the value and range to assistive tech, named by its label", () => {
  render(
    <Meter value={24} min={0} max={50}>
      <MeterLabel>Storage used</MeterLabel>
      <MeterValue />
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>,
  );

  const meter = screen.getByRole("meter", { name: "Storage used" });
  expect(meter.getAttribute("aria-valuenow")).toBe("24");
  expect(meter.getAttribute("aria-valuemin")).toBe("0");
  expect(meter.getAttribute("aria-valuemax")).toBe("50");
});

test("renders a track and indicator when it has no children", () => {
  const { container } = render(<Meter value={30} aria-label="Battery" />);

  expect(container.querySelector('[data-slot="meter-track"]')).toBeTruthy();
  const indicator = container.querySelector<HTMLElement>('[data-slot="meter-indicator"]');
  expect(indicator?.style.width).toBe("30%");
});
