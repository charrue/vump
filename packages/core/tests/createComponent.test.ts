import { describe, test, expect } from "vitest";
import helper from "./helper";

describe("createComponent", () => {
  test("use options: data & methods & computed", async () => {
    const comp = helper.renderComponent("counter/index");
    const increaseDom = comp.querySelector("#increase");
    const decreaseDom = comp.querySelector("#decrease");

    expect(comp.data.count).toBe(0);
    expect(comp.data.sign).toBe("");

    increaseDom.dispatchEvent("tap");

    await helper.sleep(300);
    expect(comp.data.count).toBe(1);
    expect(comp.data.sign).toBe("+");

    decreaseDom.dispatchEvent("tap");
    decreaseDom.dispatchEvent("tap");

    await helper.sleep(300);
    expect(comp.data.count).toBe(-1);
    expect(comp.data.sign).toBe("-");
  });
});
