import type {
  Aggregation,
  AggregationType,
  PropertyType,
  RowItem,
} from "@/types/type.ts";
import { ref, type Ref, watch } from "vue";
import { getPropertyTypesForObject } from "@/utils/tabularData.ts";

export function useAggregation(originalList: Ref<RowItem[]>): Aggregation {
  console.group(
    `Init aggregation functionality for ${originalList.value.length} items`,
  );

  watch(originalList, (newList, oldList) => {
    console.group(
      `WATCHING: useAggregation received updated list: ${oldList.length} => ${newList.length}`,
    );

    currentAggregationType.value = "sum";
    calculateAggregationValues();
    console.groupEnd();
  });

  const currentAggregationType: Ref<AggregationType> = ref("sum");

  const displayAllAggregations: Ref<boolean> = ref(false);

  const rotateAggregationType = (): void => {
    switch (currentAggregationType.value) {
      case "sum":
        currentAggregationType.value = "min";
        break;
      case "min":
        currentAggregationType.value = "max";
        break;
      case "max":
        currentAggregationType.value = "mean";
        break;
      case "mean":
        currentAggregationType.value = "median";
        break;
      case "median":
        currentAggregationType.value = "sum";
        break;
      default:
        currentAggregationType.value = "sum";
        break;
    }
  };

  const sum: Ref<Record<string, number>> = ref({});
  const min: Ref<Record<string, number>> = ref({});
  const max: Ref<Record<string, number>> = ref({});
  const mean: Ref<Record<string, number>> = ref({});
  const median: Ref<Record<string, number>> = ref({});

  const calculateAggregationValues = () => {
    {
      sum.value = {};
      min.value = {};
      max.value = {};
      mean.value = {};
      median.value = {};
    }

    type PropertiesToAggregate = {
      propertyName: string;
      propertyType: PropertyType;
    };

    const propertiesToAggregate: PropertiesToAggregate[] = [];
    // const propertyTypes: Record<string, PropertyType> = {};
    const propertyTypes: Record<string, PropertyType> =
      getPropertyTypesForObject(
        originalList.value[0], // TODO BETTER IMPLEMENTATION!!!!! Use more than just the first item?!?
      );

    Object.entries(propertyTypes).forEach(([propertyName, propertyType]) => {
      console.log("Property", [propertyName, propertyType]);

      if (
        [
          "integer",
          "decimalNumber",
          "positiveInteger",
          "boolean",
          "text",
        ].includes(propertyType)
      ) {
        propertiesToAggregate.push({ propertyName, propertyType });
      }
    });

    console.info(
      "Properties of right type that can be aggregated",
      propertiesToAggregate,
    );

    propertiesToAggregate.forEach(({ propertyName, propertyType }) => {
      // console.log(`Aggregating "${propertyName}"`);

      const propertyValuesAsNumbers: number[] =
        propertyType === "text"
          ? originalList.value.map(
              (rowItem: RowItem) => (rowItem[propertyName] as string).length,
            )
          : originalList.value.map(
              (rowItem: RowItem) => rowItem[propertyName] as number,
            );

      const sortedList: number[] = propertyValuesAsNumbers.sort(
        (a, b) => a - b,
      );

      // console.log(`Sorted values for property "${propertyName}"`, sortedList);

      const initialValue = 0;
      const sumWithInitial = sortedList.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue,
      );

      const numberOfItems: number = sortedList.length;
      let medianValue: number;
      if (numberOfItems % 2 === 0) {
        const lastIndex: number = Math.floor(numberOfItems / 2);
        medianValue = (sortedList[lastIndex - 1] + sortedList[lastIndex]) / 2;
      } else {
        const index: number = Math.floor(numberOfItems / 2);
        medianValue = sortedList[index];
      }

      sum.value[propertyName] = sumWithInitial;
      if (propertyTypes[propertyName] !== "boolean") {
        min.value[propertyName] = sortedList[0];
        max.value[propertyName] = sortedList[numberOfItems - 1];
        mean.value[propertyName] = Number.parseFloat(
          (sumWithInitial / numberOfItems).toFixed(1),
        );
        median.value[propertyName] = medianValue;
      }
    });
  };

  calculateAggregationValues();

  console.table({
    sum: sum.value,
    min: min.value,
    max: max.value,
    mean: mean.value,
    median: median.value,
  });
  console.groupEnd();

  return {
    sum,
    min,
    max,
    mean,
    median,

    currentAggregationType,
    rotateAggregationType,

    displayAllAggregations,
  };
}
