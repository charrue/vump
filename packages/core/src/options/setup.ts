import { SETUP_KEY, SETUP_REACTIVE_KEY, PROP_KEY, warn, isFn, isObj } from "@vump/shared";
import { reactive, readonly, unref } from "@vue/reactivity";
import { ComponentInternalInstance } from "../instance";
import { EmitFn, EmitsOption } from "./emits";
import { ExtractPropTypes, PropsOption } from "./props";

export interface SetupContext<E> {
  emit: EmitFn<E>;
}

export type SetupOption<T extends PropsOption = PropsOption, E = EmitsOption> = (
  props: Readonly<ExtractPropTypes<T>>,
  ctx: SetupContext<E>,
) => Record<string, any>;

export const initSetup = (instance: ComponentInternalInstance, setupOption?: SetupOption) => {
  if (!setupOption) {
    return;
  }

  if (setupOption && !isFn(setupOption)) {
    warn(`setup() should be a function`);
    return;
  }

  const emit: EmitFn = instance.triggerEvent;

  const propsValues = readonly(instance[PROP_KEY]);

  const setupState = setupOption.call(instance, propsValues, { emit });
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
          reactiveData[k] = v;
        },
      });
    }
  });

  instance[SETUP_REACTIVE_KEY] = reactiveData;
};
