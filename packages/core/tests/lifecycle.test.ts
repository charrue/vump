import { describe, test, vi, expect } from "vitest";
import { onCreated, onAttached, onReady, onDetached, onShow, onMounted } from "../src/index";
import { createComponent, loadComponent } from "./helper";

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

  // 无法触发Page的生命周期
  test.skip("lifecycle call order", () => {
    const calls: string[] = [];

    const componentId = loadComponent({
      setup() {
        onCreated(() => {
          calls.push("component created");
        });
        onAttached(() => {
          calls.push("component attached");
        });
        onReady(() => {
          calls.push("component ready");
        });
        onDetached(() => {
          calls.push("component detached");
        });

        return {};
      },
    });

    createComponent(
      {
        template: "<child>123</child>",
        setup() {
          console.log(111);
          onShow(() => {
            calls.push("page show");
          });
          onMounted(() => {
            calls.push("page loaded");
          });

          return {};
        },
        usingComponents: {
          child: componentId, // 声明要使用的组件，传入组件 id
        },
      },
      true,
    );

    console.log(calls);
    expect(calls).toEqual(["component created", "component attached", "page loaded", "page show"]);
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
