/* eslint-disable @typescript-eslint/indent */
import { ComputedOption } from "./computed";
import { EmitsOption } from "./emits";
import { MethodOption } from "./methods";
import { MixinOption } from "./mixins";
import { PropsOption } from "./props";
import { SetupOption } from "./setup";
import { WatchOption } from "./watch";
import { ComponentInstance } from "../instance";

export type IAnyObject = WechatMiniprogram.IAnyObject;

export type ComponentOptions<
  TData extends WechatMiniprogram.Component.DataOption = WechatMiniprogram.Component.DataOption,
  TProp extends PropsOption = PropsOption,
  TMethod extends MethodOption = MethodOption,
  TComputed extends ComputedOption = ComputedOption,
  TEmit extends EmitsOption = EmitsOption,
  TCustomInstanceProperty extends IAnyObject = IAnyObject,
  TOptions extends IAnyObject = IAnyObject,
> = {
  setup?: SetupOption<TProp, TEmit>;
  props?: TProp;
  emits?: TEmit | Array<keyof TEmit>;
  data?: TData;
  methods?: TMethod;
  computed?: TComputed;
  watch?: WatchOption;
  mixins?: MixinOption;
} & Partial<WechatMiniprogram.Component.OtherOption> &
  WechatMiniprogram.Component.Lifetimes["lifetimes"] &
  ThisType<ComponentInstance<TData, TProp, TMethod, TComputed, TCustomInstanceProperty, false>> &
  TOptions;

export type PageOptions<
  TData extends WechatMiniprogram.Component.DataOption = WechatMiniprogram.Component.DataOption,
  TMethod extends MethodOption = MethodOption,
  TComputed extends ComputedOption = ComputedOption,
  TCustomInstanceProperty extends IAnyObject = IAnyObject,
  TOptions extends IAnyObject = IAnyObject,
> = {
  setup?: SetupOption;
  data?: TData;
  methods?: TMethod;
  computed?: TComputed;
  watch?: WatchOption;
  mixins?: MixinOption;
} & Partial<WechatMiniprogram.Component.OtherOption> &
  WechatMiniprogram.Component.Lifetimes["lifetimes"] &
  ThisType<
    ComponentInstance<
      TData,
      WechatMiniprogram.IAnyObject,
      TMethod,
      TComputed,
      TCustomInstanceProperty,
      true
    >
  > &
  TOptions;
