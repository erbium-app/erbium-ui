import { Menu } from "@base-ui/react/menu";
import {
  CascaderBack,
  CascaderBackItem,
  CascaderClear,
  CascaderEmpty,
  CascaderItem,
  CascaderItemCount,
  CascaderItemIndicator,
  CascaderItemTrail,
  CascaderLevel,
  CascaderLevelLabel,
  CascaderList,
  CascaderRows,
  CascaderSearch,
  CascaderSearchClear,
  CascaderSearchGroup,
  CascaderTrigger,
  CascaderValue,
} from "./parts";
import { CascaderRoot } from "./root";

/** A select whose options form a tree, one level at a time inside one popup. */
const Cascader = {
  Arrow: Menu.Arrow,
  Back: CascaderBack,
  BackItem: CascaderBackItem,
  Backdrop: Menu.Backdrop,
  Clear: CascaderClear,
  Empty: CascaderEmpty,
  Item: CascaderItem,
  ItemCount: CascaderItemCount,
  ItemIndicator: CascaderItemIndicator,
  ItemTrail: CascaderItemTrail,
  Level: CascaderLevel,
  LevelLabel: CascaderLevelLabel,
  List: CascaderList,
  Popup: Menu.Popup,
  Portal: Menu.Portal,
  Positioner: Menu.Positioner,
  Root: CascaderRoot,
  Rows: CascaderRows,
  Search: CascaderSearch,
  SearchClear: CascaderSearchClear,
  SearchGroup: CascaderSearchGroup,
  Trigger: CascaderTrigger,
  Value: CascaderValue,
};

export { Cascader };

export type {
  CascaderLevelChangeDetails,
  CascaderLevelChangeReason,
  CascaderValueChangeDetails,
  CascaderValueChangeReason,
} from "./context";

export type {
  CascaderBackProps,
  CascaderItemCountProps,
  CascaderItemCountState,
  CascaderItemProps,
  CascaderItemState,
  CascaderItemTrailProps,
  CascaderRowsProps,
  CascaderSearchProps,
  CascaderValueProps,
  CascaderValueState,
} from "./parts";

export type { CascaderRootMultipleProps, CascaderRootProps, CascaderRootSingleProps } from "./root";

export type { CascaderNode, CascaderRow } from "./tree";
