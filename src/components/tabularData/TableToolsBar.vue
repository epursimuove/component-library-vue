<script setup lang="ts">
import type { Pagination } from "@/types/type.ts";
import { computed, type ComputedRef, ref, type Ref } from "vue";
import { createRandomId, getNumberOfDigits, padStart } from "@/utils/util.ts";

const props = defineProps<{
  pagination: Pagination;
}>();

const {
  // paginatedList,
  rowsPerPage,
  currentPage,
  firstItemOnPage,
  lastItemOnPage,
  gotoFirstPage,
  gotoPreviousPage,
  gotoNextPage,
  gotoLastPage,
  totalNumberOfItems,
  totalNumberOfPages,
} = props.pagination;

const displayTotalNumberOfPages: Ref<boolean> = ref(true);

const componentUuid: number = createRandomId();

const infoAboutPages: ComputedRef<string> = computed(() => {
  const maxNumberOfDigits: number = getNumberOfDigits(totalNumberOfPages.value);
  const currentPageStr: string = padStart(currentPage.value, maxNumberOfDigits);
  const totalNumberOfPagesStr: string = padStart(
    totalNumberOfPages.value,
    maxNumberOfDigits,
  );

  return `${currentPageStr} / ${totalNumberOfPagesStr}`;
});

const infoAboutItems: ComputedRef<string> = computed(() => {
  const maxNumberOfDigits: number = getNumberOfDigits(totalNumberOfItems.value);
  const firstItemOnPageStr: string = padStart(
    firstItemOnPage.value,
    maxNumberOfDigits,
  );
  const lastItemOnPageStr: string = padStart(
    lastItemOnPage.value,
    maxNumberOfDigits,
  );
  const totalNumberOfItemsStr: string = padStart(
    totalNumberOfItems.value,
    maxNumberOfDigits,
  );

  return `${firstItemOnPageStr} - ${lastItemOnPageStr} / ${totalNumberOfItemsStr}`;
});
</script>

<template>
  <div class="table-tools">
    <div>
      <label :for="`rows-per-page-${componentUuid}`">Rows per page</label>
      <input
        :id="`rows-per-page-${componentUuid}`"
        type="number"
        min="5"
        max="50"
        step="5"
        v-model="rowsPerPage"
      />
    </div>

    <div>
      <button
        type="button"
        @click="gotoFirstPage"
        :disabled="currentPage === 1"
      >
        &Pr;
      </button>

      <button
        type="button"
        @click="gotoPreviousPage"
        :disabled="currentPage === 1"
      >
        &pr;
      </button>

      <button
        type="button"
        @click="gotoNextPage"
        :disabled="currentPage === totalNumberOfPages"
      >
        &sc;
      </button>

      <button
        type="button"
        @click="gotoLastPage"
        :disabled="currentPage === totalNumberOfPages"
      >
        &Sc;
      </button>
    </div>

    <div
      class="page-info"
      @click="displayTotalNumberOfPages = !displayTotalNumberOfPages"
    >
      <template v-if="displayTotalNumberOfPages">
        {{ infoAboutPages }}
      </template>

      <template v-else>
        {{ infoAboutItems }}
      </template>
    </div>
  </div>
</template>

<style scoped>
.table-tools {
  margin-block: 0.5rem;
  display: flex;
  flex-direction: column;
  /*justify-content: space-between;*/
  justify-content: flex-start;
  gap: 1rem;
  align-items: flex-start;

  & > * {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;

    &.page-info {
      font-family: Menlo, "Courier New", monospace;
      cursor: pointer;
      white-space: pre;
    }
  }

  /*
  & > div:last-child {
    margin-inline-start: auto;
  }
   */
}

button {
  font-size: 1.1rem;
  width: 1.8rem;
  height: 1.8rem;
  place-content: center;
  cursor: pointer;

  &:disabled {
    /*cursor: not-allowed;*/
    cursor: unset;
  }
}

@media screen and (min-width: 600px) {

  .table-tools {
    flex-direction: row;
    justify-content: flex-start;
    gap: 2rem;
    align-items: center;

  }
}
</style>
