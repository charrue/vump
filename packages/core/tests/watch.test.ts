import { describe, expect, test, vi } from "vitest";
import { nextTick } from "../src/scheduler";
import { createComponent } from "./helper";

describe("watch option", () => {
  test("basic usage", () => {
    const fn = vi.fn();
    const { instance } = createComponent({
      data: {
        a: 1,
      },
      watch: {
        a: fn,
      },
    });

    expect(fn).not.toHaveBeenCalled();
    instance.a = 2;
    expect(fn).toHaveBeenCalled();
  });

  test("string method name", () => {
    const fn = vi.fn();

    const { instance } = createComponent({
      data: {
        a: 1,
      },
      watch: {
        a: "onChange",
      },
      methods: {
        onChange: fn,
      },
    });

    expect(fn).not.toHaveBeenCalled();
    instance.a = 2;
    expect(fn).toHaveBeenCalled();
  });

  test("with option: immediate", () => {
    const fn = vi.fn();

    const { instance } = createComponent({
      data: { a: 1 },
      watch: {
        a: {
          handler: fn,
          immediate: true,
        },
      },
    });

    expect(fn).toHaveBeenCalledTimes(1);
    instance.a = 2;
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("with option: deep", () => {
    const fn = vi.fn();

    const { instance } = createComponent({
      data: { a: { b: 1 } },
      watch: {
        a: {
          handler: fn,
          deep: true,
        },
      },
    });

    expect(fn).not.toHaveBeenCalled();
    instance.a.b = 2;
    expect(fn).toHaveBeenCalledTimes(1);
    instance.a = { b: 3 };
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test("watch keypath", () => {
    const fn = vi.fn();

    const { instance } = createComponent({
      data: { a: { b: 1 } },
      watch: {
        "a.b": fn,
      },
    });

    expect(fn).not.toHaveBeenCalled();
    instance.a.b = 2;
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should call setData", async () => {
    const { instance, setDataSpy, component } = createComponent({
      template: "<view>{{ a }} {{ b }}</view>",
      data: {
        a: 1,
        b: 1,
      },
      watch: {
        a(val: number) {
          this.b = val;
        },
      },
    });
    expect(setDataSpy).toHaveBeenCalledTimes(1);
    expect(setDataSpy).toHaveBeenCalledWith({ a: 1, b: 1 });
    expect(component.dom?.innerHTML).toBe("<wx-view>1 1</wx-view>");

    instance.a = 2;
    expect(component.dom?.innerHTML).toBe("<wx-view>1 1</wx-view>");
    await nextTick();
    expect(setDataSpy).toHaveBeenCalledTimes(2);
    expect(setDataSpy).toHaveBeenCalledWith({ a: 2, b: 2 });
    expect(component.dom?.innerHTML).toBe("<wx-view>2 2</wx-view>");
  });
});
