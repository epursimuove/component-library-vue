import type { ComputedRef, Ref } from "vue";
import { computed, nextTick, ref } from "vue";
import type {
  ColumnCalculations,
  ColumnConfiguration,
  ColumnConfigurations,
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
      return createStyleForColumn(
        calculatedColumnWidthInPixelsForRowNumberColumn.value,
      );
    },
  );

  const calculatedColumnStyle: ComputedRef<Record<string, string>> = computed(
    () => {
      const calculatedColumnStyle: Record<string, string> = {};

      // // NOT WORKING!! Since nothing is triggering.
      // Object.entries(columnConfigurations.value).forEach(
      //   ([propertyName, columnConfiguration]): void => {
      //     calculatedColumnStyle[propertyName] = columnConfiguration.widthInPixels
      //       ? `min-width: ${columnConfiguration.widthInPixels}px; width: ${columnConfiguration.widthInPixels}px; max-width: ${columnConfiguration.widthInPixels}px;`
      //       : "";
      //   },
      // );

      Object.entries(calculatedColumnWidthsInPixels.value).forEach(
        ([propertyName, widthInPixels]): void => {
          calculatedColumnStyle[propertyName] =
            createStyleForColumn(widthInPixels);
        },
      );

      console.table(calculatedColumnStyle);
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
            const columnWidthInPixels = Math.ceil(
              tableCellElement.getBoundingClientRect().width,
            );

            // TODO Are both below needed?!? Seems like that at the moment.
            columnConfigurations.value[columnPropertyName].widthInPixels =
              columnWidthInPixels;

            columnWidthsInPixels[columnPropertyName] = columnWidthInPixels;
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

  const columnConfigurations: ComputedRef<ColumnConfigurations> = computed(
    () => {
      const firstItemInList: RowItem = originalList.value[0]; // TODO Use more values to make a better decision?!?

      const objectProperties: [string, PropertyValue][] =
        Object.entries(firstItemInList);

      console.group(
        `Deciding column configurations from object with ${objectProperties.length} properties`,
      );

      const columnConfigurations: ColumnConfigurations = {};

      objectProperties.forEach(([propertyName, propertyValue]): void => {
        const columnConfiguration: ColumnConfiguration = {
          propertyName,
          propertyType: getPropertyType(propertyValue),
          label: prettifyPropertyName(propertyName),
          // width: "123px",
        };

        columnConfigurations[propertyName] = columnConfiguration;
      });

      console.table(columnConfigurations);

      console.groupEnd();

      return columnConfigurations;
    },
  );

  const createStyleForColumn = (widthInPixels: number | undefined): string => {
    return widthInPixels
      ? `min-width: ${widthInPixels}px; width: ${widthInPixels}px; max-width: ${widthInPixels}px;`
      : "";
  };

  console.groupEnd();

  return {
    isCalculating,
    calculateColumnWidthsAndDisplayData,
    calculatedColumnStyleForRowNumberColumn,
    calculatedColumnStyle,
    columnConfigurations,
  };
}
