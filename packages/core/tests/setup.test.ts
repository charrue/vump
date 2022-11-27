import { describe, expect, test } from "vitest";
import { ref, reactive, proxyRefs, computed } from "@vue/reactivity";
import { SETUP_REACTIVE_KEY } from "../src/helper/index";
import { nextTick } from "../src/scheduler";
import { createComponent } from "./helper";

describe("option setup", () => {
  test("data is object", () => {
    const { instance } = createComponent({
      setup() {
        const refValue = ref("foo");
        const computedValue = computed(() => {
          return `__${refValue.value}__`;
        });
        return {
          ref: refValue,
          computed: computedValue,
          object: reactive({ msg: "bar" }),
          value: "baz",
        };
      },
    });

    expect(proxyRefs(instance[SETUP_REACTIVE_KEY])).toEqual({
      ref: "foo",
      computed: "__foo__",
      object: {
        msg: "bar",
      },
      value: "baz",
    });

    expect(instance.ref).toBe("foo");
    expect(instance.computed).toBe("__foo__");
    expect(instance.object).toEqual({ msg: "bar" });
    expect(instance.value).toBe("baz");

    instance.ref = "bar";

    expect(proxyRefs(instance[SETUP_REACTIVE_KEY])).toEqual({
      ref: "bar",
      computed: "__bar__",
      object: {
        msg: "bar",
      },
      value: "baz",
    });
    expect(instance.ref).toBe("bar");
    expect(instance.computed).toBe("__bar__");
  });

  test("should call setData", async () => {
    const { instance, setDataSpy, component } = createComponent({
      template: "<view>{{ computed }} {{ object.msg }}</view>",
      setup() {
        const refValue = ref("foo");
        const computedValue = computed(() => {
          return `__${refValue.value}__`;
        });
        return {
          ref: refValue,
          computed: computedValue,
          object: reactive({ msg: "bar" }),
          value: "baz",
        };
      },
    });
    expect(setDataSpy).toHaveBeenCalledTimes(1);
    expect(setDataSpy).toHaveBeenCalledWith({
      ref: "foo",
      computed: "__foo__",
      object: {
        msg: "bar",
      },
      value: "baz",
    });
    expect(component.dom?.innerHTML).toBe("<wx-view>__foo__ bar</wx-view>");

    instance.ref = "bar";
    expect(component.dom?.innerHTML).toBe("<wx-view>__foo__ bar</wx-view>");
    await nextTick();
    expect(setDataSpy).toHaveBeenCalledTimes(2);
    expect(setDataSpy).toHaveBeenCalledWith({ ref: "bar", computed: "__bar__" });
    expect(component.dom?.innerHTML).toBe("<wx-view>__bar__ bar</wx-view>");
  });
  // should have access to props
  // should have access to methods
});
