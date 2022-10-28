import {
  currentInstance,
  ComponentInternalInstance,
  setCurrentInstance,
  unsetCurrentInstance,
} from "./instance";
import { pauseTracking, resetTracking } from "@vue/reactivity";

export enum PageLifecycleHooks {
  onLoad = "onLoad",
  onShow = "onShow",
  onReady = "onReady",
  onHide = "onHide",
  onUnload = "onUnload",
  onPullDownRefresh = "onPullDownRefresh",
  onReachBottom = "onReachBottom",
  onShareAppMessage = "onShareAppMessage",
  onShareTimeline = "onShareTimeline",
  onPageScroll = "onPageScroll",
  onTabItemTap = "onTabItemTap",
  onResize = "onResize",
  onAddToFavorites = "onAddToFavorites",
}

export enum ComponentLifecycleHooks {
  created = "created",
  attached = "attached",
  ready = "ready",
  moved = "moved",
  detached = "detached",
  error = "error",
  show = "show",
  hide = "hide",
  resize = "resize",
}

type LifecycleHooks = PageLifecycleHooks | ComponentLifecycleHooks;

export const injectHook = (
  type: LifecycleHooks,
  hook: (...args: any[]) => any,
  target: ComponentInternalInstance | null = currentInstance,
  prepend = false,
) => {
  if (target) {
    // const hooks = target[type] || (target[type] = []);
    if (!target[type]) {
      target[type] = [];
    }
    const hooks = target[type] as any[];
    const wrappedHook = (...args: any[]) => {
      if (target.isUnmounted) {
        return;
      }

      pauseTracking();
      // Set currentInstance during hook invocation.
      // This assumes the hook does not synchronously trigger other hooks, which
      // can only be false when the user does something really funky.
      setCurrentInstance(target);
      const res = hook.call(target, ...args);
      // const res = callWithAsyncErrorHandling(hook, target, type, args);
      // const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    };

    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }

    return wrappedHook;
  }

  return null;
  // else if (__DEV__) {
  //   const apiName = toHandlerKey(ErrorTypeStrings[type].replace(/ hook$/, ''))
  //   warn(
  //     `${apiName} is called when there is no active component instance to be ` +
  //       `associated with. ` +
  //       `Lifecycle injection APIs can only be used during execution of setup().` +
  //       (__FEATURE_SUSPENSE__
  //         ? ` If you are using async setup(), make sure to register lifecycle ` +
  //           `hooks before the first await statement.`
  //         : ``)
  //   )
  // }
};

// export const createHook = (lifecycle: LifecycleHooks) => (
//   hook: (...args: any[]) => any,
//   target: ComponentInternalInstance | null = currentInstance,
//   ) => {

//   }
