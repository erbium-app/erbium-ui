import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";

import {
  ExpandableChevron as ExpandableChevronIcon,
  SidebarToggleIcon as SidebarToggleIconGraphic,
  ThemeToggleIcon as ThemeToggleIconGraphic,
} from "@erbium/ui/components/stateful-icon";

import { useState } from "react";

export function ExpandableChevronExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible className="w-72" open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center rounded-lg border px-3 py-2 text-start">
        Project details
        <ExpandableChevronIcon className="ms-auto" isOpen={isOpen} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 py-2 text-caption text-muted-foreground">
        The two chevrons exchange positions as this section opens and closes.
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SidebarToggleIconExample({ side }: { side: "left" | "right" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      aria-expanded={isOpen}
      aria-label={`${isOpen ? "Close" : "Open"} ${side} sidebar`}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-caption"
      onClick={() => setIsOpen((open) => !open)}
      type="button"
    >
      <SidebarToggleIconGraphic isOpen={isOpen} side={side} />
      {side === "left" ? "Left" : "Right"} sidebar
    </button>
  );
}

export function ThemeToggleIconExample() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <button
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-caption"
      onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
      type="button"
    >
      <ThemeToggleIconGraphic theme={theme} />
      {theme === "light" ? "Light" : "Dark"} theme
    </button>
  );
}
