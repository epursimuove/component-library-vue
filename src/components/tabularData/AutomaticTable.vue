<script setup lang="ts">
import {
  getPropertyTypesForObject,
  prettifyPropertyName,
} from "@/utils/tabularData.ts";
import {
  computed,
  type ComputedRef,
  onBeforeMount,
  onMounted,
  onUpdated,
  ref,
  type Ref,
  useTemplateRef,
  watch,
} from "vue";
import type {
  Aggregation,
  ColumnConfigurations,
  Pagination,
  PropertyType,
  RowItem,
  Sorting,
} from "@/types/type.ts";
import CellData from "@/components/tabularData/CellData.vue";
import { useSorting } from "@/composables/tabularData/sorting.ts";
import { usePagination } from "@/composables/tabularData/pagination.ts";
import TableToolsBar from "@/components/tabularData/TableToolsBar.vue";
import { useAggregation } from "@/composables/tabularData/aggregation.ts";
import CurrentlyLoading from "@/components/CurrentlyLoading.vue";
import { useColumnCalculations } from "@/composables/tabularData/columnCalculations.ts";
import { firstAndLastInArray } from "@/utils/util.ts";

const props = defineProps<{
  list: RowItem[];
  caption?: string;
}>();

const emit = defineEmits<{
  modifiedColumnConfigurations: [columnConfigurations: ColumnConfigurations];
}>();

console.group(
  `Preparing AutomaticTable component for ${props.list.length} items`,
);

const isLoading: Ref<boolean> = ref(true);

const templateRefNames: {
  rowNumberColumn: string;
  dynamicColumnWidths: string;
} = {
  rowNumberColumn: "row-number-column",
  dynamicColumnWidths: "dynamic-column-widths",
};

const rowNumberColumnWidthRef = useTemplateRef<HTMLTableCellElement>(
  templateRefNames.rowNumberColumn,
);

const dynamicColumnWidthsRefs = useTemplateRef<HTMLTableCellElement[]>(
  templateRefNames.dynamicColumnWidths,
);

// Composables are used for the following:
// - useSorting. DONE
// - useFiltering.
// - useAggregation. DONE
// - usePagination. DONE
// - useColumnCalculations. DONE

const allTheItems: Ref<RowItem[]> = ref(props.list);

const {
  calculateColumnWidthsAndDisplayData,
  isCalculating,
  columnConfigurations,
  calculatedColumnStyleForRowNumberColumn,
  calculatedColumnStyle,
  stickyLeftColumns,
} = useColumnCalculations(
  allTheItems,
  rowNumberColumnWidthRef,
  dynamicColumnWidthsRefs,
);

watch(
  () => props.list,
  (newList, oldList) => {
    console.info(
      `WATCHING: props.list updated from parent: ${oldList.length} => ${newList.length}`,
    );

    isLoading.value = true;
    allTheItems.value = newList;
    calculateColumnWidthsAndDisplayData();
    isLoading.value = false;
  },
);

watch(
  columnConfigurations,
  (
    newConfigurations: ColumnConfigurations,
    oldConfigurations: ColumnConfigurations | undefined,
  ) => {
    console.info(
      `WATCHING: columnConfigurations updated:`,
      Object.keys(oldConfigurations || {}),
      Object.keys(newConfigurations),
    );

    console.log(`Emitting "modifiedColumnConfigurations"`);

    emit("modifiedColumnConfigurations", newConfigurations);
  },
  { immediate: true },
);

const {
  sortedList,
  sortOn,
  currentlySortedOnPropertyName,
  sortOrder,
}: Sorting = useSorting(allTheItems);

const aggregation: Aggregation = useAggregation(allTheItems);

const {
  sum,
  min,
  max,
  mean,
  median,
  currentAggregationType,
  rotateAggregationType,
  displayAllAggregations,
} = aggregation;

const pagination: Pagination = usePagination(sortedList);

const { paginatedList, firstItemOnPage, totalNumberOfItems } = pagination;

const itemsInPage: ComputedRef<RowItem[]> = computed(() => {
  return isCalculating.value ? allTheItems.value : paginatedList.value;
  // return paginatedList.value;
});

onBeforeMount(() => {
  console.info(
    `onBeforeMount for AutomaticTable with ${props.list.length} items`,
  );
});

