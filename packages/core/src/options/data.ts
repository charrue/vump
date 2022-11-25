import { DATA_KEY, EMPTY_OBJ, isFn, isObj, warn, isEmpty } from "@vump/shared";
import { ComponentInternalInstance } from "../instance";
import { reactive } from "@vue/reactivity";

export type DataOption = Record<string, any>;

export const initData = (
  instance: ComponentInternalInstance,
  dataOption?: DataOption,
  propKeys?: string[],
) => {
  // data默认是空对象
  instance[DATA_KEY] = reactive(EMPTY_OBJ);
  if (!dataOption || isEmpty(dataOption)) {
    instance.data = EMPTY_OBJ;
    return;
  }

  const data = isFn(dataOption) ? dataOption.call(instance) : dataOption;

  if (isObj(data)) {
    instance[DATA_KEY] = reactive(data);
    Object.keys(data).forEach((key) => {
      if (!propKeys?.includes(key)) {
        Object.defineProperty(instance, key, {
          configurable: true,
          enumerable: true,
          get: () => instance[DATA_KEY][key],
          set: (v: any) => {
            instance[DATA_KEY][key] = v;
          },
        });
      }
    });
  } else {
    warn(`data should return an object`);
  }
};
