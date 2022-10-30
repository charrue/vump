import { WritableComputedRef } from "@vue/reactivity";
import { DATA_KEY, COMPUTED_KEY } from "@vump/shared";

export interface ComponentInternalInstance {
  isCreated: boolean;
  isAttached: boolean;
  isDetached: boolean;
  [DATA_KEY]: Record<string, any>;
  [COMPUTED_KEY]: Record<string, WritableComputedRef<any>>;
  [k: string]: any;
}

export let currentInstance: ComponentInternalInstance | null = null;

export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  currentInstance = instance;
};

export const unsetCurrentInstance = () => {
  currentInstance = null;
};
