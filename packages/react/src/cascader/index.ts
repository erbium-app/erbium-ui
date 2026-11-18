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
  Trigger: CascaderTrigger,
  Value: CascaderValue,
};

export { Cascader };

export { useCascader } from "./parts";

export {
  countSelectedBelow,
  createCascaderIndex,
  getLevelOf,
  getLevelRows,
  getPathTo,
} from "./tree";

export type {
  CascaderActions,
  CascaderLevelChangeDetails,
  CascaderLevelChangeReason,
  CascaderState,
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
  UseCascaderReturnValue,
} from "./parts";

export type { CascaderRootMultipleProps, CascaderRootProps, CascaderRootSingleProps } from "./root";

export type { CascaderIndex, CascaderMatch, CascaderNode, CascaderRow } from "./tree";
