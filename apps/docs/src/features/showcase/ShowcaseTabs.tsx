import { useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export default function ShowcaseTabs({ id, title }: { id: string; title: string }) {
  const container = useRef<HTMLDivElement>(null);
  return (
    <Tabs
      ref={container}
      defaultValue="preview"
      onValueChange={(value) => {
        container.current
          ?.closest("showcase-tabs")
          ?.dispatchEvent(new CustomEvent("showcase-tab-change", { detail: { value } }));
      }}
    >
      <TabsList aria-label={`${title} example`}>
        <TabsTrigger id={`${id}-preview-tab`} value="preview" aria-controls={`${id}-preview`}>
          Preview
        </TabsTrigger>
        <TabsTrigger id={`${id}-code-tab`} value="code" aria-controls={`${id}-code`}>
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
