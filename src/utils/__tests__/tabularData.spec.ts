import { beforeEach, describe, expect, it } from "vitest";
import {
  capitalize,
  decapitalize,
  getPropertyType,
  getPropertyTypesForObject,
  prettifyPropertyName,
} from "@/utils/tabularData.ts";

describe("tabularData.ts", () => {
  describe("capitalize", () => {
    it("works", () => {
      expect(capitalize("abc")).toBe("Abc");
      expect(capitalize("Abc")).toBe("Abc");
      expect(capitalize("ABC")).toBe("ABC");
    });
  });

  describe("decapitalize", () => {
    it("works", () => {
      expect(decapitalize("abc")).toBe("abc");
      expect(decapitalize("Abc")).toBe("abc");
      expect(decapitalize("ABC")).toBe("aBC");
    });
  });

  describe("prettifyPropertyName", () => {
    it("works", () => {
      expect(prettifyPropertyName("age")).toBe("Age");
      expect(prettifyPropertyName("firstName")).toBe("First name");
      expect(prettifyPropertyName("theSpecialNumber")).toBe(
        "The special number",
      );
    });

    it("special handling for 'number of'", () => {
      expect(prettifyPropertyName("numberOfItems")).toBe("# items");
      expect(prettifyPropertyName("numberOfUsers")).toBe("# users");
    });
  });

  describe("getPropertyType", () => {
    it("works", () => {
      expect(getPropertyType("hello world")).toBe("text");
      expect(getPropertyType("2024-12-31")).toBe("localDate");
      expect(getPropertyType("")).toBe("text");
      expect(getPropertyType(false)).toBe("boolean");
      expect(getPropertyType(true)).toBe("boolean");
      expect(getPropertyType(123)).toBe("integer");
      expect(getPropertyType(3.14)).toBe("decimalNumber");
      expect(getPropertyType("DK")).toBe("text");
      expect(getPropertyType("DK", "countryCode")).toBe("countryCode");
    });
  });

  describe("getPropertyTypesForObject", () => {
    it("works", () => {
      expect(getPropertyTypesForObject({})).toStrictEqual({});
      expect(
        getPropertyTypesForObject({ foo: "hello", bar: 42, baz: false }),
      ).toStrictEqual({
        foo: "text",
        bar: "integer",
        baz: "boolean",
      });
      expect(
        getPropertyTypesForObject({ birthDate: "1995-05-10" }),
      ).toStrictEqual({
        birthDate: "localDate",
      });
      expect(getPropertyTypesForObject({ countryCode: "XY" })).toStrictEqual({
        countryCode: "countryCode",
      });
    });
  });
});
