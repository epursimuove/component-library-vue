import { describe, it, expect } from "vitest";
import CellData from "@/components/tabularData/CellData.vue";
import { mount } from "@vue/test-utils";

describe("CellData", () => {
  it("renders text properly", () => {
    const wrapper = mount(CellData, {
      props: {
        propertyName: "myProperty",
        propertyType: "text",
        propertyValue: "Lorem ipsum",
      },
    });

    expect(wrapper.text()).toContain("Lorem ipsum");
  });

  describe("renders boolean properly", () => {
    it("when true", () => {
      const wrapper = mount(CellData, {
        props: {
          propertyName: "myProperty",
          propertyType: "boolean",
          propertyValue: true,
        },
      });

      expect(wrapper.text()).toContain("✓");
    });

    it("when false", () => {
      const wrapper = mount(CellData, {
        props: {
          propertyName: "myProperty",
          propertyType: "boolean",
          propertyValue: false,
        },
      });

      expect(wrapper.text()).not.toContain("✓");
    });
  });

  describe("renders positive integer properly", () => {
    it("when > 0", () => {
      const wrapper = mount(CellData, {
        props: {
          propertyName: "myProperty",
          propertyType: "positiveInteger",
          propertyValue: 1,
        },
      });

      expect(wrapper.text()).toContain("1");
    });

    it("when === 0", () => {
      const wrapper = mount(CellData, {
        props: {
          propertyName: "myProperty",
          propertyType: "positiveInteger",
          propertyValue: 0,
        },
      });

      expect(wrapper.text()).not.toContain("0");
    });
  });
});
