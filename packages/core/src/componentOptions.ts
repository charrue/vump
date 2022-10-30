import {
  computed,
  ComputedGetter,
  ComputedSetter,
  effect,
  effectScope,
  proxyRefs,
  reactive,
  WritableComputedRef,
} from "@vue/reactivity";
import { watch } from "@vue-reactivity/watch";
import { EMPTY_OBJ, isFn, isObj, isPlainObj, isStr, warn } from "./helper/utils";
import { ComponentInternalInstance, COMPUTED_KEY, DATA_KEY } from "./instance";
import { ComponentOptions, ObjectWatchOptionItem, WatchCallback } from "./types/componentOptions";
import { queueJob } from "./scheduler";
import { diffData } from "./diff/index";

const initData = (instance: ComponentInternalInstance, dataOption: ComponentOptions["data"]) => {
  // data默认是空对象
  instance.data = EMPTY_OBJ;
  instance[DATA_KEY] = reactive(EMPTY_OBJ);
  if (!dataOption) {
    return;
  }

  const data = isFn(dataOption) ? dataOption.call(instance, instance) : dataOption;

  if (isObj(data)) {
    // instance.data = data;
    instance[DATA_KEY] = reactive(data);
    Object.keys(data).forEach((key) => {
      Object.defineProperty(instance, key, {
        configurable: true,
        enumerable: true,
        get: () => instance[DATA_KEY][key],
        set: (v: any) => {
          instance[DATA_KEY][key] = v;
        },
      });
    });
  } else {
    warn(`data should return an object`);
  }
};

const initComputed = (
  instance: ComponentInternalInstance,
  computedOption: ComponentOptions["computed"],
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

const createPathGetter = (ctx: any, path: string) => {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
};

const initWatch = (instance: ComponentInternalInstance, watchOption: ComponentOptions["watch"]) => {
  if (!watchOption) {
    return;
  }

  Object.keys(watchOption).forEach((key) => {
    const watchValue = watchOption[key];

    const getter = key.includes(".") ? createPathGetter(instance, key) : () => instance[key];

    if (isStr(watchValue)) {
      const handler = instance[watchValue];
      if (isFn(handler)) {
        watch(getter, handler.bind(instance));
      } else {
        warn(`Invalid watch handler specified by key "${watchValue}"`, handler);
      }
    }

    if (isFn(watchValue)) {
      watch(getter, watchValue.bind(instance));
    }

    if (isPlainObj(watchValue)) {
      const {
        deep = false,
        immediate = false,
        onTrack,
        onTrigger,
      } = watchValue as ObjectWatchOptionItem;
      let { handler } = watchValue;
      if (isFn(handler)) {
        handler = handler.bind(instance);
      } else {
        handler = instance[handler as string] as WatchCallback;
      }

      if (isFn(handler)) {
        watch<any, boolean>(getter, handler.bind(instance), {
          deep,
          immediate,
          onTrack,
          onTrigger,
        });
      } else {
        warn(`Invalid watch handler specified by key "${watchValue.handler}"`, handler);
      }
    }
  });
};

const createComponentLifetimes = () => {
  let defFields = {} as ComponentOptions;
  const scope = effectScope();

  function definitionFilter(fields: ComponentOptions) {
    defFields = fields;
  }
  function created(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;
    context.isCreated = true;
    context.isAttached = false;
    context.isDetached = false;

    scope.run(() => {
      initData(context, defFields.data);
      initComputed(context, defFields.computed);
      initWatch(context, defFields.watch);
    });
  }
  function attached(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;
    context.isAttached = true;

    const fn = effect(
      () => {
        // 此处相较Vue不同的是
        // Vue中的computed是在访问的时候才会运算一次
        // 这里computed至少会执行一次
        const currentData = {
          ...context[DATA_KEY],
          ...proxyRefs(context[COMPUTED_KEY]),
        };
        const updateValue = diffData(currentData, context.data);

        context.setData(updateValue);
      },
      {
        scheduler: () => queueJob(fn),
      },
    ) as () => void;
  }

  function detached(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;

    context.isDetached = true;
    scope.stop();
  }

  return {
    lifetimes: {
      created,
      attached,
      detached,
    },
    definitionFilter,
  };
};

export const vumpDefaultBehavior = Behavior(createComponentLifetimes());
