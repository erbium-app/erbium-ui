/*
 * Filters in the URL. Each field with a rule gets one search param, named by the field id, so a
 * filtered view is a link that can be shared or bookmarked:
 *
 *   ?status=todo,in-progress&estimate=between.2,8&title=contains.api
 *
 * The codec lives in the @erbium-ui/react filter core and is router agnostic; it is safe to call
 * in a route's `validateSearch` on the server.
 */

export {
  decodeFilterParam,
  encodeFilterParam,
  getColumnFilterFields,
  parseFilterSearch,
  toFilterSearch,
  validateFilterSearch,
} from "@erbium-ui/react/filters/core";

export type {
  FilterSearch,
  FilterSearchColumn,
  FilterSearchFields,
  SearchParams,
} from "@erbium-ui/react/filters/core";
