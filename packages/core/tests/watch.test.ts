import { describe, expect, test, vi } from "vitest";
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
});
