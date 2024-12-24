import { describe, expect, it } from "vitest";
import { createRandomId, getNumberOfDigits, padStart } from "@/utils/util.ts";

describe("util.ts", () => {
  describe("createRandomId", () => {
    it("should return an integer", () => {
      expect(Number.isInteger(createRandomId())).toBeTruthy();
    });

    it("should be inside interval", () => {
      expect(createRandomId()).toBeGreaterThanOrEqual(1);
      expect(createRandomId()).toBeLessThanOrEqual(100000);
    });

    it("should be inside interval for user defined max", () => {
      expect(createRandomId(4)).toBeGreaterThanOrEqual(1);
      expect(createRandomId(4)).toBeLessThanOrEqual(4);
    });
  });

  describe("getNumberOfDigits", () => {
    it("should work for positive integers", () => {
      expect(getNumberOfDigits(0)).toBe(1);
      expect(getNumberOfDigits(1)).toBe(1);
      expect(getNumberOfDigits(9)).toBe(1);
      expect(getNumberOfDigits(10)).toBe(2);
      expect(getNumberOfDigits(99)).toBe(2);
      expect(getNumberOfDigits(100)).toBe(3);
      expect(getNumberOfDigits(98765)).toBe(5);
      expect(getNumberOfDigits(12345678)).toBe(8);
    });

    it("should work for negative integers", () => {
      expect(getNumberOfDigits(-1)).toBe(1);
      expect(getNumberOfDigits(-9)).toBe(1);
      expect(getNumberOfDigits(-10)).toBe(2);
      expect(getNumberOfDigits(-99)).toBe(2);
      expect(getNumberOfDigits(-100)).toBe(3);
      expect(getNumberOfDigits(-98765)).toBe(5);
      expect(getNumberOfDigits(-12345678)).toBe(8);
    });
  });

  describe("padStart", () => {
    it("should not pad when already long enough", () => {
      expect(padStart(0, 1)).toBe("0");
      expect(padStart(9, 1)).toBe("9");
      expect(padStart(123, 1)).toBe("123");
      expect(padStart(123, 3)).toBe("123");
      expect(padStart(98765, 1)).toBe("98765");
      expect(padStart(98765, 5)).toBe("98765");
    });

    it("should pad when not long enough", () => {
      expect(padStart(0, 2)).toBe(" 0");
      expect(padStart(9, 2)).toBe(" 9");
      expect(padStart(9, 4)).toBe("   9");
      expect(padStart(123, 4)).toBe(" 123");
      expect(padStart(123, 5)).toBe("  123");
      expect(padStart(98765, 6)).toBe(" 98765");
      expect(padStart(98765, 10)).toBe("     98765");
    });
  });
});
