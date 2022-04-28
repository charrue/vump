import { test, expect, describe, fn } from "vitest";
import { useMixins } from "./../src/mixin/useMixin";

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
    const fn1 = fn();
    const fn2 = fn();
    const fn3 = fn();
    const fn4 = fn();

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
          log: fn1,
          log2: fn2,
        },
      },
      {
        methods: {
          log3: fn4,
        },
      },
    ];

    const options = {
      data: {
        name: "vump",
        language: "typescript",
      },
      methods: {
        log2: fn3,
      },
    };

    useMixins(options, mixins);
  });
});
