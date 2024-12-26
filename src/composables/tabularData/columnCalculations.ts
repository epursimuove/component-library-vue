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

  const calculatedColumnWidthsInPixels: Ref<Record<string, number>> = ref({});

  const calculatedColumnStyleForRowNumberColumn: ComputedRef<string> = computed(
    () => {
      return calculatedColumnWidthInPixelsForRowNumberColumn.value
        ? `min-width: ${calculatedColumnWidthInPixelsForRowNumberColumn.value}px; width: ${calculatedColumnWidthInPixelsForRowNumberColumn.value}px; max-width: ${calculatedColumnWidthInPixelsForRowNumberColumn.value}px;`
        : "";
    },
  );

  const calculatedColumnStyle: ComputedRef<Record<string, string>> = computed(
    () => {
      const calculatedColumnStyle: Record<string, string> = {};

      Object.entries(calculatedColumnWidthsInPixels.value).forEach(
        ([propertyName, widthInPixels]): void => {
          calculatedColumnStyle[propertyName] = widthInPixels
            ? `min-width: ${widthInPixels}px; width: ${widthInPixels}px; max-width: ${widthInPixels}px;`
            : "";
        },
      );

      return calculatedColumnStyle;
    },
  );

  const calculateColumnWidths = (): void => {
    if (rowNumberColumnWidthRef.value) {
      calculatedColumnWidthInPixelsForRowNumberColumn.value = Math.ceil(
        rowNumberColumnWidthRef.value.getBoundingClientRect().width,
      );
    }

    const columnWidthsInPixels: Record<string, number> = {};

    if (dynamicColumnWidthsRefs.value) {
      dynamicColumnWidthsRefs.value.forEach(
        (tableCellElement: HTMLTableCellElement, index) => {
          const columnPropertyName: string | undefined =
            tableCellElement.dataset["columnId"];

          if (columnPropertyName) {
            // TODO Are both below needed?!?
            columnConfigurations.value[columnPropertyName].width =
              `${Math.ceil(tableCellElement.getBoundingClientRect().width)}px`;

            columnWidthsInPixels[columnPropertyName] = Math.ceil(
              tableCellElement.getBoundingClientRect().width,
            );
          }
        },
      );

      calculatedColumnWidthsInPixels.value = columnWidthsInPixels;
    }

    console.table(calculatedColumnWidthsInPixels.value);
    console.table(columnConfigurations.value);
  };

  const calculateColumnWidthsAndDisplayData = async () => {
    // Algorithm for calculating dynamic column widths with pagination enabled.
    // - Display ALL the rows in the table.
    // - Let browser automatically decide correct widths for EACH column.
    // - Save the widths to the TH style attribute for each column.
    // - Display only the first page of table.

    isCalculating.value = true;

    console.log("Awaiting next tick 1");
    await nextTick();

    console.group(
      `Calculating column widths for ${dynamicColumnWidthsRefs.value?.length} columns`,
    );

    // console.log("Awaiting next tick 2");
    // await nextTick();

    calculateColumnWidths();

    isCalculating.value = false;

    console.groupEnd();
  };

  const columnConfigurations: ComputedRef<Record<string, ColumnConfiguration>> =
    computed(() => {
      const firstItemInList: RowItem = originalList.value[0]; // TODO Use more values to make a better decision?!?

      const objectProperties: [string, PropertyValue][] =
        Object.entries(firstItemInList);

      console.group(
        `Deciding column configurations from object with ${objectProperties.length} properties`,
      );

      const columnConfigurations: Record<string, ColumnConfiguration> = {};

      objectProperties.forEach(([propertyName, propertyValue]): void => {
        const columnConfiguration: ColumnConfiguration = {
          label: prettifyPropertyName(propertyName),
          propertyName,
          propertyType: getPropertyType(propertyValue),
          // width: "123px",
        };

        columnConfigurations[propertyName] = columnConfiguration;
      });

      console.table(columnConfigurations);

      console.groupEnd();

      return columnConfigurations;
    });

  console.groupEnd();

  return {
    isCalculating,
    calculateColumnWidthsAndDisplayData,
    calculatedColumnStyleForRowNumberColumn,
    calculatedColumnStyle,
    columnConfigurations,
  };
}
