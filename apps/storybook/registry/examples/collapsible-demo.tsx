// @ts-nocheck
import * as React from "react";
import { ChevronRightIcon, FileTextIcon, FolderIcon } from "lucide-react";
import { Card } from "../components/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/collapsible";
import { Separator } from "../components/separator";

const files = ["README.md", "package.json", "tsconfig.json"];

export default function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="w-[350px] gap-0 p-0" size="sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="group/files flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-ring/40">
          <FolderIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">Project files</span>
            <span className="block text-xs text-muted-foreground">3 files in this workspace</span>
          </span>
          <ChevronRightIcon
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-panel-open/files:rotate-90 motion-reduce:transition-none"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="space-y-1 px-3 pt-2 pb-3">
            {files.map((file) => (
              <div key={file} className="flex items-center gap-2 py-1 text-sm">
                <FileTextIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                {file}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
