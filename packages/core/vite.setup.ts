import { expect, beforeEach, afterEach, spyOn } from "vitest";
import type { SpyInstance } from "vitest";
import helper from "./tests/helper";

// @ts-ignore 处理vitest无法识别ComputedBehavior内`Behavior`对象的问题
global.Behavior = (definition) => helper.behavior(definition);

let warn: SpyInstance = spyOn(console, "warn");
const asserted: Set<string> = new Set();

expect.extend({
  toHaveBeenWarned(received: string) {
    asserted.add(received);
    const passed = warn.mock.calls.some((args) => args[0].includes(received));
    if (passed) {
      return {
        pass: true,
        message: () => `expected "${received}" not to have been warned.`,
      };
    }
    const msgs = warn.mock.calls.map((args) => args[0]).join("\n - ");
    return {
      pass: false,
      message: () =>
        `expected "${received}" to have been warned${
          msgs.length ? `.\n\nActual messages:\n\n - ${msgs}` : ` but no warning was recorded.`
        }`,
    };
  },

  toHaveBeenWarnedLast(received: string) {
    asserted.add(received);
    const passed = warn.mock.calls[warn.mock.calls.length - 1][0].includes(received);
    if (passed) {
      return {
        pass: true,
        message: () => `expected "${received}" not to have been warned last.`,
      };
    }
    const msgs = warn.mock.calls.map((args) => args[0]).join("\n - ");
    return {
      pass: false,
      message: () =>
        `expected "${received}" to have been warned last.\n\nActual messages:\n\n - ${msgs}`,
    };
  },

  toHaveBeenWarnedTimes(received: string, n: number) {
    asserted.add(received);
    let found = 0;
    warn.mock.calls.forEach((args) => {
      if (args[0].includes(received)) {
        found++;
      }
    });

    if (found === n) {
      return {
        pass: true,
        message: () => `expected "${received}" to have been warned ${n} times.`,
      };
    }
    return {
      pass: false,
      message: () => `expected "${received}" to have been warned ${n} times but got ${found}.`,
    };
  },
});

beforeEach(() => {
  asserted.clear();
  warn = spyOn(console, "warn");
  warn.mockImplementation(() => {
    //
  });
});

afterEach(() => {
  const assertedArray = Array.from(asserted);
  const nonAssertedWarnings = warn.mock.calls
    .map((args) => args[0])
    .filter((received) => {
      return !assertedArray.some((assertedMsg) => {
        return received.includes(assertedMsg);
      });
    });
  warn.mockRestore();
  if (nonAssertedWarnings.length) {
    throw new Error(
      `test case threw unexpected warnings:\n - ${nonAssertedWarnings.join("\n - ")}`,
    );
  }
});
