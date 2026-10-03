import { HugeiconsIcon } from "@hugeicons/react";
import AppWindowIcon from "@hugeicons/core-free-icons/AppWindowIcon";
import CodeIcon from "@hugeicons/core-free-icons/CodeIcon";

import { Tabs, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";

export function TabsIcons() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <HugeiconsIcon icon={AppWindowIcon} />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <HugeiconsIcon icon={CodeIcon} />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
