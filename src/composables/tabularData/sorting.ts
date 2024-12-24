import type {
  PropertyValue,
  RowItem,
  Sorting,
  SortOrder,
} from "@/types/type.ts";
import { type Ref, ref, watch } from "vue";

type SortingLog = {
  order: SortOrder;
  propertyName: string;
};

export function useSorting(originalList: Ref<RowItem[]>): Sorting {
  console.group(
    `Init sorting functionality for ${originalList.value.length} items`,
  );

  watch(originalList, (newList, oldList) => {
    console.info(
      `WATCHING: useSorting received updated list: ${oldList.length} => ${newList.length}`,
    );
    sortedList.value = newList;
    currentlySortedOnPropertyName.value = "";
    sortOrder.value = "ascending";
  });

  const sortedList: Ref<RowItem[]> = ref(originalList);

  const currentlySortedOnPropertyName: Ref<string> = ref("");
  const sortOrder: Ref<SortOrder> = ref("ascending");

  const sortOn = (propertyName: string): void => {
    console.group(`Sorting on propertyName "${propertyName}"`);

    const previousSorting: SortingLog = {
      order: sortOrder.value,
      propertyName: currentlySortedOnPropertyName.value,
    };

    if (currentlySortedOnPropertyName.value === propertyName) {
      if (sortOrder.value === "ascending") {
        sortOrder.value = "descending";
      } else {
        sortOrder.value = "ascending";
      }
    } else {
      currentlySortedOnPropertyName.value = propertyName;
      sortOrder.value = "ascending";
    }

    const newSorting: SortingLog = {
      order: sortOrder.value,
      propertyName: currentlySortedOnPropertyName.value,
    };

    console.info(
      `Sorting: "${previousSorting.propertyName}" ${previousSorting.order.toUpperCase()} => "${newSorting.propertyName}" ${newSorting.order.toUpperCase()}`,
    );

    sortedList.value = originalList.value.sort(
      comparePropertyName(propertyName),
    );
    console.groupEnd();
  };

  const comparePropertyName = (propertyName: string) => {
    return (firstRowItem: RowItem, secondRowItem: RowItem): number => {
      const firstValue: PropertyValue = firstRowItem[propertyName];
      const secondValue: PropertyValue = secondRowItem[propertyName];

      const factor: number = sortOrder.value === "ascending" ? +1 : -1;

      // TODO Sort on locale in some way when text?!?

      let order: number = 0;
      if (secondValue === undefined || secondValue === null) {
        order = -1;
      } else if (firstValue === undefined || firstValue === null) {
        order = +1;
      } else {
        if (firstValue < secondValue) {
          order = -1;
        } else if (firstValue > secondValue) {
          order = +1;
        } else {
          // TODO This else is not needed?!?
          order = 0;
        }
      }

      return order * factor;
    };
  };

  console.groupEnd();

  return {
    sortedList,
    sortOn,
    currentlySortedOnPropertyName,
    sortOrder,
  };
}
