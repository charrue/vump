import { effect, effectScope, pauseTracking, proxyRefs, resetTracking } from "@vue/reactivity";
import {
  warn,
  DATA_KEY,
  COMPUTED_KEY,
  SETUP_REACTIVE_KEY,
  PROP_KEY,
  SCOPE_KEY,
  IS_PAGE_KEY,
  HOOK_KEY,
  isEmpty,
} from "@vump/shared";
import { ComponentInternalInstance, setCurrentInstance, unsetCurrentInstance } from "../instance";
import { queueJob } from "../scheduler";
import { diffData } from "../diff/index";
import { initData } from "./data";
import { initComputed } from "./computed";
import { initWatch } from "./watch";
import { initSetup } from "./setup";
import { LifecycleHooks } from "../lifecycle/index";
import { callHook } from "../lifecycle/callHook";
import { ComponentOptions } from "./types";
import { initProps } from "./props";

const vueStyleBehavior = (isPage: boolean) => {
  let defFields = {} as ComponentOptions;

  function definitionFilter(fields: Record<string, any>) {
    defFields = fields as unknown as ComponentOptions;
    initProps(defFields);
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

    const propKeys = defFields.props ? Object.keys(defFields.props) : [];

    scope.run(() => {
      if (defFields[PROP_KEY]) {
        context[PROP_KEY] = defFields[PROP_KEY];
        delete defFields[PROP_KEY];
      }

      initData(context, defFields.data, propKeys);
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
      onLoad(this: unknown, query: Record<string, string | undefined>) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.LOADED, query);
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
      onShareAppMessage(this: unknown, options: WechatMiniprogram.Page.IShareAppMessageOption) {
        const context = this as unknown as ComponentInternalInstance;
        const hookResult = callHook(context, LifecycleHooks.SHARE_APP_MESSAGE, options);
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
      onAddToFavorites(this: unknown, options: WechatMiniprogram.Page.IAddToFavoritesOption) {
        const context = this as unknown as ComponentInternalInstance;
        const hookResult = callHook(context, LifecycleHooks.ADD_TO_FAVORITES, options);
        if (hookResult) {
          return hookResult;
        }
      },
      onPageScroll(this: unknown, options: WechatMiniprogram.Page.IPageScrollOption) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.PAGE_SCROLL, options);
      },
      onResize(this: unknown, options: WechatMiniprogram.Page.IResizeOption) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.PAGE_RESIZE, options);
      },
      onTabItemTap(this: unknown, options: WechatMiniprogram.Page.ITabItemTapOption) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.TAB_ITEM_TAP, options);
      },
      onSaveExitState(this: unknown) {
        const context = this as unknown as ComponentInternalInstance;
        callHook(context, LifecycleHooks.SAVE_EXIT_STATE);
      },
    };
  }

  const options: WechatMiniprogram.Component.Options<any, any, any> = {
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

  return options;
};

export const createVueStyleBehavior = (isPage: boolean) => Behavior(vueStyleBehavior(isPage));
