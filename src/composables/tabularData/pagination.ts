import type { Pagination, RowItem } from "@/types/type.ts";
import { computed, type ComputedRef, ref, type Ref, watch } from "vue";

export function usePagination(originalList: Ref<RowItem[]>): Pagination {
  console.group(
    `Init pagination functionality for ${originalList.value.length} items`,
  );

  const paginatedList: Ref<RowItem[]> = ref([]);

  const rowsPerPage: Ref<number> = ref(10); // Value 10 is assumed in tests.
  const currentPage: Ref<number> = ref(1);

  const startIndexForPage: Ref<number> = ref(-1);
  const endIndexForPage: Ref<number> = ref(-1);

  const totalNumberOfItems: ComputedRef<number> = computed(() => {
    return originalList.value.length;
  });

  const totalNumberOfPages: ComputedRef<number> = computed(() => {
    return Math.ceil(totalNumberOfItems.value / rowsPerPage.value);
  });

  const firstItemOnPage: ComputedRef<number> = computed(() => {
    return (currentPage.value - 1) * rowsPerPage.value + 1;
  });

  const lastItemOnPage: ComputedRef<number> = computed(() => {
    return Math.min(
      firstItemOnPage.value + rowsPerPage.value - 1,
      totalNumberOfItems.value,
    );
  });

  const displayCurrentPage = () => {
    startIndexForPage.value = (currentPage.value - 1) * rowsPerPage.value;
    endIndexForPage.value = startIndexForPage.value + rowsPerPage.value - 1;

    paginatedList.value = getItemsForCurrentPage();

    console.table({
      startIndexForPage: startIndexForPage.value,
      endIndexForPage: endIndexForPage.value,
      paginatedList: paginatedList.value.length,
    });
  };

  const getItemsForCurrentPage = () =>
    originalList.value.slice(
      startIndexForPage.value,
      endIndexForPage.value + 1,
    );

  watch(
    originalList,
    (newList: RowItem[], oldList: RowItem[] | undefined): void => {
      console.info(
        `WATCHING: usePagination received updated list: ${oldList?.length} => ${newList.length}`,
      );

      currentPage.value = 1;
      displayCurrentPage();
    },
    { immediate: true, deep: 1 },
  );

  watch(rowsPerPage, (newRowsPerPage: number, oldRowsPerPage: number): void => {
    console.info(
      `WATCHING: rowsPerPage modified: ${oldRowsPerPage} => ${newRowsPerPage}`,
    );

    currentPage.value = 1;
    displayCurrentPage();
  });

  const gotoFirstPage = (): void => {
    console.info(`Goto first page: ${currentPage.value} => 1`);
    currentPage.value = 1;
    displayCurrentPage();
  };

  const gotoPreviousPage = (): void => {
    console.info(
      `Goto previous page: ${currentPage.value} => ${currentPage.value - 1}`,
    );
    currentPage.value--;
    displayCurrentPage();
  };

  const gotoNextPage = (): void => {
    console.info(
      `Goto next page: ${currentPage.value} => ${currentPage.value + 1}`,
    );
    currentPage.value++;
    displayCurrentPage();
  };

  const gotoLastPage = (): void => {
    console.info(
      `Goto last page: ${currentPage.value} => ${totalNumberOfPages.value}`,
    );
    currentPage.value = totalNumberOfPages.value;
    displayCurrentPage();
  };

  console.table({
    totalNumberOfItems: totalNumberOfItems.value,
    rowsPerPage: rowsPerPage.value,
    totalNumberOfPages: totalNumberOfPages.value,
  });
  console.groupEnd();

  return {
    paginatedList,

    rowsPerPage,
    currentPage,
    totalNumberOfItems,
    totalNumberOfPages,

    firstItemOnPage,
    lastItemOnPage,

    gotoFirstPage,
    gotoPreviousPage,
    gotoNextPage,
    gotoLastPage,
  };
}
