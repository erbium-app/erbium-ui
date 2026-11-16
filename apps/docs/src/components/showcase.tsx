import { use, useState, Suspense } from "react";
import { CatchBoundary } from "@tanstack/react-router";
import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { Button } from "@erbium/ui/components/button";
import { Toolbar, ToolbarButton } from "@erbium/ui/components/toolbar";
import { Icon } from "@erbium/ui/components/icon";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@erbium/ui/components/collapsible";
import { CodeBlock as UICodeBlock } from "@erbium/ui/blocks/code-block";
import { codePanelSurface } from "@erbium/ui/blocks/code-panel";
import { Alert, AlertTitle, AlertDescription } from "@erbium/ui/components/alert";
import { Toaster } from "@erbium/ui/components/toast";
import { Prose } from "./markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@erbium/ui/components/tabs";
import { Separator } from "@erbium/ui/components/separator";
import { ThemeToggleIcon, RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { changeTheme } from "@erbium/ui/lib/change-theme";
import { flushSync } from "react-dom";
import { useTheme } from "./theme";

import { Controls } from "./controls";
import { exampleRequest } from "./preview-resources";
import type { DocPage } from "@/content/types";

const PreviewError = () => (
  <Alert variant="error">
    <AlertTitle>Preview could not load.</AlertTitle>
    <AlertDescription>Refresh the showcase to retry.</AlertDescription>
  </Alert>
);

type Args = NonNullable<ShowcaseStory["args"]>;

// Shown only on client navigation before an example chunk arrives. The surface keeps
// its minimum height, so the example replaces this without shifting the page.
const PreviewLoading = () => <output aria-label="Loading preview" className="sr-only" />;

const PreviewContent = ({ name, slug, args }: { name: string; slug: string; args: Args }) => {
  const { default: Example } = use(exampleRequest(name, slug));

  return (
    <Example
      key={JSON.stringify(Object.entries(args).filter(([key]) => key.startsWith("default")))}
      {...args}
    />
  );
};

// The source ships with the page, so the lines show at once and highlighting lands in place.
const SourceContent = ({
  files,
  sources,
}: {
  files: string[];
  sources: Record<string, string>;
}) => (
  <div className="flex flex-col gap-related">
    {files.map((path) => (
      <UICodeBlock
        key={path}
        code={sources[path] ?? ""}
        language={path.split(".").at(-1)}
        title={path}
      />
    ))}
  </div>
);

export const Showcase = ({
  name,
  variant,
  sources,
  separator = true,
}: {
  name: string;
  variant: DocPage["variants"][number];
  sources: DocPage["exampleSources"];
  separator?: boolean;
}) => {
  const [args, setArgs] = useState<Args>(variant.args);
  const [code, setCode] = useState(false);
  // Source mounts, and so highlights, on first view, then stays mounted with the hidden tab.
  const [sourceShown, setSourceShown] = useState(false);
  const siteDark = useTheme();
  const [appearance, setAppearance] = useState<"light" | "dark">();
  const dark = appearance === undefined ? siteDark : appearance === "dark";
  const [revision, setRevision] = useState(0);
  // Refresh remounts the example and its providers so first-mount behaviour
  // (skeleton reveals, entrance motion, effects) plays again with the current args.
  const [mount, setMount] = useState(0);

  const command = `npx shadcn@latest add @erbium-examples/${name}-${variant.slug}`;

  return (
    <section id={variant.anchor} className="demo-section my-10 scroll-mt-8">
      {separator && <Separator className="mb-4" variant="full" role="presentation" />}
      <h2 className="text-title font-semibold">{variant.title}</h2>
      <Prose tree={variant.tree} />
      <Tabs
        value={code ? "code" : "preview"}
        onValueChange={(value) => {
          setCode(value === "code");

          if (value === "code") {
            setSourceShown(true);
          }
        }}
        className="mt-4"
      >
        <TabsList aria-label={`${variant.title} example`}>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="code" keepMounted>
          {sourceShown && <SourceContent files={variant.files} sources={sources} />}
        </TabsContent>
        <TabsContent value="preview" keepMounted>
          <div className={`showcase-content relative ${codePanelSurface} ${appearance ?? ""}`}>
            <Toolbar aria-label="Showcase controls" className="absolute top-2 end-2 z-1 gap-0.5">
              <ToolbarButton
                size="icon-xs"
                aria-label="Refresh this showcase"
                onClick={() => {
                  setMount((value) => value + 1);
                }}
              >
                <Icon name="refresh-cw" className="size-4" />
              </ToolbarButton>
              <ToolbarButton
                size="icon-xs"
                aria-label={
                  dark ? "Use light theme for this showcase" : "Use dark theme for this showcase"
                }
                onClick={() => {
                  changeTheme(() => {
                    flushSync(() => {
                      setAppearance(dark ? "light" : "dark");
                    });
                  });
                }}
              >
                <ThemeToggleIcon theme={dark ? "dark" : "light"} />
              </ToolbarButton>
            </Toolbar>
            <CatchBoundary getResetKey={() => `${revision}:${mount}`} errorComponent={PreviewError}>
              <ShowcaseProviders key={mount}>
                <ShowcaseSurface>
                  <Suspense fallback={<PreviewLoading />}>
                    <PreviewContent key={revision} name={name} slug={variant.slug} args={args} />
                  </Suspense>
                </ShowcaseSurface>
              </ShowcaseProviders>
            </CatchBoundary>
          </div>
        </TabsContent>
      </Tabs>
      <Controls
        key={revision}
        args={args}
        defaults={variant.args}
        argTypes={variant.argTypes}
        onChange={setArgs}
        onReset={() => {
          setArgs(variant.args);
          setRevision((value) => value + 1);
        }}
      />
      <Collapsible className="mt-3">
        <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
          <RotatingChevron scope="collapsible" className="size-4" />
          Install this example
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-2">
            <UICodeBlock code={command} language="bash" surface="command" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export const ShowcaseToaster = () => (
  <ShowcaseProviders>
    <Toaster />
  </ShowcaseProviders>
);
