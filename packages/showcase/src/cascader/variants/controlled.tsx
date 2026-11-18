import * as React from "react";

import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";

import { regions } from "../examples/cascader-data";

export default function CascaderControlledExample() {
  const [value, setValue] = React.useState<string | null>(null);
  const [path, setPath] = React.useState<string[]>([]);

  return (
    <div className="flex w-72 flex-col gap-related">
      <Cascader
        searchable
        items={regions}
        value={value}
        onValueChange={(next, details) => {
          setValue(next);
          setPath(details.path.map((node) => node.label));
        }}
      >
        <CascaderTrigger aria-label="City" className="w-full">
          <CascaderValue placeholder="Choose a city" />
        </CascaderTrigger>
        <CascaderContent>
          <CascaderSearch placeholder="Search places…" />
          <CascaderEmpty>No places found.</CascaderEmpty>
          <CascaderList />
        </CascaderContent>
      </Cascader>
      <output className="text-caption text-muted-foreground">
        {value === null ? "No city selected." : `value="${value}" · ${path.join(" › ")}`}
      </output>
    </div>
  );
}
