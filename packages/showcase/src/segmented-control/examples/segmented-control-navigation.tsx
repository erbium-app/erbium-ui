import { useState } from "react";
import { SegmentedControl, SegmentedControlItem } from "@erbium/ui/components/segmented-control";

const sections = [
  { href: "#overview", label: "Overview" },
  { href: "#activity", label: "Activity" },
  { href: "#settings", label: "Settings" },
];

export default function SegmentedControlNavigationExample() {
  // A router would derive the current link from the location instead.
  const [current, setCurrent] = useState("#overview");

  return (
    <SegmentedControl aria-label="Project sections" render={<nav />}>
      {sections.map((section) => (
        <SegmentedControlItem
          key={section.href}
          render={
            <a
              href={section.href}
              aria-current={section.href === current ? "page" : undefined}
              onClick={() => {
                setCurrent(section.href);
              }}
            >
              {section.label}
            </a>
          }
        />
      ))}
    </SegmentedControl>
  );
}
