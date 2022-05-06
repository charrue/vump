import { describe, expect, test } from "vitest";
import { createComponent } from "../src/createFactory";

describe("createComponent", () => {
  test("should have default option", () => {
    const component = createComponent({});

    expect(component).toHaveProperty("data", {});
    expect(component).toHaveProperty("methods", {});
  });

  test("computed behavior success load", () => {
    const component = createComponent({});

    expect(component).toHaveProperty("behaviors.length", 1);
  });
});
