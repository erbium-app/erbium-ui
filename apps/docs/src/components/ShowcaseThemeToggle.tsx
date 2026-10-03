import { useEffect, useRef, useState } from "react";
import { Button } from "@erbium/ui/components/button";
import { ThemeToggleIcon } from "@erbium/ui/components/stateful-icon";

export default function ShowcaseThemeToggle() {
  const button = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const showcase = button.current?.closest<HTMLElement>("showcase-tabs");
    const content = showcase?.querySelector<HTMLElement>("[data-showcase-content]");
    const sync = () =>
      setTheme(
        content?.dataset.theme === "dark" ||
          (!content?.dataset.theme && document.documentElement.classList.contains("dark"))
          ? "dark"
          : "light",
      );
    sync();
    const observer = new MutationObserver(sync);
    if (content) observer.observe(content, { attributes: true, attributeFilter: ["data-theme"] });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const showcase = button.current?.closest<HTMLElement>("showcase-tabs");
    const content = showcase?.querySelector<HTMLElement>("[data-showcase-content]");
    if (!content) return;
    const next = theme === "dark" ? "light" : "dark";
    content.dataset.theme = next;
    content.classList.toggle("dark", next === "dark");
    content.classList.toggle("light", next === "light");
    setTheme(next);
  };

  return (
    <Button
      ref={button}
      variant="ghost"
      size="icon-xs"
      aria-label={`Use ${theme === "dark" ? "light" : "dark"} theme for this showcase`}
      aria-pressed={theme === "dark"}
      onClick={toggle}
    >
      <ThemeToggleIcon theme={theme} />
    </Button>
  );
}
