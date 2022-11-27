import { describe, test, expect } from "vitest";
import { createComponent, loadComponent } from "./helper";

describe("props options", () => {
  test("default value", () => {
    createComponent({
      props: {
        foo: String,
        bar: {
          type: Number,
          default: 1,
        },
        baz: {
          type: [Number, String, Array],
          default() {
            return [];
          },
        },
      },
      setup(props) {
        expect(props).toEqual({
          bar: 1,
          baz: [],
        });

        return {};
      },
    });
  });

  test.only("pass prop", () => {
    const componentId = loadComponent({
      props: {
        foo: String,
        bar: {
          type: Number,
          default: 1,
        },
        baz: {
          type: [Number, String, Array],
          default() {
            return [];
          },
        },
      },
      setup(props) {
        console.log(props);

        return {};
      },
    });

    createComponent({
      usingComponents: {
        child: componentId, // 声明要使用的组件，传入组件 id
      },
      template: "<child foo='foo' bar='{{ 100 }}'></child>",
      setup() {
        return {};
      },
    });
  });
});
