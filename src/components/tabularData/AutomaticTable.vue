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

const props = defineProps<{
  list: RowItem[];
  caption?: string;
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

const {
  sortedList,
  sortOn,
  currentlySortedOnPropertyName,
  sortOrder,
}: Sorting = useSorting(allTheItems);

const {
  sum,
  min,
  max,
  mean,
  median,
  currentAggregationType,
  rotateAggregationType,
} = useAggregation(allTheItems);

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

  <TableToolsBar :pagination="pagination" />

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
            class="row-number"
            :ref="templateRefNames.rowNumberColumn"
            :style="calculatedColumnStyleForRowNumberColumn"
          >
            {{ totalNumberOfItems }}
          </th>
          <th
            v-for="(
              { propertyName, propertyType }, index
            ) in columnConfigurations"
            :key="propertyName"
            :ref="templateRefNames.dynamicColumnWidths"
            :data-column-id="propertyName"
            :class="propertyType"
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
          <td class="meta row-number">
            {{ firstItemOnPage + index }}
          </td>
          <template
            v-for="(propertyValue, propertyName, columnIndex) in rowItem"
            :key="propertyName"
          >
            <CellData
              :propertyName="propertyName"
              :propertyValue="propertyValue"
              :propertyType="propertyTypes[propertyName]"
              :class="{ 'focused-column': focusedColumnIndex === columnIndex }"
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
        <tr v-show="currentAggregationType === 'sum' || isCalculating || false">
          <th class="aggregation-toggler" @click="rotateAggregationType">
            Sum
          </th>
          <th
            v-for="(propertyValue, propertyName) in itemsInPage[0]"
            :key="propertyName"
            class="decimalNumber"
          >
            {{ sum[propertyName] }}
          </th>
        </tr>
        <tr v-show="currentAggregationType === 'min' || isCalculating || false">
          <th class="aggregation-toggler" @click="rotateAggregationType">
            Min
          </th>
          <th
            v-for="(propertyValue, propertyName) in itemsInPage[0]"
            :key="propertyName"
            class="decimalNumber"
          >
            {{ min[propertyName] }}
          </th>
        </tr>
        <tr v-show="currentAggregationType === 'max' || isCalculating || false">
          <th class="aggregation-toggler" @click="rotateAggregationType">
            Max
          </th>
          <th
            v-for="(propertyValue, propertyName) in itemsInPage[0]"
            :key="propertyName"
            class="decimalNumber"
          >
            {{ max[propertyName] }}
          </th>
        </tr>
        <tr
          v-show="currentAggregationType === 'mean' || isCalculating || false"
        >
          <th class="aggregation-toggler" @click="rotateAggregationType">
            Mean
          </th>
          <th
            v-for="(propertyValue, propertyName) in itemsInPage[0]"
            :key="propertyName"
            class="decimalNumber"
          >
            {{ mean[propertyName] }}
          </th>
        </tr>
        <tr
          v-show="currentAggregationType === 'median' || isCalculating || false"
        >
          <th class="aggregation-toggler" @click="rotateAggregationType">
            Median
          </th>
          <th
            v-for="(propertyValue, propertyName) in itemsInPage[0]"
            :key="propertyName"
            class="decimalNumber"
          >
            {{ median[propertyName] }}
          </th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  margin-block: 1rem 3rem; /*TODO Not good solution for the component to have margin?!?*/
}

table {
  border-collapse: collapse;

  caption {
    caption-side: top;
    text-align: start;
    font-weight: bold;
    margin-block: 0rem 0.7rem;

    &:before {
      content: "Table: ";
      color: rgb(100, 200, 100);
    }
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
        color: rgb(210, 210, 210);

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
      background-color: rgb(240, 240, 255);
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
      &:nth-child(even) {
        background-color: rgb(250, 250, 250);
      }

      &:hover {
        /*background-color: rgb(250, 250, 100, 35%);*/
        background-color: rgb(255, 255, 0, 35%);
      }

      &:hover td.focused-column {
        /*background-color: yellow;*/
        /*background-color: rgb(0, 250, 0, 35%);*/
        background-color: rgb(0, 255, 0, 35%);
      }

      td {
        vertical-align: baseline;

        &.focused-column {
          /*background-color: rgb(255, 255, 100, 35%);*/
          background-color: rgb(255, 255, 0, 35%);
        }

        &.meta {
          font-size: 0.8rem;
          color: rgb(150, 150, 150);
        }

        &.text {
          color: orangered;
          text-align: start;
        }

        &:is(.integer, .decimalNumber, .positiveInteger) {
          text-align: end;
          font-family: Menlo, "Courier New", monospace;
        }

        &.integer {
          color: forestgreen;
        }

        &.positiveInteger {
          color: lightsteelblue;
        }

        &.decimalNumber {
          color: deeppink;
        }

        &.boolean {
          color: limegreen;
          text-align: center;
        }

        &.localDate {
          font-family: Menlo, "Courier New", monospace;
          color: yellowgreen;
          text-align: start;
        }

        &.countryCode {
          font-family: Menlo, "Courier New", monospace;
          color: yellowgreen;
          text-align: start;
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
      }
    }
  }
}
</style>
