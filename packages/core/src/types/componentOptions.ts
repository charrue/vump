import { ComputedGetter, ReactiveEffectOptions, WritableComputedOptions } from "@vue/reactivity";

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

export type DataOptions<D extends Record<string, any>> = (() => D) | D;
export type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>;
export type ComputedOptions = Record<string, ComputedGetter<any> | WritableComputedOptions<any>>;
export interface MethodOptions {
  [key: string]: (...args: any[]) => any;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DefaultObject = Record<string, any>;
export interface ComponentOptions<
  D extends Record<string, any> = DefaultObject,
  C extends ComputedOptions = DefaultObject,
  M extends MethodOptions = DefaultObject,
> {
  data?: DataOptions<D>;
  computed?: C;
  watch?: ComponentWatchOptions;
  methods?: M;
}
