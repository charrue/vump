import { HOOK_KEY, warn, isArr, IS_PAGE_KEY } from "../helper/index";
import { pauseTracking, resetTracking } from "@vue/reactivity";
import {
  getCurrentInstance,
  ComponentInternalInstance,
  setCurrentInstance,
  unsetCurrentInstance,
} from "../instance";
import { callWithAsyncErrorHandling } from "../error";
import {
  LifecycleHooks,
  SharedLifecycleHooks,
  SharedLifecycleAlias,
  LifecycleHooksDescription,
} from "./index";

const isSharedLifecycleHook = (name: string): name is SharedLifecycleHooks => name.startsWith("s_");

const injectHook = (
  instance: ComponentInternalInstance,
  hookName: LifecycleHooks | SharedLifecycleHooks,
  fn: () => void,
) => {
  if (isSharedLifecycleHook(hookName)) {
    const hooks = SharedLifecycleAlias[hookName];
    injectHook(instance, instance[IS_PAGE_KEY] ? hooks[0] : hooks[1], fn);
  } else {
    instance[HOOK_KEY][hookName] = instance[HOOK_KEY][hookName] || [];
    if (!isArr(instance[HOOK_KEY][hookName])) {
      instance[HOOK_KEY][hookName] = [];
    }
    const wrappedHook = (...args: unknown[]) => {
      if (instance.isDetached) {
        return;
      }
      pauseTracking();
      setCurrentInstance(instance);
      const res = callWithAsyncErrorHandling(
        fn,
        instance,
        LifecycleHooksDescription[hookName],
        args,
      );
      unsetCurrentInstance();
      resetTracking();
      return res;
    };

    instance[HOOK_KEY][hookName]!.push(wrappedHook);
  }
};

const createLifeCycle = <T extends (...args: any[]) => any = () => void | Promise<void>>(
  hookName: LifecycleHooks | SharedLifecycleHooks,
) => {
  return (fn: T, target: any = getCurrentInstance()) => {
    if (!target) {
      warn(
        `${hookName} is called when there is no active component instance to be ` +
          `associated with. ` +
          `Lifecycle injection APIs can only be used during execution of setup().`,
      );
      return;
    }
    return injectHook(target, hookName, fn);
  };
};

export const onCreated = createLifeCycle(LifecycleHooks.COMPONENT_CREATED);
export const onAttached = createLifeCycle(LifecycleHooks.COMPONENT_ATTACHED);
export const onDetached = createLifeCycle(LifecycleHooks.COMPONENT_DETACHED);
export const onComponentReady = createLifeCycle(LifecycleHooks.COMPONENT_READY);
export const onShow = createLifeCycle(LifecycleHooks.SHOW);
export const onLoad = createLifeCycle<
  (query: Record<string, string | undefined>) => void | Promise<void>
>(LifecycleHooks.LOADED);
export const onUnload = createLifeCycle(LifecycleHooks.UNLOADED);
export const onPageReady = createLifeCycle(LifecycleHooks.PAGE_READY);
export const onHide = createLifeCycle(LifecycleHooks.HIDE);
export const onPullDownRefresh = createLifeCycle(LifecycleHooks.PULL_DOWN_REFRESH);
export const onReachBottom = createLifeCycle(LifecycleHooks.REACH_BOTTOM);
export const onShareAppMessage = createLifeCycle<
  (
    options: WechatMiniprogram.Page.IShareAppMessageOption,
  ) => WechatMiniprogram.Page.ICustomShareContent
>(LifecycleHooks.SHARE_APP_MESSAGE);
export const onShareTimeline = createLifeCycle<() => WechatMiniprogram.Page.ICustomTimelineContent>(
  LifecycleHooks.SHARE_TIMELINE,
);
export const onAddToFavorites = createLifeCycle<
  (
    options: WechatMiniprogram.Page.IAddToFavoritesOption,
  ) => WechatMiniprogram.Page.IAddToFavoritesContent
>(LifecycleHooks.ADD_TO_FAVORITES);
export const onPageScroll = createLifeCycle(LifecycleHooks.PAGE_SCROLL);
export const onPageResize = createLifeCycle<
  (options: WechatMiniprogram.Page.IResizeOption) => void | Promise<void>
>(LifecycleHooks.PAGE_RESIZE);
export const onTabItemTap = createLifeCycle(LifecycleHooks.TAB_ITEM_TAP);
export const onSaveExitState = createLifeCycle(LifecycleHooks.SAVE_EXIT_STATE);

export const onReady = createLifeCycle(SharedLifecycleHooks.READY);
export const onMounted = createLifeCycle(SharedLifecycleHooks.MOUNTED);
export const onUnmounted = createLifeCycle(SharedLifecycleHooks.UNMOUNTED);
