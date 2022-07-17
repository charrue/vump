import { describe, test, expect } from "vitest";
import helper from "./helper";

describe("createComponent", () => {
  test("use options: data & methods", async () => {
    const comp = helper.renderComponent("counter/index");
    const increaseDom = comp.querySelector("#increase")!;

    expect(comp.data.count).toBe(0);

    increaseDom.dispatchEvent("tap");
    await helper.sleep(300);
    expect(comp.data.count).toBe(1);

    increaseDom.dispatchEvent("tap");
    await helper.sleep(300);
    expect(comp.data.count).toBe(2);
  });

  test("use options: computed & watch", async () => {
    const comp = helper.renderComponent("counter/index");
    const increaseDom = comp.querySelector("#increase")!;
    const decreaseDom = comp.querySelector("#decrease")!;

    expect(comp.data.count).toBe(0);
    expect(comp.data.sign).toBe("");
    expect(comp.data.nextCount).toBe(1);

    increaseDom.dispatchEvent("tap");

    await helper.sleep(300);
    expect(comp.data.count).toBe(1);
    expect(comp.data.sign).toBe("+");
    expect(comp.data.nextCount).toBe(2);

    decreaseDom.dispatchEvent("tap");
    decreaseDom.dispatchEvent("tap");

    await helper.sleep(300);
    expect(comp.data.count).toBe(-1);
    expect(comp.data.sign).toBe("-");
    expect(comp.data.nextCount).toBe(0);
  });
});
