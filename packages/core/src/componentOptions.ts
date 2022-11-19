import {
  computed,
  ComputedGetter,
  ComputedSetter,
  effect,
  effectScope,
  pauseTracking,
  proxyRefs,
  reactive,
  resetTracking,
  unref,
  WritableComputedRef,
} from "@vue/reactivity";
import { watch } from "@vue-reactivity/watch";
import {
  EMPTY_OBJ,
  isFn,
  isObj,
  isPlainObj,
  isStr,
  warn,
  DATA_KEY,
  COMPUTED_KEY,
  SETUP_KEY,
  SETUP_REACTIVE_KEY,
  SCOPE_KEY,
  IS_PAGE_KEY,
  HOOK_KEY,
  isEmpty,
} from "@vump/shared";
import { ComponentInternalInstance, setCurrentInstance, unsetCurrentInstance } from "./instance";
import { ObjectWatchOptionItem, WatchCallback } from "./types/watch";
import { VumpFactory } from "./types/vump";
import { queueJob } from "./scheduler";
import { diffData } from "./diff/index";
import { callHook } from "./lifecycle/callHook";
import { LifecycleHooks } from "./lifecycle";

const initData = (
  instance: ComponentInternalInstance,
  dataOption: VumpFactory.ComponentOptions["data"],
) => {
  // data默认是空对象
  instance[DATA_KEY] = reactive(EMPTY_OBJ);
  if (!dataOption) {
    instance.data = EMPTY_OBJ;
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
  computedOption: VumpFactory.ComponentOptions["computed"],
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

const initWatch = (
  instance: ComponentInternalInstance,
  watchOption: VumpFactory.ComponentOptions["watch"],
) => {
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

const initSetup = (
  instance: ComponentInternalInstance,
  setupOption: VumpFactory.ComponentOptions["setup"],
) => {
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

const vueStyleBehavior = (isPage: boolean) => {
  let defFields = {} as VumpFactory.ComponentOptions;

  function definitionFilter(fields: VumpFactory.IAnyObject) {
    defFields = fields as unknown as VumpFactory.ComponentOptions;
  }
  function created(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;
    context[IS_PAGE_KEY] = isPage;
    context[HOOK_KEY] = {
      [LifecycleHooks.COMPONENT_CREATED]: null,
      [LifecycleHooks.COMPONENT_ATTACHED]: null,
      [LifecycleHooks.COMPONENT_READY]: null,
      [LifecycleHooks.COMPONENT_MOVED]: null,
      [LifecycleHooks.COMPONENT_DETACHED]: null,
      [LifecycleHooks.COMPONENT_ERROR]: null,
      [LifecycleHooks.SHOW]: null,
      [LifecycleHooks.PAGE_READY]: null,
      [LifecycleHooks.LOADED]: null,
      [LifecycleHooks.HIDE]: null,
      [LifecycleHooks.UNLOADED]: null,
      [LifecycleHooks.PULL_DOWN_REFRESH]: null,
      [LifecycleHooks.REACH_BOTTOM]: null,
      [LifecycleHooks.SHARE_APP_MESSAGE]: null,
      [LifecycleHooks.SHARE_TIMELINE]: null,
      [LifecycleHooks.ADD_TO_FAVORITES]: null,
      [LifecycleHooks.TAB_ITEM_TAP]: null,
      [LifecycleHooks.PAGE_SCROLL]: null,
      [LifecycleHooks.PAGE_RESIZE]: null,
      [LifecycleHooks.SAVE_EXIT_STATE]: null,
    };
    context.isCreated = true;
    context.isAttached = false;
    context.isDetached = false;

    // effectScope 每次实例化时，都需要更新
    // 因为effectScope.off之后，就不会再捕获effect
    const scope = effectScope();
    context[SCOPE_KEY] = scope;
    setCurrentInstance(context);

    scope.run(() => {
      initData(context, defFields.data);
      initComputed(context, defFields.computed);
      initWatch(context, defFields.watch);
      pauseTracking();
      initSetup(context, defFields.setup);
      resetTracking();
    });
    if (!isPage) {
      callHook(context, LifecycleHooks.COMPONENT_CREATED);
    }

    unsetCurrentInstance();
  }
  function attached(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;
    context.isCreated = true;
    context.isAttached = true;
    context.isDetached = false;

    const fn = effect(
      () => {
        if (!context.isAttached) {
          warn("you cannot setData before component attached");
          return;
        }
        // 此处相较Vue不同的是
        // Vue中的computed是在访问的时候才会运算一次
        // 这里computed至少会执行一次

        let currentData = context[DATA_KEY];
        if (!isEmpty(context[COMPUTED_KEY])) {
          currentData = {
            ...currentData,
            ...proxyRefs(context[COMPUTED_KEY]),
          };
        }
        if (!isEmpty(context[SETUP_REACTIVE_KEY])) {
          currentData = {
            ...currentData,
            ...proxyRefs(context[SETUP_REACTIVE_KEY]),
          };
        }
        const updateValue = diffData(currentData, context.data);

        context.setData(updateValue);
      },
      {
        scheduler: () => queueJob(fn),
      },
    ) as () => void;

    if (!isPage) {
      callHook(context, LifecycleHooks.COMPONENT_ATTACHED);
    }
  }

  function detached(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;

    context.isCreated = true;
    context.isAttached = true;
    context.isDetached = true;

    if (context[SCOPE_KEY]) {
      context[SCOPE_KEY].stop();
    }

    if (!isPage) {
      callHook(context, LifecycleHooks.COMPONENT_DETACHED);
    }
  }

  function moved(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;
    if (!isPage) {
      callHook(context, LifecycleHooks.COMPONENT_MOVED);
    }
  }

  function errorLifetime(this: unknown) {
    const context = this as unknown as ComponentInternalInstance;
    if (!isPage) {
      callHook(context, LifecycleHooks.COMPONENT_MOVED);
    }
  }

  const otherOptions: Record<string, any> = {};
  if (isPage) {
    otherOptions.methods = {
      onShow(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.SHOW);
      },
      onLoad(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.LOADED);
      },
      onReady(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.PAGE_READY);
      },
      onHide(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.HIDE);
      },
      onUnload(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.UNLOADED);
      },
      onPullDownRefresh(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.PULL_DOWN_REFRESH);
      },
      onReachBottom(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.REACH_BOTTOM);
      },
      onShareAppMessage(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        const hookResult = callHook(context, LifecycleHooks.SHARE_APP_MESSAGE);
        if (hookResult) {
          return hookResult;
        }
      },
      onShareTimeline(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        const hookResult = callHook(context, LifecycleHooks.SHARE_TIMELINE);
        if (hookResult) {
          return hookResult;
        }
      },
      onAddToFavorites(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        const hookResult = callHook(context, LifecycleHooks.ADD_TO_FAVORITES);
        if (hookResult) {
          return hookResult;
        }
      },
      onPageScroll(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.PAGE_SCROLL);
      },
      onResize(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.PAGE_RESIZE);
      },
      onTabItemTap(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.TAB_ITEM_TAP);
      },
      onSaveExitState(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.SAVE_EXIT_STATE);
      },
    };
  }

  return {
    lifetimes: {
      created,
      attached,
      moved,
      detached,
      error: errorLifetime,
    },
    definitionFilter,
    ...otherOptions,
  };
};

export const createVueStyleBehavior = (isPage: boolean) => Behavior(vueStyleBehavior(isPage));
