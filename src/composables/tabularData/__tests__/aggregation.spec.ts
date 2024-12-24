import { beforeEach, describe, expect, it } from "vitest";
import { type Ref, ref } from "vue";
import { useAggregation } from "@/composables/tabularData/aggregation.ts";
import type { Aggregation, RowItem } from "@/types/type.ts";

describe("useAggregation", () => {
  describe("correct initialization", () => {
    let originalList: Ref<RowItem[]>;
    let aggregation: Aggregation;

    beforeEach(() => {
      originalList = ref([
        {
          n: 5,
        },
        {
          n: 1,
        },
        {
          n: 6,
        },
        {
          n: 2,
        },
        {
          n: 4,
        },
        {
          n: 3,
        },
      ]);

      aggregation = useAggregation(originalList);
    });

    it("should be initialized and calculated", () => {
      const { sum, min, max, mean, median } = aggregation;

      expect(sum.value).toStrictEqual({ n: 21 });
      expect(min.value).toStrictEqual({ n: 1 });
      expect(max.value).toStrictEqual({ n: 6 });
      expect(mean.value).toStrictEqual({ n: 3.5 });
      expect(median.value).toStrictEqual({ n: 3.5 });
    });
  });
});
