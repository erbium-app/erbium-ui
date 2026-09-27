import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { useEffect, useState } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";

function ThemeAwareDocsContainer({
  context,
  children,
}: React.PropsWithChildren<DocsContainerProps>) {
  const [isDark, setIsDark] = useState(
    () => context.getStoryContext(context.componentStories()[0]).globals.theme === "dark",
  );

  useEffect(() => {
    const onGlobalsUpdated = ({ globals }: { globals: { theme?: string } }) => {
      setIsDark(globals.theme === "dark");
    };

    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    return () => context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
  }, [context.channel]);

  return (
    <DocsContainer context={context} theme={isDark ? themes.dark : themes.light}>
      {children}
    </DocsContainer>
  );
}

export { ThemeAwareDocsContainer };
