import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";
import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";

import { regions } from "./cascader-data";

export default function CascaderExample() {
  return (
    <Field className="w-72">
      <FieldLabel htmlFor="cascader-demo">Office</FieldLabel>
      <Cascader searchable items={regions} defaultValue="tokyo">
        <CascaderTrigger id="cascader-demo" className="w-full">
          <CascaderValue placeholder="Choose a city" />
        </CascaderTrigger>
        <CascaderContent>
          <CascaderSearch placeholder="Search places…" />
          <CascaderEmpty>No places found.</CascaderEmpty>
          <CascaderList />
        </CascaderContent>
      </Cascader>
      <FieldDescription>Open a continent, then a country, then pick a city.</FieldDescription>
    </Field>
  );
}
