import { useState } from "react";
import { Button } from "@erbium/ui/components/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@erbium/ui/components/collapsible";
import { CodeBlock as UICodeBlock } from "@erbium/ui/blocks/code-block";
import { Prose } from "./markdown";
import { PackageCommand } from "./package-command";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@erbium/ui/components/tabs";
import { Separator } from "@erbium/ui/components/separator";
import { RotatingChevron } from "@erbium/ui/components/stateful-icon";

import { Controls } from "./controls";
import { ShowcaseFrame, useShowcaseState } from "./showcase-frame";
import type { Variant } from "./showcase-frame";
import { ShowcaseFullScreenTrigger } from "./showcase-gallery";
import type { DocPage } from "@/content/types";

// The source ships with the page, so the lines show at once and highlighting lands in place.
const SourceContent = ({
  files,
  sources,
}: {
  files: string[];
  sources: Record<string, string>;
}) => {
  const items = files.map((path) => ({
    value: path,
    label: path.replace(/^src\//u, ""),
    code: sources[path],
    language: path.split(".").at(-1),
  }));

  const [first] = items;

  if (items.length === 1 && first !== undefined) {
    return (
      <UICodeBlock
        wrap
        code={first.code}
        language={first.language}
        title={first.label.split("/").at(-1)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-related">
      <UICodeBlock wrap items={items} />
      <p className="text-caption text-muted-foreground">
        Keep these files in the same relative locations when copying the example.
      </p>
    </div>
  );
};

export const Showcase = ({
  path,
  variant,
  sources,
  separator = true,
}: {
  /** The page path, which keys the page's examples. */
  path: string;
  variant: Variant;
  sources: DocPage["exampleSources"];
  separator?: boolean;
}) => {
  const [{ args, mount }, update] = useShowcaseState(variant);
  // Source mounts, and so highlights, on first view, then stays mounted with the hidden tab.
  const [sourceShown, setSourceShown] = useState(false);

  const command = `bunx shadcn@latest add @erbium-examples/${variant.name}-${variant.slug}`;

  return (
    <section id={variant.anchor} className="demo-section my-10 scroll-mt-8">
      {separator && <Separator className="mb-4" variant="full" role="presentation" />}
      <h2 className="text-title font-semibold">{variant.title}</h2>
      <Prose tree={variant.tree} />
      <Tabs
        defaultValue="preview"
        onValueChange={(value) => {
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
          <ShowcaseFrame
            path={path}
            variant={variant}
            actions={<ShowcaseFullScreenTrigger itemId={variant.anchor} />}
          />
        </TabsContent>
      </Tabs>
      <Controls
        key={mount}
        args={args}
        defaults={variant.args}
        argTypes={variant.argTypes}
        onChange={(next) => {
          update((state) => ({ ...state, args: next }));
        }}
        onReset={() => {
          update((state) => ({ ...state, args: variant.args, mount: state.mount + 1 }));
        }}
      />
      <Collapsible className="mt-3">
        <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
          <RotatingChevron className="size-4" />
          Install this example
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="pt-2">
            <PackageCommand code={command} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};
