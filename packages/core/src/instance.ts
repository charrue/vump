import { WritableComputedRef } from "@vue/reactivity";
import { DATA_KEY, COMPUTED_KEY, HOOK_KEY } from "@vump/shared";
import { LifecycleHooks } from "./lifecycle/index";

export interface ComponentInternalInstance {
  isCreated: boolean;
  isAttached: boolean;
  isDetached: boolean;
  [DATA_KEY]: Record<string, any>;
  [COMPUTED_KEY]: Record<string, WritableComputedRef<any>>;
  [HOOK_KEY]: Record<LifecycleHooks, Function[] | null>;
  [k: string]: any;
}

export let currentInstance: ComponentInternalInstance | null = null;

export function getCurrentInstance(): ComponentInternalInstance | null {
  return currentInstance;
}

export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  currentInstance = instance;
};

export const unsetCurrentInstance = () => {
  currentInstance = null;
};
