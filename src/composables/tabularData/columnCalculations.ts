import type { ComputedRef, Ref } from "vue";
import { computed, nextTick, ref } from "vue";
import type {
  ColumnCalculations,
  ColumnConfiguration,
  PropertyValue,
  RowItem,
} from "@/types/type.ts";
import { getPropertyType, prettifyPropertyName } from "@/utils/tabularData.ts";

export function useColumnCalculations(
  originalList: Ref<RowItem[]>,
  rowNumberColumnWidthRef: Ref<HTMLTableCellElement | null>,
  dynamicColumnWidthsRefs: Ref<HTMLTableCellElement[] | null>,
): ColumnCalculations {
  console.group(
    `Init column calculations functionality for ${originalList.value.length} items`,
  );

  const isCalculating: Ref<boolean> = ref(true);

  const calculatedColumnWidthInPixelsForRowNumberColumn: Ref<
    number | undefined
  > = ref();

  const calculatedColumnWidthsInPixels: Ref<number[]> = ref([]);

  const calculatedColumnStyleForRowNumberColumn: ComputedRef<string> = computed(
    () => {
      return calculatedColumnWidthInPixelsForRowNumberColumn.value
        ? `min-width: ${calculatedColumnWidthInPixelsForRowNumberColumn.value}px; width: ${calculatedColumnWidthInPixelsForRowNumberColumn.value}px; max-width: ${calculatedColumnWidthInPixelsForRowNumberColumn.value}px;`
        : "";
    },
  );

  const calculatedColumnStyle: ComputedRef<string[]> = computed(() => {
    return calculatedColumnWidthsInPixels.value.map(
      (widthInPixels: number): string => {
        return widthInPixels
          ? `min-width: ${widthInPixels}px; width: ${widthInPixels}px; max-width: ${widthInPixels}px;`
          : "";
      },
    );
  });

  const calculateColumnWidths = () => {
    if (rowNumberColumnWidthRef.value) {
      calculatedColumnWidthInPixelsForRowNumberColumn.value =
        rowNumberColumnWidthRef.value.clientWidth;
    }

    if (dynamicColumnWidthsRefs.value) {
      calculatedColumnWidthsInPixels.value = dynamicColumnWidthsRefs.value.map(
        (tableCellElement: HTMLTableCellElement, index) => {
          columnConfigurations.value[index].width =
            `${tableCellElement.clientWidth}px`;

          return tableCellElement.clientWidth;
        },
      );
    }

    console.table(calculatedColumnWidthsInPixels.value);
  };

  const calculateColumnWidthsAndDisplayData = async () => {
    // Algorithm for calculating dynamic column widths with pagination enabled.
    // - Display ALL the rows in the table.
    // - Let browser automatically decide correct widths for EACH column.
    // - Save the widths to the TH style attribute for each column.
    // - Display only the first page of table.

    console.group(
      `Calculating column widths for ${dynamicColumnWidthsRefs.value?.length} columns`,
    );

    isCalculating.value = true;

    console.log("Awaiting next tick");
    await nextTick();

    calculateColumnWidths();

    isCalculating.value = false;

    console.groupEnd();
  };

  const columnConfigurations: ComputedRef<ColumnConfiguration[]> = computed(
    () => {
      const firstItemInList: RowItem = originalList.value[0]; // TODO Use more values to make a better decision?!?

      const objectProperties: [string, PropertyValue][] =
        Object.entries(firstItemInList);

      console.group(
        `Deciding column configurations from object with ${objectProperties.length} properties`,
      );

      const columnConfigurations: ColumnConfiguration[] = objectProperties.map(
        ([propertyName, propertyValue]): ColumnConfiguration => {
          const columnConfiguration: ColumnConfiguration = {
            label: prettifyPropertyName(propertyName),
            propertyName,
            propertyType: getPropertyType(propertyValue),
            // width: "123px",
          };

          return columnConfiguration;
        },
      );

      console.table(columnConfigurations);

      console.groupEnd();

      return columnConfigurations;
    },
  );

  console.groupEnd();

  return {
    isCalculating,
    calculateColumnWidthsAndDisplayData,
    calculatedColumnStyleForRowNumberColumn,
    calculatedColumnStyle,
    columnConfigurations,
  };
}
