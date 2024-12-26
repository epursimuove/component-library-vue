import { describe, expect, it } from "vitest";
import { createRandomId, getNumberOfDigits, padStart, toFixed } from "@/utils/util.ts";

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

  describe("toFixed", () => {

    it("default number of digits", () => {
      expect(toFixed(0)).toBe("0.00");
      expect(toFixed(0.001)).toBe("0.00");
      expect(toFixed(0.006)).toBe("0.01");
      expect(toFixed(0.123)).toBe("0.12");
      expect(toFixed(9)).toBe("9.00");
      expect(toFixed(9.5)).toBe("9.50");
      expect(toFixed(9.99)).toBe("9.99");
      expect(toFixed(9.999)).toBe("10.00");
      expect(toFixed(123.98765)).toBe("123.99");
    });

    it("defined number of digits", () => {
      expect(toFixed(0, 1)).toBe("0.0");
      expect(toFixed(0, 3)).toBe("0.000");
      expect(toFixed(0.001, 1)).toBe("0.0");
      expect(toFixed(0.001, 3)).toBe("0.001");
      expect(toFixed(0.006, 1)).toBe("0.0");
      expect(toFixed(0.006, 3)).toBe("0.006");
      expect(toFixed(0.123, 1)).toBe("0.1");
      expect(toFixed(0.123, 3)).toBe("0.123");
      expect(toFixed(9, 1)).toBe("9.0");
      expect(toFixed(9, 3)).toBe("9.000");
      expect(toFixed(9.5, 1)).toBe("9.5");
      expect(toFixed(9.5, 3)).toBe("9.500");
      expect(toFixed(9.99, 1)).toBe("10.0");
      expect(toFixed(9.99, 3)).toBe("9.990");
      expect(toFixed(9.999, 1)).toBe("10.0");
      expect(toFixed(9.999, 3)).toBe("9.999");
      expect(toFixed(123.98765, 1)).toBe("124.0");
      expect(toFixed(123.98765, 3)).toBe("123.988");
    });

  });
});
