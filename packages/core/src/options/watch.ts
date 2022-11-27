import { isPlainObj, isFn, isStr, warn } from "../helper/index";
import { ComponentInternalInstance } from "../instance";
import { watch } from "@charrue/reactivity";

import type { ReactiveEffectOptions } from "@charrue/reactivity";

type OnCleanup = (cleanupFn: () => void) => void;

export interface ReactivityWatchOptions {
  onTrack?: ReactiveEffectOptions["onTrack"];
  onTrigger?: ReactiveEffectOptions["onTrigger"];
  immediate?: boolean;
  deep?: boolean;
}

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
  onCleanup: OnCleanup,
) => any;

export type ObjectWatchOptionItem = {
  handler: WatchCallback | string;
} & ReactivityWatchOptions;

type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem;

type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[];

export type WatchOption = Record<string, ComponentWatchOptionItem>;

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

export const initWatch = (instance: ComponentInternalInstance, watchOption?: WatchOption) => {
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
      const { deep = false, immediate = false } = watchValue as ObjectWatchOptionItem;
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
        });
      } else {
        warn(`Invalid watch handler specified by key "${watchValue.handler}"`, handler);
      }
    }
  });
};
