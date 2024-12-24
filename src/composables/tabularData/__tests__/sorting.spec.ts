import { beforeEach, describe, expect, it } from "vitest";
import { useSorting } from "@/composables/tabularData/sorting.ts";
import type { RowItem, Sorting } from "@/types/type.ts";
import type { Ref } from "vue";
import { nextTick, ref } from "vue";

describe("useSorting", () => {
  describe("correct initialization", () => {
    let originalList: Ref<RowItem[]>;
    let sorting: Sorting;

    beforeEach(() => {
      originalList = ref([
        {
          planet: "Venus",
          size: 6051,
        },
        {
          planet: "Earth",
          size: 6371,
        },
        {
          planet: "Mars",
          size: 3389,
        },
      ]);

      sorting = useSorting(originalList);
    });

    it("should be initialized", () => {
      const { sortedList, currentlySortedOnPropertyName, sortOrder } = sorting;

      expect(sortedList.value.length).toBe(3);

      expect(sortedList.value[0]["planet"]).toBe("Venus");
      expect(sortedList.value[2]["planet"]).toBe("Mars");

      expect(currentlySortedOnPropertyName.value).toBe("");
      expect(sortOrder.value).toBe("ascending");
    });

    it("sorts text", () => {
      const { sortedList, sortOn, currentlySortedOnPropertyName, sortOrder } =
        sorting;

      expect(sortedList.value[0]["planet"]).toBe("Venus");
      expect(sortedList.value[2]["planet"]).toBe("Mars");

      expect(currentlySortedOnPropertyName.value).toBe("");
      expect(sortOrder.value).toBe("ascending");

      sortOn("planet");

      expect(sortedList.value[0]["planet"]).toBe("Earth");
      expect(sortedList.value[2]["planet"]).toBe("Venus");

      expect(currentlySortedOnPropertyName.value).toBe("planet");
      expect(sortOrder.value).toBe("ascending");

      sortOn("planet");

      expect(sortedList.value[0]["planet"]).toBe("Venus");
      expect(sortedList.value[2]["planet"]).toBe("Earth");

      expect(currentlySortedOnPropertyName.value).toBe("planet");
      expect(sortOrder.value).toBe("descending");
    });

    it("sorts numbers", () => {
      const { sortedList, sortOn, currentlySortedOnPropertyName, sortOrder } =
        sorting;

      expect(sortedList.value[0]["planet"]).toBe("Venus");
      expect(sortedList.value[2]["planet"]).toBe("Mars");

      expect(currentlySortedOnPropertyName.value).toBe("");
      expect(sortOrder.value).toBe("ascending");

      sortOn("size");

      expect(sortedList.value[0]["planet"]).toBe("Mars");
      expect(sortedList.value[2]["planet"]).toBe("Earth");

      expect(currentlySortedOnPropertyName.value).toBe("size");
      expect(sortOrder.value).toBe("ascending");

      sortOn("size");

      expect(sortedList.value[0]["planet"]).toBe("Earth");
      expect(sortedList.value[2]["planet"]).toBe("Mars");

      expect(currentlySortedOnPropertyName.value).toBe("size");
      expect(sortOrder.value).toBe("descending");
    });

    it("handles list updates and resets properly", async () => {
      const { sortedList, sortOn, currentlySortedOnPropertyName, sortOrder } =
        sorting;

      expect(sortedList.value.length).toBe(3);

      expect(sortedList.value[0]["planet"]).toBe("Venus");
      expect(sortedList.value[2]["planet"]).toBe("Mars");

      expect(currentlySortedOnPropertyName.value).toBe("");
      expect(sortOrder.value).toBe("ascending");

      sortOn("planet");
      sortOn("planet");

      expect(currentlySortedOnPropertyName.value).toBe("planet");
      expect(sortOrder.value).toBe("descending");

      // Updates the list.
      originalList.value = [
        {
          planet: "Saturn",
          size: 58232,
        },
        {
          planet: "Uranus",
          size: 25362,
        },
      ];

      await nextTick();

      expect(sortedList.value.length).toBe(2);

      expect(sortedList.value[0]["planet"]).toBe("Saturn");
      expect(sortedList.value[1]["planet"]).toBe("Uranus");

      expect(currentlySortedOnPropertyName.value).toBe("");
      expect(sortOrder.value).toBe("ascending");
    });
  });
});
