import { describe, test, vi, expect } from "vitest";
import { onCreated } from "../src/index";
import { createComponent } from "./helper";

describe("common", () => {
  test("async callback", () => {
    createComponent({
      setup() {
        onCreated(async () => {
          const res = await Promise.resolve(1);
          expect(res).toBe(1);
        });
        return {};
      },
    });
  });

  test("return undefined", () => {
    createComponent({
      setup() {
        const res = onCreated(async () => {
          return 1;
        });
        expect(res).toBe(undefined);
        return {};
      },
    });
  });
});

describe("onCreated", () => {
  test("work in component", () => {
    const fn = vi.fn();
    createComponent({
      setup() {
        onCreated(() => {
          fn();
        });
        return {};
      },
    });

    expect(fn).toBeCalledTimes(1);
  });

  test("don't work in page", () => {
    const fn = vi.fn();
    createComponent(
      {
        setup() {
          onCreated(() => {
            fn();
          });
          return {};
        },
      },
      true,
    );

    expect(fn).toBeCalledTimes(0);
  });
});
