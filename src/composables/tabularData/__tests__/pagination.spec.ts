import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, ref, type Ref } from "vue";
import type { Pagination, RowItem } from "@/types/type.ts";
import { usePagination } from "@/composables/tabularData/pagination.ts";

describe("usePagination", () => {
  describe("correct initialization", () => {
    let originalList: Ref<RowItem[]>;
    let pagination: Pagination;

    beforeEach(() => {
      originalList = ref([
        { name: "Alice" }, // 1
        { name: "Bob" },
        { name: "Charlie" },
        { name: "Donna" },
        { name: "Elisabeth" }, // 5
        { name: "Fredric" },
        { name: "Gustav" },
        { name: "Henrietta" },
        { name: "Inger" },
        { name: "Jennifer" }, // 10
        { name: "Klaus" },
        { name: "Ludvig" },
        { name: "Monica" },
        { name: "Nathalie" },
        { name: "Ove" }, // 15
        { name: "Patricia" },
        { name: "Quincy" },
        { name: "Richard" },
        { name: "Sara" },
        { name: "Tatiana" }, // 20
        { name: "Ursula" },
      ]);

      pagination = usePagination(originalList);
    });

    it("should be initialized", () => {
      const {
        paginatedList,
        rowsPerPage,
        currentPage,
        totalNumberOfItems,
        totalNumberOfPages,
        firstItemOnPage,
        lastItemOnPage,
      } = pagination;

      expect(rowsPerPage.value).toBe(10);
      expect(currentPage.value).toBe(1);
      expect(totalNumberOfItems.value).toBe(21);
      expect(totalNumberOfPages.value).toBe(3);
      expect(firstItemOnPage.value).toBe(1);
      expect(lastItemOnPage.value).toBe(10);

      expect(paginatedList.value.length).toBe(10);

      expect(paginatedList.value[0]["name"]).toBe("Alice");
      expect(paginatedList.value[9]["name"]).toBe("Jennifer");
    });

    it("should be able to change page", () => {
      const {
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
      } = pagination;

      expect(currentPage.value).toBe(1);
      expect(firstItemOnPage.value).toBe(1);
      expect(paginatedList.value[0]["name"]).toBe("Alice");

      gotoNextPage();

      expect(currentPage.value).toBe(2);
      expect(firstItemOnPage.value).toBe(11);
      expect(paginatedList.value[0]["name"]).toBe("Klaus");

      gotoNextPage();

      expect(currentPage.value).toBe(3);
      expect(firstItemOnPage.value).toBe(21);
      expect(paginatedList.value[0]["name"]).toBe("Ursula");

      gotoFirstPage();

      expect(currentPage.value).toBe(1);
      expect(firstItemOnPage.value).toBe(1);
      expect(paginatedList.value[0]["name"]).toBe("Alice");

      gotoLastPage();

      expect(currentPage.value).toBe(3);
      expect(firstItemOnPage.value).toBe(21);
      expect(paginatedList.value[0]["name"]).toBe("Ursula");

      gotoPreviousPage();

      expect(currentPage.value).toBe(2);
      expect(firstItemOnPage.value).toBe(11);
      expect(paginatedList.value[0]["name"]).toBe("Klaus");

      gotoPreviousPage();

      expect(currentPage.value).toBe(1);
      expect(firstItemOnPage.value).toBe(1);
      expect(paginatedList.value[0]["name"]).toBe("Alice");
    });

    it("handles list updates and resets properly", async () => {
      const {
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
      } = pagination;

      expect(paginatedList.value.length).toBe(10);

      expect(paginatedList.value[0]["name"]).toBe("Alice");
      expect(paginatedList.value[9]["name"]).toBe("Jennifer");

      // Updates the list.
      originalList.value = [{ age: 42 }, { age: 19 }];

      await nextTick();

      expect(paginatedList.value.length).toBe(2);

      expect(paginatedList.value[0]["name"]).toBeUndefined();
      expect(paginatedList.value[0]["age"]).toBe(42);
      expect(paginatedList.value[1]["age"]).toBe(19);
    });
  });
});
