import type { ReactiveEffectOptions } from "@vue/reactivity";

type OnCleanup = (cleanupFn: () => void) => void;

export interface WatchOptions {
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
} & WatchOptions;

type WatchOptionItem = string | WatchCallback | ObjectWatchOptionItem;

type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[];

export type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>;
