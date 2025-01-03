import { beforeEach, describe, expect, it, vi } from "vitest";
import { useColumnCalculations } from "@/composables/tabularData/columnCalculations.ts";
import { type Ref } from "vue";
import type { ColumnCalculations, RowItem } from "@/types/type.ts";
import { ref } from "vue";

describe("useColumnCalculations", () => {
  let originalList: Ref<RowItem[]>;
  let columnCalculations: ColumnCalculations;

  beforeEach(() => {
    originalList = ref([
      {
        state: "Testing",
        theValue: 1234,
        countryCode: "SE",
        dateOfBirth: "1990-05-23",
      },
    ]);

    const rowNumberColumnWidthRef: Ref<HTMLTableCellElement | null> = ref(null);
    const dynamicColumnWidthsRefs: Ref<HTMLTableCellElement[] | null> = ref([]);

    columnCalculations = useColumnCalculations(
      originalList,
      rowNumberColumnWidthRef,
      dynamicColumnWidthsRefs,
    );
  });

  describe("correct initialization", () => {
    it("isCalculating", () => {
      expect(columnCalculations.isCalculating.value).toBeTruthy();
    });

    it("columnConfigurations", () => {
      expect(columnCalculations.columnConfigurations.value).toStrictEqual({
        state: {
          label: "State",
          propertyName: "state",
          propertyType: "text",
          typeof: "string",
          enabled: true,
          indexOrder: 0,
        },
        theValue: {
          label: "The value",
          propertyName: "theValue",
          propertyType: "integer",
          typeof: "number",
          enabled: true,
          indexOrder: 1,
        },
        countryCode: {
          label: "Country code",
          propertyName: "countryCode",
          propertyType: "countryCode",
          typeof: "string",
          enabled: true,
          indexOrder: 2,
        },
        dateOfBirth: {
          label: "Date of birth",
          propertyName: "dateOfBirth",
          propertyType: "localDate",
          typeof: "string",
          enabled: true,
          indexOrder: 3,
        },
      });
    });
  });

  describe.skip("calculates correctly", () => {});
});
