import { COMPUTED_KEY, isFn, warn } from "../helper/index";
import { computed } from "@charrue/reactivity";
import type {
  ComputedGetter,
  WritableComputedRef,
  ComputedSetter,
  WritableComputedOptions,
} from "@charrue/reactivity";
import { ComponentInternalInstance } from "../instance";

export type ComputedOption = Record<string, ComputedGetter<any> | WritableComputedOptions<any>>;

export const initComputed = (
  instance: ComponentInternalInstance,
  computedOption?: ComputedOption,
) => {
  const bindingComputedData: Record<string, WritableComputedRef<any>> = {};

  if (!computedOption) {
    instance[COMPUTED_KEY] = bindingComputedData;
    return;
  }

  Object.keys(computedOption).forEach((k: string) => {
    const computedValue = computedOption[k];
    let getter: ComputedGetter<any> = () => warn(`Computed property "${k}" has no getter.`);

    if (isFn(computedValue)) {
      getter = computedValue.bind(instance, instance);
    } else if (isFn(computedValue.get)) {
      getter = computedValue.get.bind(instance, instance);
    }

    let setter: ComputedSetter<any> = () =>
      warn(`Write operation failed: computed property "${k}" is readonly.`);
    if (!isFn(computedValue) && isFn(computedValue.set)) {
      setter = computedValue.set.bind(instance);
    }

    const c = computed({
      get: getter,
      set: setter,
    });

    bindingComputedData[k] = c;
    Object.defineProperty(instance, k, {
      enumerable: true,
      configurable: true,
      get: () => c.value,
      set: (v) => {
        c.value = v;
      },
    });
  });

  instance[COMPUTED_KEY] = bindingComputedData;
};
