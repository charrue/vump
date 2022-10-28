import { describe, expect, test } from "vitest";
import { DATA_KEY } from "../src/instance";
import { nextTick } from "../src/scheduler";
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

  test("should call setData", async () => {
    const { instance, setDataSpy, component } = createComponent({
      template: "<view>{{ a }}</view>",
      data: {
        a: 1,
      },
    });
    expect(setDataSpy).toHaveBeenCalledTimes(1);
    expect(setDataSpy).toHaveBeenCalledWith({ a: 1 });
    expect(component.dom?.innerHTML).toBe("<wx-view>1</wx-view>");

    instance.a = 2;
    expect(component.dom?.innerHTML).toBe("<wx-view>1</wx-view>");
    await nextTick();
    expect(setDataSpy).toHaveBeenCalledTimes(2);
    expect(setDataSpy).toHaveBeenCalledWith({ a: 2 });
    expect(component.dom?.innerHTML).toBe("<wx-view>2</wx-view>");
  });
  // should have access to props
  // should have access to methods
});
