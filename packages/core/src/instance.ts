/* eslint-disable @typescript-eslint/indent */

import { WritableComputedRef } from "@vue/reactivity";
import { DATA_KEY, COMPUTED_KEY, HOOK_KEY } from "@vump/shared";
import { LifecycleHooks } from "./lifecycle/index";
// eslint-disable-next-line import/no-cycle
import { DataOption } from "./options/data";

export interface ComponentInternalInstance {
  isCreated: boolean;
  isAttached: boolean;
  isDetached: boolean;
  [DATA_KEY]: Record<string, any>;
  [COMPUTED_KEY]: Record<string, WritableComputedRef<any>>;
  [HOOK_KEY]: Record<LifecycleHooks, Function[] | null>;
  [k: string]: any;
}

export type ExtractComputedReturns<T extends any> = {
  [key in keyof T]: T[key] extends { get: (...args: any[]) => infer TReturn }
    ? TReturn
    : T[key] extends (...args: any[]) => infer TReturn
    ? TReturn
    : never;
};

export type ComponentInstance<
  TData extends DataOption,
  TProperty extends WechatMiniprogram.Component.DataOption,
  TMethod,
  TComputed,
  TCustomInstanceProperty,
  TIsPage extends boolean = false,
> = WechatMiniprogram.Component.InstanceProperties &
  WechatMiniprogram.Component.InstanceMethods<WechatMiniprogram.IAnyObject> &
  TMethod &
  TProperty &
  TData &
  ExtractComputedReturns<TComputed> &
  TCustomInstanceProperty & {
    /** 组件数据，**包括内部数据和属性值** */
    data: TData &
      ExtractComputedReturns<TComputed> &
      WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
    /** 组件数据，**包括内部数据和属性值**（与 `data` 一致） */
    properties: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
  } & (TIsPage extends true ? WechatMiniprogram.Page.ILifetime : WechatMiniprogram.IAnyObject);

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
