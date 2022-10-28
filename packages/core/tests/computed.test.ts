import { proxyRefs } from "@vue/reactivity";
import { describe, expect, test, vi } from "vitest";
import { COMPUTED_KEY } from "../src/instance";
import { createComponent } from "./helper";

describe("computed option", () => {
  test("basic usage", () => {
    const { instance } = createComponent({
      data: {
        a: 1,
      },
      computed: {
        b() {
          return this.a + 1;
        },
      },
    });

    expect(instance.b).toBe(2);
    expect(proxyRefs(instance[COMPUTED_KEY])).toEqual({
      b: 2,
    });

    instance.a = 2;
    expect(instance.b).toBe(3);
    expect(proxyRefs(instance[COMPUTED_KEY])).toEqual({
      b: 3,
    });

    // TODO: DOM上的渲染
  });

  test("with setter", () => {
    const component = createComponent({
      data: {
        a: 1,
      },
      computed: {
        b: {
          get() {
            return this.a + 1;
          },
          set(v) {
            this.a = v - 1;
          },
        },
      },
    });

    const { instance } = component.instance as any;

    expect(instance.b).toBe(2);
    instance.a = 2;
    expect(instance.b).toBe(3);
    instance.b = 1;
    expect(instance.a).toBe(0);
  });

  test("warn with setter and no getter", () => {
    const { instance } = createComponent({
      data: {
        a: 1,
      },
      computed: {
        b: {
          set(v) {
            this.a = v;
          },
        },
      },
    });

    // eslint-disable-next-line no-unused-expressions
    instance.b;

    expect(`Computed property "b" has no getter.`).toHaveBeenWarned();
  });

  test("warn assigning to computed with no setter", () => {
    const { instance } = createComponent({
      data: {
        a: 1,
      },
      computed: {
        b() {
          return 1;
        },
      },
    });

    instance.b = 2;
    expect(`Write operation failed: computed property "b" is readonly.`).toHaveBeenWarned();
  });

  test("caching", () => {
    const spy = vi.fn();
    const { instance } = createComponent({
      data: {
        a: 1,
      },
      computed: {
        b() {
          spy();
          return this.a + 1;
        },
      },
    });

    expect(spy).toBeCalledTimes(0);

    expect(instance.b).toBe(2);
    expect(spy).toBeCalledTimes(1);

    expect(instance.b).toBe(2);
    expect(spy).toBeCalledTimes(1);
  });
  // warn conflict with data
  // warn conflict with props
  // warn conflict with methods
});
