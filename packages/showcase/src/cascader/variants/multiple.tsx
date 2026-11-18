import * as React from "react";

import {
  Cascader,
  CascaderClear,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";

import { permissions } from "../examples/cascader-permissions";

export default function CascaderMultipleExample() {
  const [value, setValue] = React.useState<string[]>(["members.view", "projects.view"]);

  return (
    <div className="flex w-72 flex-col gap-related">
      <Cascader multiple searchable items={permissions} value={value} onValueChange={setValue}>
        <CascaderTrigger aria-label="Permissions" className="w-full">
          <CascaderValue placeholder="Select permissions" />
        </CascaderTrigger>
        <CascaderContent>
          <CascaderSearch />
          <CascaderEmpty>No permissions found.</CascaderEmpty>
          <CascaderList />
          <CascaderClear />
        </CascaderContent>
      </Cascader>
      <output className="text-caption text-muted-foreground">
        {value.length === 0 ? "No permissions." : value.join(", ")}
      </output>
    </div>
  );
}
