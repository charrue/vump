/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, test, expect, afterEach } from "vitest";
import helper from "./helper";

const FooRawValue = 1;
const UserRawValue = { name: "dnt", age: 18, sex: 1 };

describe("diffUpdate", () => {
  const comp = helper.renderComponent("HelloWorld/index");

  afterEach(() => {
    comp.instance.reset();
  });

  const expectInnerText = async (selector: string, value: string | undefined | null) => {
    await helper.sleep(100);
    const dom = comp.querySelector(selector)!;

    expect(dom.dom?.innerHTML).toEqual(value);
  };

  const expectFooUpdate = async (newValue: any) => {
    expect(comp.data.foo).toBe(FooRawValue);
    comp.instance.diffUpdate({
      foo: newValue,
    });

    expect(comp.data.foo).toBe(newValue);
    await expectInnerText("#foo", `${newValue}`);
  };

  const expectUserUpdate = async (newValue: any) => {
    expect(comp.data.user).toEqual(UserRawValue);
    comp.instance.diffUpdate({
      user: newValue,
    });

    expect(comp.data.user).toEqual(newValue);
    await expectInnerText("#user", JSON.stringify(newValue));
  };

  test("have diffUpdate method", () => {
    expect(comp.instance.diffUpdate).toBeDefined();
  });

  test("same value", async () => {
    await expectFooUpdate(FooRawValue);
  });

  test("update value", async () => {
    await expectFooUpdate(2);
  });

  test("delete value", async () => {
    expect(comp.data.foo).toBe(FooRawValue);
    comp.instance.diffUpdate({
      foo: undefined,
    });

    expect(comp.data.foo).toBe(null);
    await expectInnerText("#foo", "");
  });

  test("add value", async () => {
    expect(comp.data.bar).toBe(undefined);
    comp.instance.diffUpdate({
      bar: 100,
    });

    expect(comp.data.bar).toBe(100);
    await expectInnerText("#bar", "100");
  });

  test("update deep value", async () => {
    await expectUserUpdate({
      ...UserRawValue,
      name: "kevin",
    });
  });

  test("delete deep value", async () => {
    await expectUserUpdate({
      ...UserRawValue,
      name: undefined,
    });
  });

  test("add deep value", async () => {
    await expectUserUpdate({
      ...UserRawValue,
      happy: true,
      address: {
        country: "china",
        city: "beijing",
      },
    });
  });
});
