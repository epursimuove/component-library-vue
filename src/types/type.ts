// The types returned from typeof.
import type { ComputedRef, Ref } from "vue";

export type AutomaticPropertyType =
  | "undefined"
  | "object"
  | "boolean"
  | "number"
  | "string"
  | "function"
  | "symbol"
  | "bigint";

export type PropertyType =
  | "text"
  | "decimalNumber"
  | "integer"
  | "positiveInteger" // Zeroes will not be displayed. TODO "count" or "amount" instead??
  | "boolean"
  | "localDate"
  | "localTime"
  | "localDateTime"
  | "timestamp"
  | "countryFlag"
  | "link";

export type PropertyValue = string | number | boolean | null | undefined;

export type FilterType = "text" | "enumeratedText" | "boolean" | "number";

export type RowItem = Record<string, PropertyValue>;

export type ColumnConfiguration = {
  label: string;
  propertyName: string;
  propertyType: PropertyType;
  width?: string;
};

export type SortOrder = "ascending" | "descending";

export type ColumnCalculations = {
  // templateRefNames: { rowNumberColumn: string; dynamicColumnWidths: string };
  isCalculating: Ref<boolean, boolean>;
  calculateColumnWidthsAndDisplayData: () => Promise<void>;
  // calculatedColumnWidthInPixelsForRowNumberColumn: Ref<
  //   number | undefined,
  //   number | undefined
  // >;
  // calculatedColumnWidthsInPixels: Ref<number[], number[]>;
  calculatedColumnStyleForRowNumberColumn: Ref<string>;
  calculatedColumnStyle: Ref<string[]>;
  columnConfigurations: ComputedRef<ColumnConfiguration[]>;
};

export type Sorting = {
  sortedList: Ref<RowItem[], RowItem[]>;
  sortOn: (propertyName: string) => void;
  currentlySortedOnPropertyName: Ref<string, string>;
  sortOrder: Ref<SortOrder, SortOrder>;
};

export type Aggregation = {
  // TODO Must it be Refs?!?
  sum: Ref<Record<string, number>>;
  min: Ref<Record<string, number>>;
  max: Ref<Record<string, number>>;
  mean: Ref<Record<string, number>>;
  median: Ref<Record<string, number>>;
  currentAggregationType: Ref<AggregationType>;
  rotateAggregationType: () => void;
};

export type Pagination = {
  paginatedList: Ref<RowItem[], RowItem[]>;
  rowsPerPage: Ref<number, number>;
  currentPage: Ref<number, number>;
  totalNumberOfItems: ComputedRef<number>;
  totalNumberOfPages: ComputedRef<number>;
  firstItemOnPage: ComputedRef<number>;
  lastItemOnPage: ComputedRef<number>;
  gotoFirstPage: () => void;
  gotoPreviousPage: () => void;
  gotoNextPage: () => void;
  gotoLastPage: () => void;
};

export type AggregationType = "sum" | "min" | "max" | "mean" | "median";
