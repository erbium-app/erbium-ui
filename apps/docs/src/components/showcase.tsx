import { Component, useEffect, useState, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { ShowcaseProviders, ShowcaseSurface } from "@erbium/showcase/preview";
import { Button } from "@erbium/ui/components/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@erbium/ui/components/collapsible";
import { CodeBlock as UICodeBlock } from "@erbium/ui/blocks/code-block";
import { CodePanel, CodePanelContent, codePanelSurface } from "@erbium/ui/blocks/code-panel";
import { Alert, AlertTitle, AlertDescription } from "@erbium/ui/components/alert";
import { Spinner } from "@erbium/ui/components/spinner";
import { Toaster } from "@erbium/ui/components/toast";
import { Prose } from "./markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@erbium/ui/components/tabs";
import { Separator } from "@erbium/ui/components/separator";
import { ThemeToggleIcon, RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { changeTheme } from "@erbium/ui/lib/change-theme";
import { flushSync } from "react-dom";
import { useTheme } from "./theme";
import { Controls } from "./controls";
import { exampleResource } from "./preview-resources";
import { loadExampleSource } from "@/content/load";
import type { DocPage } from "@/content/pages.server";

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <Alert variant="error">
        <AlertTitle>Preview could not load.</AlertTitle>
        <AlertDescription>Reload the page to retry.</AlertDescription>
      </Alert>
    ) : (
      this.props.children
    );
  }
}

export function Showcase({
  name,
  variant,
  separator = true,
}: {
  name: string;
  variant: DocPage["variants"][number];
  separator?: boolean;
}) {
  const container = useRef<HTMLElement>(null);

  const story = useMemo(
    () => ({
      argTypes: JSON.parse(variant.argTypes) as ShowcaseStory["argTypes"],
      args: JSON.parse(variant.args) as Record<string, unknown>,
    }),
    [variant.args, variant.argTypes],
  );

  const [Example, setExample] = useState<ShowcaseStory["render"]>();
  const [error, setError] = useState(false);
  const [args, setArgs] = useState<Record<string, unknown>>(story.args);
  const [code, setCode] = useState(false);
  const [files, setFiles] = useState<{ path: string; source: string }[]>();
  const [sourceError, setSourceError] = useState(false);
  const siteDark = useTheme();
  const [appearance, setAppearance] = useState<"light" | "dark">();
  const dark = appearance ? appearance === "dark" : siteDark;
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const entry = await exampleResource(name, variant.slug);

        if (active) {
          setExample(() => entry.default);
        }
      } catch {
        if (active) {
          setError(true);
        }
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "200px" },
    );

    if (container.current) {
      observer.observe(container.current);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [name, variant.slug]);
  useEffect(() => {
    if (!code || files) {
      return;
    }

    let active = true;

    async function load() {
      try {
        const result = await loadExampleSource({ data: { name, slug: variant.slug } });

        if (active) {
          setFiles(result);
          setSourceError(false);
        }
      } catch {
        if (active) {
          setSourceError(true);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [code, files, name, variant.slug]);
  const command = `npx shadcn@latest add @erbium-examples/${name}-${variant.slug}`;

  return (
    <section ref={container} id={variant.anchor} className="demo-section my-10 scroll-mt-8">
      {separator && <Separator className="mb-4" variant="full" role="presentation" />}
      <h2 className="text-title font-semibold">{variant.title}</h2>
      <Prose tree={variant.tree} />
      <Tabs
        value={code ? "code" : "preview"}
        onValueChange={(value) => {
          setCode(value === "code");
        }}
        className="mt-4"
      >
        <TabsList aria-label={`${variant.title} example`}>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="code" keepMounted>
          {sourceError ? (
            <Alert variant="error">
              <AlertTitle>Source could not load.</AlertTitle>
              <AlertDescription>Switch back to Preview and retry.</AlertDescription>
            </Alert>
          ) : files ? (
            <div className="flex flex-col gap-related">
              {files.map((file) => (
                <UICodeBlock
                  key={file.path}
                  code={file.source}
                  language={file.path.split(".").at(-1)}
                  title={file.path}
                />
              ))}
            </div>
          ) : (
            <CodePanel>
              <CodePanelContent loading aria-label="Loading source" className="min-h-64" />
            </CodePanel>
          )}
        </TabsContent>
        <TabsContent value="preview" keepMounted>
          <div className={`showcase-content relative ${codePanelSurface} ${appearance ?? ""}`}>
            <div className="absolute top-2 end-2 z-1 rounded-md bg-surface-panel">
              <Button
                variant="ghost"
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
              </Button>
            </div>
            <PreviewBoundary key={revision}>
              <ShowcaseProviders>
                <ShowcaseSurface>
                  {error ? (
                    <Alert variant="error">
                      <AlertTitle>Preview could not load.</AlertTitle>
                    </Alert>
                  ) : Example ? (
                    <Example
                      key={JSON.stringify(
                        Object.entries(args).filter(([key]) => key.startsWith("default")),
                      )}
                      {...args}
                    />
                  ) : (
                    <Spinner aria-label="Loading preview" />
                  )}
                </ShowcaseSurface>
              </ShowcaseProviders>
            </PreviewBoundary>
          </div>
        </TabsContent>
      </Tabs>
      <Controls
        key={revision}
        args={args}
        defaults={story.args}
        argTypes={story.argTypes}
        onChange={setArgs}
        onReset={() => {
          setArgs(story.args);
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
}

export function ShowcaseToaster() {
  return (
    <ShowcaseProviders>
      <Toaster />
    </ShowcaseProviders>
  );
}
