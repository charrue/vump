import { HOOK_KEY, warn, isArr, IS_PAGE_KEY } from "@vump/shared";
import { pauseTracking, resetTracking } from "@vue/reactivity";
import {
  getCurrentInstance,
  ComponentInternalInstance,
  setCurrentInstance,
  unsetCurrentInstance,
} from "../instance";
import { callWithAsyncErrorHandling } from "../error";
import { LifecycleHooks, LifecycleHooksDescription } from "./index";

const injectHook = (
  instance: ComponentInternalInstance,
  hookName: LifecycleHooks,
  fn: () => void,
) => {
  instance[HOOK_KEY][hookName] = instance[HOOK_KEY][hookName] || [];
  if (isArr(instance[HOOK_KEY][hookName])) {
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

const createLifeCycle = <T extends (...args: any[]) => any = () => void>(
  hookName: LifecycleHooks,
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

const isPageHook = (hookName: LifecycleHooks) => {
  return hookName.startsWith("p_");
};
const isComponentHook = (hookName: LifecycleHooks) => {
  return hookName.startsWith("c_");
};
export const callHook = (
  instance: ComponentInternalInstance,
  hookName: LifecycleHooks,
  args?: any[],
) => {
  if (!instance) return;
  if (instance[HOOK_KEY] && isArr(instance[HOOK_KEY][hookName])) {
    if (instance[IS_PAGE_KEY] && isComponentHook(hookName)) {
      warn(`Page中无法调用${LifecycleHooksDescription[hookName]}生命周期函数`);
      return;
    }
    if (!instance[IS_PAGE_KEY] && isPageHook(hookName)) {
      warn(`Component中无法调用${LifecycleHooksDescription[hookName]}生命周期函数`);
      return;
    }

    instance[HOOK_KEY][hookName]!.forEach((fn) => {
      callWithAsyncErrorHandling(
        fn.bind(instance),
        instance,
        LifecycleHooksDescription[hookName],
        args,
      );
    });
  }
};
export const onCreated = createLifeCycle(LifecycleHooks.COMPONENT_CREATED);
export const onAttached = createLifeCycle(LifecycleHooks.COMPONENT_ATTACHED);
export const onDetached = createLifeCycle(LifecycleHooks.COMPONENT_DETACHED);
export const onComponentReady = createLifeCycle(LifecycleHooks.COMPONENT_READY);
export const onShow = createLifeCycle(LifecycleHooks.SHOW);
export const onLoad = createLifeCycle(LifecycleHooks.LOADED);
export const onUnload = createLifeCycle(LifecycleHooks.UNLOADED);
export const onPageReady = createLifeCycle(LifecycleHooks.PAGE_READY);
export const onHide = createLifeCycle(LifecycleHooks.HIDE);
export const onPullDownRefresh = createLifeCycle(LifecycleHooks.PULL_DOWN_REFRESH);
export const onReachBottom = createLifeCycle(LifecycleHooks.REACH_BOTTOM);
export const onShareAppMessage = createLifeCycle(LifecycleHooks.SHARE_APP_MESSAGE);
export const onShareTimeline = createLifeCycle(LifecycleHooks.SHARE_TIMELINE);
export const onAddToFavorites = createLifeCycle(LifecycleHooks.ADD_TO_FAVORITES);
export const onPageScroll = createLifeCycle(LifecycleHooks.PAGE_SCROLL);
export const onPageResize = createLifeCycle(LifecycleHooks.PAGE_RESIZE);
export const onTabItemTap = createLifeCycle(LifecycleHooks.TAB_ITEM_TAP);
export const onSaveExitState = createLifeCycle(LifecycleHooks.SAVE_EXIT_STATE);
