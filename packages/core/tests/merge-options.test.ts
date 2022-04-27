import { test, expect, describe, fn } from "vitest";
import {
  mergeDataOptions,
  mergeMethodOptions,
  mergeMethodsToArray,
  mergeLifecycleOptions,
} from "./../src/merge-options";

describe("use mergeDataOptions", () => {
  test("two objects have different key names", () => {
    const obj1 = {
      name: "vump",
      language: "typescript",
    };
    const obj2 = {
      version: "0.0.1",
    };
    expect(mergeDataOptions(obj1, obj2)).toEqual({
      ...obj1,
      ...obj2,
    });
  });

  test("two objects have partially identical key names", () => {
    const obj1 = {
      name: "vump",
      language: "typescript",
      version: "1.0.0",
    };
    const obj2 = {
      language: "javascript",
      version: "0.0.1",
      issues: 10,
    };
    expect(mergeDataOptions(obj1, obj2)).toEqual({
      ...obj1,
      issues: 10,
    });
  });

  test("two objects have same key names", () => {
    const obj1 = {
      name: "vump",
      language: "typescript",
      version: "1.0.0",
    };
    const obj2 = {
      name: "vump",
      language: "javascript",
      version: "0.0.1",
    };
    expect(mergeDataOptions(obj1, obj2)).toEqual({
      ...obj1,
    });
  });
});

describe("use mergeMethodOptions", () => {
  test("same as mergeDataOptions", () => {
    const fn1 = fn(() => 1);
    const fn2 = fn(() => 2);
    const fn3 = fn(() => 3);
    const obj1 = {
      fun1: fn1,
      fun2: fn2,
    };
    const obj2 = {
      fun3: fn3,
      fun2: fn3,
    };

    const merged = mergeMethodOptions(obj1, obj2);
    expect(merged).toEqual({
      ...obj1,
      fun3: obj2.fun3,
    });

    merged.fun2();
    expect(fn2).toHaveBeenCalled();
    expect(fn3).not.toHaveBeenCalled();
  });

  test("should ignore lifecycle methods", () => {
    const fn1 = fn(() => 1);
    const fn2 = fn(() => 2);
    const fn3 = fn(() => 3);
    const obj1 = {
      fun1: fn1,
      onLoad: fn2,
      onShareAppMessage: fn3,
      created: fn3,
    };

    const obj2 = {
      fun3: fn3,
      created: fn3,
    };

    expect(mergeMethodOptions(obj1, obj2)).toEqual({
      fun1: fn1,
      fun3: fn3,
    });
  });
});

describe("use mergeLifecycleOptions", () => {
  test("mergeMethodsToArray should merge functions of the same name into an array", () => {
    const fn1 = fn(() => 1);
    const fn2 = fn(() => 2);
    const fn3 = fn(() => 3);
    const fn4 = fn(() => 4);

    const obj1 = {
      fn1,
      fn2,
    };
    const obj2 = {
      fn1: fn3,
      fn4,
    };

    const merged = mergeMethodsToArray(obj1, obj2);
    expect(merged).toEqual({
      fn1: [obj1.fn1, obj2.fn1],
      fn2: [obj1.fn2],
      fn4: [obj2.fn4],
    });

    merged.fn1.forEach((fn) => {
      fn();
    });
    expect(fn1).toHaveBeenCalled();
    expect(fn3).toHaveBeenCalled();
  });

  describe("use mergeLifecycleOptions", () => {
    const fn1 = fn(() => 1);
    const fn2 = fn(() => 2);
    const fn3 = fn(() => 3);
    const obj1 = {
      fun1: fn1,
      onLoad: fn2,
      onShareAppMessage: fn3,
      created: fn1,
    };

    const obj2 = {
      fun3: fn3,
      created: fn1,
    };
    const merged = mergeLifecycleOptions(obj1, obj2);

    test("should only have lifecycle functions", () => {
      expect(Object.keys(merged).sort()).toEqual(["onLoad", "onShareAppMessage", "created"].sort());
    });

    test("same lifecycle functions should composed", () => {
      merged.onLoad();
      expect(fn2).toHaveBeenCalled();
      merged.onShareAppMessage();
      expect(fn3).toHaveBeenCalled();
      merged.created();
      expect(fn1).toHaveBeenCalledTimes(2);
    });
  });
});
