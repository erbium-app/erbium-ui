import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import { RotatingChevron } from "@erbium/ui/components/stateful-icon";
import { Card } from "@erbium/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { Separator } from "@erbium/ui/components/separator";

const files = ["README.md", "package.json", "tsconfig.json"];

export default function CollapsibleExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="w-[350px] gap-0 p-0" size="sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="group group/files flex w-full items-center gap-related rounded-xl px-3 py-2 text-start outline-none hover:bg-accent data-panel-open:rounded-b-none [&:has(+_[data-slot=collapsible-content]:not([hidden]))]:rounded-b-none focus-visible:ring-2 focus-visible:ring-focus-halo">
          <Icon
            name="folder-01"
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-caption font-medium">Project files</span>
            <span className="block text-metadata text-muted-foreground">
              3 files in this workspace
            </span>
          </span>
          <RotatingChevron scope="collapsible" className="size-4 shrink-0 text-muted-foreground" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Separator />
          <div className="space-y-1 px-3 pt-2 pb-3">
            {files.map((file) => (
              <div key={file} className="flex items-center gap-related py-1 text-caption">
                <Icon
                  name="file-text"
                  aria-hidden="true"
                  className="size-4 text-muted-foreground"
                />
                {file}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
