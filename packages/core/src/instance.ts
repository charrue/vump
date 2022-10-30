const ns = "charrue";

export const DATA_KEY = `__${ns}_data_key__` as const;
export const COMPUTED_KEY = `__${ns}_computed_key__` as const;

export interface ComponentInternalInstance {
  isCreated: boolean;
  isAttached: boolean;
  isDetached: boolean;
  [DATA_KEY]: Record<string, any>;
  [k: string]: any;
}

export let currentInstance: ComponentInternalInstance | null = null;

export const setCurrentInstance = (instance: ComponentInternalInstance) => {
  currentInstance = instance;
  // instance.scope.on();
};

export const unsetCurrentInstance = () => {
  // currentInstance && currentInstance.scope.off()
  currentInstance = null;
};
