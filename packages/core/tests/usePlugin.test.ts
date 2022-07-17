import { describe, test, expect } from "vitest";
import { getPlugins } from "../dist";
import helper from "./helper";

describe("usePlugin", () => {
  test("plugin worked & plugin order", async () => {
    const comp = helper.renderComponent("plugin/index");

    expect(comp.data.dataFromPlugin).toBe("dataFromPlugin");

    const plugins = getPlugins();
    expect(plugins.findIndex((t) => t.name === "foo")).toBe(0);
    expect(plugins.findIndex((t) => t.name === "bar")).toBe(2);
  });
});
