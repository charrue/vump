import { HOOK_KEY, warn, isArr, IS_PAGE_KEY } from "@vump/shared";
import { ComponentInternalInstance } from "../instance";
import { callWithAsyncErrorHandling } from "../error";
import { LifecycleHooks, LifecycleHooksDescription } from "./index";

const isPageHook = (hookName: LifecycleHooks) => {
  return hookName.startsWith("p_");
};
const isComponentHook = (hookName: LifecycleHooks) => {
  return hookName.startsWith("c_");
};

export const callHook = (
  instance: ComponentInternalInstance,
  hookName: LifecycleHooks,
  ...args: any[]
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

    let lastResult: any;

    const lifecycleShouldReturn = [
      LifecycleHooks.SHARE_APP_MESSAGE,
      LifecycleHooks.SHARE_TIMELINE,
      LifecycleHooks.ADD_TO_FAVORITES,
    ].includes(hookName);

    instance[HOOK_KEY][hookName]!.forEach((fn) => {
      const LifecycleResult = callWithAsyncErrorHandling(
        fn.bind(instance),
        instance,
        LifecycleHooksDescription[hookName],
        args,
      );

      if (lifecycleShouldReturn) {
        lastResult = LifecycleResult;
      }
    });

    if (lifecycleShouldReturn) {
      return lastResult;
    }
  }
};
