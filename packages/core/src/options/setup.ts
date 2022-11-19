import { SETUP_KEY, SETUP_REACTIVE_KEY, warn, isFn, isObj } from "@vump/shared";
import { reactive, unref } from "@vue/reactivity";
import { ComponentInternalInstance } from "../instance";

export interface SetupContext {
  emit: (name: string, ...args: any[]) => void;
}
export type SetupOption = (
  props: Readonly<Record<string, any>>,
  ctx: SetupContext,
) => Record<string, any>;

export const initSetup = (instance: ComponentInternalInstance, setupOption?: SetupOption) => {
  if (!setupOption) {
    return;
  }

  if (setupOption && !isFn(setupOption)) {
    warn(`setup() should be a function`);
    return;
  }
  const props = {};
  const setupState = setupOption.call(instance, props, { emit: instance.triggerEvent });
  if (!isObj(setupState)) {
    warn(
      `setup() should return an object. Received: ${
        setupState === null ? "null" : typeof setupState
      }`,
    );
    return;
  }
  instance[SETUP_KEY] = setupState;

  const reactiveData = reactive<Record<string, any>>({});

  Object.keys(setupState).forEach((k) => {
    const val = setupState[k];
    if (typeof val === "function") {
      instance[k] = val;
    } else {
      reactiveData[k] = val;

      Object.defineProperty(instance, k, {
        enumerable: true,
        configurable: true,
        get: () => unref(val),
        set: (v) => {
          // c.value = v;
          reactiveData[k] = v;
        },
      });
    }
  });

  instance[SETUP_REACTIVE_KEY] = reactiveData;
};