onMounted(() => {
  console.info(`onMounted for AutomaticTable with ${props.list.length} items`);

  isLoading.value = true;
  calculateColumnWidthsAndDisplayData();
  isLoading.value = false;
});

onUpdated(() => {
  console.info(`onUpdated for AutomaticTable with ${props.list.length} items`);
});

const propertyTypes: ComputedRef<Record<string, PropertyType>> = computed(
  () => {
    // Create the result object from the list props and build it with correct propertyNames.

    return getPropertyTypesForObject(props.list[0]); // TODO BETTER IMPLEMENTATION!!!!! Use more than just the first item?!?
  },
);

const focusedColumnIndex: Ref<number> = ref(-1);

const toggleColumnFocus = (columnIndex: number) => {
  console.log(`Focus on column: ${columnIndex}`);

  if (focusedColumnIndex.value >= 0) {
    focusedColumnIndex.value = -1;
  } else {
    focusedColumnIndex.value = columnIndex;
  }
};

console.info("AutomaticTable up and running");
console.groupEnd();
</script>

<template>
  <CurrentlyLoading :loading="isLoading" />

  <div class="table-caption" v-if="props.caption">
    {{ props.caption }}
  </div>

  <TableToolsBar :pagination="pagination" :aggregation="aggregation" />

  <div class="table-wrapper">
    <table v-if="itemsInPage.length > 0">
      <caption v-if="props.caption">
        {{
          props.caption
        }}
      </caption>

      <thead>
        <tr>
          <th
            class="row-number sticky-left"
            :ref="templateRefNames.rowNumberColumn"
            :class="{ 'sticky-endpoint': stickyLeftColumns.length === 0 }"
            :style="calculatedColumnStyleForRowNumberColumn"
          >
            {{ totalNumberOfItems }}
          </th>

          <th
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
            :ref="templateRefNames.dynamicColumnWidths"
            :data-column-id="propertyName"
            :class="{
              propertyType,
              'sticky-left': sticky !== undefined,
              'sticky-endpoint':
                firstAndLastInArray(stickyLeftColumns).last === propertyName,
            }"
            :style="calculatedColumnStyle[propertyName]"
            @click="sortOn(propertyName)"
          >
            <div>
              <div
                class="sorting-info"
                :class="{
                  'currently-sorted-on':
                    currentlySortedOnPropertyName === propertyName,
                }"
              >
                <div v-if="currentlySortedOnPropertyName !== propertyName">
                  &UpArrowDownArrow;
                </div>

                <template v-else>
                  <div v-if="sortOrder === 'ascending'">&DownArrow;</div>
                  <div v-else>&UpArrow;</div>
                </template>
              </div>

              {{ prettifyPropertyName(propertyName) }}
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(rowItem, index) in itemsInPage" :key="index">
          <td
            class="meta row-number sticky-left"
            :class="{ 'sticky-endpoint': stickyLeftColumns.length === 0 }"
          >
            {{ firstItemOnPage + index }}
          </td>
          <template
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
          >
            <CellData
              :propertyName="propertyName"
              :propertyValue="rowItem[propertyName]"
              :propertyType="propertyTypes[propertyName]"
              :class="{
                'focused-column': focusedColumnIndex === columnIndex,
                'sticky-left': sticky !== undefined,
                'sticky-endpoint':
                  firstAndLastInArray(stickyLeftColumns).last === propertyName,
              }"
              :style="`left: ${sticky?.offsetInPixels}px;`"
              @click.meta="toggleColumnFocus(columnIndex)"
            />
          </template>
        </tr>
      </tbody>

      <!--      <tfoot>-->
      <!--        <tr>-->
      <!--          <th class="aggregation-toggler" @click="rotateAggregationType">-->
      <!--            {{ capitalize(currentAggregationType) }}-->
      <!--          </th>-->
      <!--          <th-->
      <!--            v-for="(propertyValue, propertyName) in itemsInPage[0]"-->
      <!--            :key="propertyName"-->
      <!--            class="decimalNumber"-->
      <!--          >-->
      <!--            <template v-if="currentAggregationType === 'sum'">-->
      <!--              {{ sum[propertyName] }}-->
      <!--            </template>-->
      <!--            <template v-else-if="currentAggregationType === 'min'">-->
      <!--              {{ min[propertyName] }}-->
      <!--            </template>-->
      <!--            <template v-else-if="currentAggregationType === 'max'">-->
      <!--              {{ max[propertyName] }}-->
      <!--            </template>-->
      <!--            <template v-else-if="currentAggregationType === 'mean'">-->
      <!--              {{ mean[propertyName] }}-->
      <!--            </template>-->
      <!--            <template v-else-if="currentAggregationType === 'median'">-->
      <!--              {{ median[propertyName] }}-->
      <!--            </template>-->
      <!--          </th>-->
      <!--        </tr>-->
      <!--      </tfoot>-->

      <tfoot>
        <tr
          v-show="
            currentAggregationType === 'sum' ||
            isCalculating ||
            displayAllAggregations
          "
          :class="{ 'all-aggregation-displayed': displayAllAggregations }"
        >
          <th
            class="aggregation-toggler sticky-left"
            :class="{ 'sticky-endpoint': stickyLeftColumns.length === 0 }"
            @click="rotateAggregationType"
          >
            Sum
          </th>
          <th
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
            class="decimalNumber"
            :class="{
              'sticky-left': sticky !== undefined,
              'sticky-endpoint':
                firstAndLastInArray(stickyLeftColumns).last === propertyName,
            }"
            :style="`left: ${sticky?.offsetInPixels}px;`"
          >
            {{ sum[propertyName] }}
          </th>
        </tr>
        <tr
          v-show="
            currentAggregationType === 'min' ||
            isCalculating ||
            displayAllAggregations
          "
          :class="{ 'all-aggregation-displayed': displayAllAggregations }"
        >
          <th
            class="aggregation-toggler sticky-left"
            @click="rotateAggregationType"
          >
            Min
          </th>
          <th
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
            class="decimalNumber"
            :class="{
              'sticky-left': sticky !== undefined,
              'sticky-endpoint':
                firstAndLastInArray(stickyLeftColumns).last === propertyName,
            }"
            :style="`left: ${sticky?.offsetInPixels}px;`"
          >
            {{ min[propertyName] }}
          </th>
        </tr>
        <tr
          v-show="
            currentAggregationType === 'max' ||
            isCalculating ||
            displayAllAggregations
          "
          :class="{ 'all-aggregation-displayed': displayAllAggregations }"
        >
          <th
            class="aggregation-toggler sticky-left"
            @click="rotateAggregationType"
          >
            Max
          </th>
          <th
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
            class="decimalNumber"
            :class="{
              'sticky-left': sticky !== undefined,
              'sticky-endpoint':
                firstAndLastInArray(stickyLeftColumns).last === propertyName,
            }"
            :style="`left: ${sticky?.offsetInPixels}px;`"
          >
            {{ max[propertyName] }}
          </th>
        </tr>
        <tr
          v-show="
            currentAggregationType === 'mean' ||
            isCalculating ||
            displayAllAggregations
          "
          :class="{ 'all-aggregation-displayed': displayAllAggregations }"
        >
          <th
            class="aggregation-toggler sticky-left"
            @click="rotateAggregationType"
          >
            Mean
          </th>
          <th
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
            class="decimalNumber"
            :class="{
              'sticky-left': sticky !== undefined,
              'sticky-endpoint':
                firstAndLastInArray(stickyLeftColumns).last === propertyName,
            }"
            :style="`left: ${sticky?.offsetInPixels}px;`"
          >
            {{ mean[propertyName] }}
          </th>
        </tr>
        <tr
          v-show="
            currentAggregationType === 'median' ||
            isCalculating ||
            displayAllAggregations
          "
          :class="{ 'all-aggregation-displayed': displayAllAggregations }"
        >
          <th
            class="aggregation-toggler sticky-left"
            @click="rotateAggregationType"
          >
            Median
          </th>
          <th
            v-for="(
              { propertyName, propertyType, sticky }, _propertyName, columnIndex
            ) in columnConfigurations"
            :key="propertyName"
            class="decimalNumber"
            :class="{
              'sticky-left': sticky !== undefined,
              'sticky-endpoint':
                firstAndLastInArray(stickyLeftColumns).last === propertyName,
            }"
            :style="`left: ${sticky?.offsetInPixels}px;`"
          >
            {{ median[propertyName] }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.table-caption {
  font-weight: bold;

  &:before {
    content: "Table ";
    color: rgb(100, 150, 100);
    font-size: 0.7rem;
    font-weight: normal;
    text-transform: uppercase;
  }
}

.table-wrapper {
  overflow-x: auto;
  margin-block: 1rem 3rem; /*TODO Not good solution for the component to have margin?!?*/
}

table {
  border-collapse: separate;
  border-spacing: 0;

  caption {
    display: none;
    /*
    caption-side: top;
    text-align: start;
    font-weight: bold;
    margin-block: 0rem 0.7rem;

    &:before {
      content: "Table: ";
      color: rgb(100, 200, 100);
    }
   */
  }

  th,
  td {
    padding: 0.2rem 1rem;
    white-space: nowrap;

    &.row-number {
      text-align: end;
    }
  }

  thead {
    th {
      cursor: pointer;

      & > div {
        display: flex;
        flex-direction: row;
        gap: 0.3rem;
      }

      .sorting-info {
        width: 1rem;
        color: rgb(180, 180, 180);

        &.currently-sorted-on {
          color: rgb(0, 0, 0);
        }
      }
    }
  }

  tfoot {
    th {
      &.aggregation-toggler {
        cursor: pointer;
      }
    }
  }

  thead,
  tfoot {
    tr {
      background-color: var(--color-background-table-header);
      color: black;

      th {
        &:is(.integer, .decimalNumber, .positiveInteger) {
          text-align: end;
        }

        &.boolean {
          text-align: center;
        }

        &:is(.text, .localDate) {
          text-align: start;
        }
      }
    }
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background-color: rgb(255, 255, 255);
      }

      &:nth-child(even) {
        background-color: rgb(240, 240, 240);
      }

      &:hover {
        /*background-color: rgb(250, 250, 100, 35%);*/
        /*background-color: rgb(255, 255, 0, 35%);*/
        background-color: var(--color-background-table-focus);
      }

      &:hover td.focused-column {
        /*background-color: yellow;*/
        /*background-color: rgb(0, 250, 0, 35%);*/
        /*background-color: rgb(0, 255, 0, 35%);*/
        background-color: var(--color-background-table-extra-focus);
      }

      &:hover td.sticky-left {
        background-color: var(--color-background-table-focus-sticky);
      }

      td {
        vertical-align: baseline;

        &.focused-column {
          /*background-color: rgb(255, 255, 100, 35%);*/
          /*background-color: rgb(255, 255, 0, 35%);*/
          background-color: var(--color-background-table-focus);
        }

        &.meta {
          font-size: 0.8rem;
          color: rgb(150, 150, 150);
        }

        &.text {
          color: black;
          text-align: start;
        }

        &:is(
            .integer,
            .decimalNumber,
            .positiveInteger,
            .percentage,
            .promille
          ) {
          text-align: end;
          font-family: Menlo, "Courier New", monospace;
        }

        &.integer {
          color: forestgreen;
        }

        &.positiveInteger {
          color: firebrick;
        }

        &.decimalNumber {
          color: deeppink;
        }

        &.boolean {
          color: limegreen;
          text-align: center;
        }

        &:is(.localDate, .timestamp) {
          font-family: Menlo, "Courier New", monospace;
          color: green;
          text-align: start;
        }

        &.countryCode {
          font-family: Menlo, "Courier New", monospace;
          color: brown;
          text-align: start;
        }

        &:is(.percentage, .promille) {
          color: darkcyan;
        }

        &.plainObject {
          color: darkkhaki;
        }
      }
    }
  }

  tfoot {
    tr {
      th {
        &:is(.integer, .decimalNumber, .positiveInteger) {
          text-align: end;
          font-family: Menlo, "Courier New", monospace;
        }

        &.aggregation-toggler {
          text-align: start;
        }
      }

      &.all-aggregation-displayed:hover {
        /*background-color: rgb(250, 250, 100, 35%);*/
        /*background-color: rgb(255, 255, 0, 35%);*/
        background-color: var(--color-background-table-focus);
      }
    }
  }

  .sticky-left {
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: inherit;

    &.last-child_NOT_WORKING {
      background-color: lightgreen;
      /*border-inline-end: 5px solid rgb(200, 200, 200);*/
      box-shadow: 1px 0px rgb(200, 200, 200);
    }
    &.sticky-endpoint {
      /*background-color: lightgreen;*/
      /*border-inline-end: 5px solid rgb(200, 200, 200);*/
      box-shadow: 1px 0px rgb(200, 200, 200);
    }
  }
}
</style>
