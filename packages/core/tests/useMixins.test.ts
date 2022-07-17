import { test, expect, describe, vi } from "vitest";
import { useMixins } from "../src/mixin/useMixins";

describe("useMixins", () => {
  test("merge data", () => {
    const mixins = [
      {
        data: {
          name: "mixin",
        },
      },
      {
        data: {
          version: "0.0.1",
        },
      },
    ];

    const options = {
      data: {
        name: "vump",
        language: "typescript",
      },
    };
    useMixins(options, mixins);
    expect(options).toEqual({
      data: {
        ...options.data,
        version: "0.0.1",
      },
    });
  });

  test("merge methods", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();
    const fn4 = vi.fn();

    const mixins = [
      {
        data: {
          name: "mixin",
        },
        methods: {
          log: fn1,
        },
      },
      {
        data: {
          version: "0.0.1",
        },
        methods: {
          log: fn4,
          log2: fn2,
        },
      },
      {
        methods: {
          log3: fn4,
        },
      },
    ];

    const options: Record<string, any> = {
      data: {
        name: "vump",
        language: "typescript",
      },
      methods: {
        log2: fn3,
      },
    };

    useMixins(options, mixins);

    expect(options.methods.log).toBeDefined();
    // 第一个mixin的方法
    options.methods.log();
    expect(fn1).toBeCalledTimes(1);

    expect(options.methods.log2).toBeDefined();
    // 自身的方法
    options.methods.log2();
    expect(fn3).toBeCalledTimes(1);

    expect(options.methods.log3).toBeDefined();
    // 最后一个mixin的方法
    options.methods.log3();
    expect(fn4).toBeCalledTimes(1);
  });

  test("merge lifecycle", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();

    const mixins = [
      {
        onLoad() {
          fn1("child1");
        },
        onShow() {
          fn2("child1");
        },
      },
      {
        onLoad() {
          fn1("child2");
        },
        onShow() {
          fn2("child2");
        },
        onHide() {
          fn3("child2");
        },
      },
    ];

    const options: Record<string, any> = {
      onLoad() {
        fn1("parent");
      },
    };

    useMixins(options, mixins);
    expect(options.onLoad).toBeDefined();
    expect(options.onShow).toBeDefined();
    expect(options.onHide).toBeDefined();

    options.onLoad();
    expect(fn1).toBeCalledTimes(3);
    expect(fn1).toHaveBeenNthCalledWith(1, "parent");
    expect(fn1).toHaveBeenNthCalledWith(2, "child1");
    expect(fn1).toHaveBeenNthCalledWith(3, "child2");

    options.onShow();
    expect(fn2).toBeCalledTimes(2);
    expect(fn2).toHaveBeenNthCalledWith(1, "child1");
    expect(fn2).toHaveBeenNthCalledWith(2, "child2");

    options.onHide();
    expect(fn3).toBeCalledTimes(1);
  });

  test("merge custom options", () => {
    const mixins = [
      {
        foo: {
          bar: "baz",
        },
      },
    ];
    const options = {};

    useMixins(options, mixins);

    expect(options).toEqual({
      foo: {
        bar: "baz",
      },
    });
  });
});
