import { useEffect, useState, useRef, useMemo } from "react";
import type { RefObject } from "react";
import { CatchBoundary } from "@tanstack/react-router";
import { parseStoryMetadata } from "@/content/story-metadata";
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
import { fetchExampleSource } from "@/content/example-source";
import type { DocPage } from "@/content/types";

const PreviewError = () => (
  <Alert variant="error">
    <AlertTitle>Preview could not load.</AlertTitle>
    <AlertDescription>Reload the page to retry.</AlertDescription>
  </Alert>
);

type PreviewModule = Awaited<ReturnType<typeof exampleResource>>;

type Args = NonNullable<ShowcaseStory["args"]>;

const PreviewContent = ({
  name,
  slug,
  args,
  container,
}: {
  name: string;
  slug: string;
  args: Args;
  container: RefObject<HTMLElement | null>;
}) => {
  const [preview, setPreview] = useState<PreviewModule>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const entry = await exampleResource(name, slug);

        if (active) {
          setPreview(entry);
        }
      } catch {
        if (active) {
          setError(true);
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "200px" },
    );

    if (container.current !== null) {
      observer.observe(container.current);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [name, slug, container]);

  let content = <Spinner aria-label="Loading preview" />;

  if (error) {
    content = <PreviewError />;
  } else if (preview !== undefined) {
    const Example = preview.default;
    content = (
      <Example
        key={JSON.stringify(Object.entries(args).filter(([key]) => key.startsWith("default")))}
        {...args}
      />
    );
  }

  return content;
};

const SourceContent = ({ name, slug, active }: { name: string; slug: string; active: boolean }) => {
  const [files, setFiles] = useState<Awaited<ReturnType<typeof fetchExampleSource>>>();
  const [error, setError] = useState(false);
  useEffect(() => {
    let current = true;

    const load = async () => {
      try {
        const result = await fetchExampleSource({ name, slug });

        if (current) {
          setFiles(result);
          setError(false);
        }
      } catch {
        if (current) {
          setError(true);
        }
      }
    };

    if (active && files === undefined) {
      void load();
    }

    return () => {
      current = false;
    };
  }, [active, files, name, slug]);

  if (error) {
    return (
      <Alert variant="error">
        <AlertTitle>Source could not load.</AlertTitle>
        <AlertDescription>Switch back to Preview and retry.</AlertDescription>
      </Alert>
    );
  }

  if (files === undefined) {
    return (
      <CodePanel>
        <CodePanelContent loading aria-label="Loading source" className="min-h-64" />
      </CodePanel>
    );
  }

  return (
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
  );
};

export const Showcase = ({
  name,
  variant,
  separator = true,
}: {
  name: string;
  variant: DocPage["variants"][number];
  separator?: boolean;
}) => {
  const container = useRef<HTMLElement>(null);
  const story = useMemo(() => parseStoryMetadata(variant), [variant]);
  const [args, setArgs] = useState<Args>(story.args);
  const [code, setCode] = useState(false);
  const siteDark = useTheme();
  const [appearance, setAppearance] = useState<"light" | "dark">();
  const dark = appearance === undefined ? siteDark : appearance === "dark";
  const [revision, setRevision] = useState(0);
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
          <SourceContent name={name} slug={variant.slug} active={code} />
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
            <CatchBoundary getResetKey={() => revision} errorComponent={PreviewError}>
              <ShowcaseProviders>
                <ShowcaseSurface>
                  <PreviewContent
                    key={revision}
                    name={name}
                    slug={variant.slug}
                    args={args}
                    container={container}
                  />
                </ShowcaseSurface>
              </ShowcaseProviders>
            </CatchBoundary>
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
};

export const ShowcaseToaster = () => (
  <ShowcaseProviders>
    <Toaster />
  </ShowcaseProviders>
);
