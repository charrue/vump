import { proxyRefs } from "@vue/reactivity";
import { describe, expect, test, vi } from "vitest";
import { COMPUTED_KEY } from "../src/instance";
import { createComponent } from "./helper";
import { nextTick } from "../src/scheduler";

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
  });

  test("with setter", () => {
    const { instance } = createComponent({
      data: {
        a: 1,
      },
      computed: {
        b: {
          get(this: any) {
            return this.a + 1;
          },
          set(this: any, v: number) {
            this.a = v - 1;
          },
        },
      },
    });

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
          set(this: any, v: number) {
            this.a = v;
          },
        },
      },
    });

    // eslint-disable-next-line no-unused-expressions, @typescript-eslint/no-unused-expressions
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

    // 与vue不同，computed至少会被执行一次
    // 在组件attached阶段将computed的值setData
    expect(spy).toBeCalledTimes(1);

    expect(instance.b).toBe(2);
    expect(spy).toBeCalledTimes(1);

    expect(instance.b).toBe(2);
    expect(spy).toBeCalledTimes(1);
  });

  test("should call setData", async () => {
    const { instance, setDataSpy, component } = createComponent({
      template: "<view>{{ a }} {{ b }}</view>",
      data: {
        a: 1,
      },
      computed: {
        b() {
          return this.a + 1;
        },
      },
    });
    expect(setDataSpy).toHaveBeenCalledTimes(1);
    expect(setDataSpy).toHaveBeenCalledWith({ b: 2 });
    expect(component.dom?.innerHTML).toBe("<wx-view>1 2</wx-view>");

    instance.a = 2;
    expect(component.dom?.innerHTML).toBe("<wx-view>1 2</wx-view>");
    await nextTick();
    expect(setDataSpy).toHaveBeenCalledTimes(2);
    expect(setDataSpy).toHaveBeenCalledWith({ a: 2, b: 3 });
    expect(component.dom?.innerHTML).toBe("<wx-view>2 3</wx-view>");
  });

  // warn conflict with data
  // warn conflict with props
  // warn conflict with methods
});
