import * as React from "react";

import { ScrollArea } from "@erbium/ui/components/scroll-area";
import { Separator } from "@erbium/ui/components/separator";

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

const ScrollAreaDemo = () => (
  <ScrollArea className="h-72 w-48 rounded-xl border surface-panel">
    <div className="p-4">
      <h4 className="mb-4 text-subtitle">Tags</h4>
      {tags.map((tag) => (
        <React.Fragment key={tag}>
          <div className="text-caption">{tag}</div>
          <Separator className="my-2" />
        </React.Fragment>
      ))}
    </div>
  </ScrollArea>
);

export default ScrollAreaDemo;
