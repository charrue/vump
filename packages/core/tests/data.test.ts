import { describe, expect, test } from "vitest";
import { DATA_KEY } from "../src/instance";
import { createComponent } from "./helper";

describe("option data", () => {
  test("data is object", () => {
    const initialValue = {
      name: "foo",
    };
    const { instance } = createComponent({
      data: initialValue,
    });

    expect(instance.data).toEqual(initialValue);
    expect(instance[DATA_KEY]).toEqual(initialValue);
  });

  test("data is function", () => {
    const initialValue = {
      name: "foo",
    };
    const { instance } = createComponent({
      data() {
        return initialValue;
      },
    });

    expect(instance.data).toEqual(initialValue);
    expect(instance[DATA_KEY]).toEqual(initialValue);
  });

  test("should warn non object return", () => {
    createComponent({
      data() {},
    });

    expect("data should return an object").toHaveBeenWarned();
  });
  // should reactive
  // should have access to props
  // should have access to methods
});
