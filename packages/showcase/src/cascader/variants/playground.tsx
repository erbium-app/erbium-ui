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

export const defaultProps = {
  disabled: false,
  multiple: false,
  searchable: true,
  size: "default",
} satisfies {
  disabled: boolean;
  multiple: boolean;
  searchable: boolean;
  size: "sm" | "default";
};

export default function CascaderPlaygroundExample(
  args: {
    disabled: boolean;
    multiple: boolean;
    searchable: boolean;
    size: "sm" | "default";
  } = defaultProps,
) {
  const content = (
    <CascaderContent>
      {args.searchable ? (
        <>
          <CascaderSearch placeholder="Search places…" />
          <CascaderEmpty>No places found.</CascaderEmpty>
        </>
      ) : null}
      <CascaderList />
    </CascaderContent>
  );

  const trigger = (
    <CascaderTrigger aria-label="City" size={args.size} className="w-72">
      <CascaderValue placeholder={args.multiple ? "Choose cities" : "Choose a city"} />
    </CascaderTrigger>
  );

  // Remount when the mode or search changes so each starts from an empty value and fresh levels.
  return args.multiple ? (
    <Cascader
      key={`multiple-${String(args.searchable)}`}
      multiple
      items={regions}
      searchable={args.searchable}
      disabled={args.disabled}
    >
      {trigger}
      {content}
    </Cascader>
  ) : (
    <Cascader
      key={`single-${String(args.searchable)}`}
      items={regions}
      searchable={args.searchable}
      disabled={args.disabled}
    >
      {trigger}
      {content}
    </Cascader>
  );
}
