/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/indent */
import { ComputedGetter, WritableComputedOptions } from "@vue/reactivity";
import { ComponentWatchOptions } from "./watch";

interface WechatMiniprogramComponentLifetimes {
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例刚刚被创建时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  created: () => void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例进入页面节点树时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  attached: () => void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件在视图层布局完成后执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  ready: () => void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例被移动到节点树另一个位置时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  moved: () => void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例被从页面节点树移除时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  detached: () => void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 每当组件方法抛出错误时执行
   *
   * 最低基础库版本：[`2.4.1`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  error: (err: Error) => void;
}

export namespace VumpFactory {
  export type DefaultDataOption = WechatMiniprogram.Component.DataOption;
  export type DefaultPropertyOption = WechatMiniprogram.Component.PropertyOption;
  export type DefaultMethodOption = WechatMiniprogram.Component.MethodOption;
  export interface DefaultWatchOption {
    [k: string]: (...args: any[]) => void;
  }
  export interface DefaultComponentComputedOption<T> {
    [k: string]: (data: T) => any;
  }
  export type IAnyObject = WechatMiniprogram.IAnyObject;
  export type CustomOption = WechatMiniprogram.IAnyObject;

  export interface SetupContext {
    emit: (name: string, ...args: any[]) => void;
  }
  export type SetupOption = (
    props: Readonly<Record<string, any>>,
    ctx: SetupContext,
  ) => Record<string, any>;

  export type DataOption<T> = T | (() => T);

  /** 组件的计算属性 */
  export type ComputedOption = Record<string, ComputedGetter<any> | WritableComputedOptions<any>>;
  export type PageComputedOption<TData> = Record<string, (data: TData) => any>;
  export type ComponentComputedOption<TData, TProperty = Record<string, any>> = Record<
    string,
    (data: TData & { [K in keyof TProperty]: any }) => any
  >;

  export type ComputedInstance<
    D extends WechatMiniprogram.Component.DataOption,
    P extends WechatMiniprogram.Component.PropertyOption,
    M extends WechatMiniprogram.Component.MethodOption,
    C extends Record<string, (data: D & { [K in keyof P]: any }) => any>,
    TCustomProperty extends WechatMiniprogram.IAnyObject = Record<string, never>,
  > = WechatMiniprogram.Component.Instance<D, P, M, TCustomProperty> & {
    data: { [K in keyof C]: ReturnType<C[K]> } & { [K in keyof P]: any };
  };

  /** 组件的复用功能，现版本不支持mixins的嵌套  */
  export type MixinOption = Array<{
    data?: DefaultDataOption;
    properties?: DefaultPropertyOption;
    methods?: DefaultMethodOption & IAnyObject;
    computed?: ComputedOption;
    watch?: ComponentWatchOptions;
    behaviors?: WechatMiniprogram.Behavior.BehaviorIdentifier[];
    // TODO: 生命周期函数声明
    [k: string]: any;
  }>;

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface PageOtherOption {}
  export type ComponentOtherOption = WechatMiniprogram.Component.OtherOption;

  export type ComponentInstance<
    TData extends DefaultDataOption,
    TProperty extends DefaultPropertyOption,
    TMethod extends Partial<DefaultMethodOption>,
    TComputed extends ComponentComputedOption<TData, TProperty>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TIsPage extends boolean = false,
  > = WechatMiniprogram.Component.InstanceProperties &
    WechatMiniprogram.Component.InstanceMethods<TData> &
    TMethod &
    TCustomInstanceProperty & {
      /** 组件数据，**包括内部数据和属性值** */
      data: TData & {
        [K in keyof TComputed]: ReturnType<TComputed[K]>;
      } & WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
      /** 组件数据，**包括内部数据和属性值**（与 `data` 一致） */
      properties: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
    } & (TIsPage extends true ? WechatMiniprogram.Page.ILifetime : IAnyObject);

  export type PageInstance<
    TData extends DefaultDataOption,
    TMethod extends Partial<DefaultMethodOption>,
    TComputed extends Partial<DefaultComponentComputedOption<TData>>,
    TWatch extends Partial<DefaultWatchOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
  > = WechatMiniprogram.Component.InstanceProperties &
    WechatMiniprogram.Component.InstanceMethods<TData> &
    TData & {
      data: TData & TComputed;
    } & TMethod &
    TComputed &
    TWatch &
    TCustomInstanceProperty;

  export type ComponentOptions<
    TData extends DefaultDataOption = DefaultDataOption,
    TProperty extends DefaultPropertyOption = DefaultPropertyOption,
    TMethod extends DefaultMethodOption = DefaultMethodOption,
    TComputed extends ComponentComputedOption<TData, TProperty> = ComponentComputedOption<
      TData,
      TProperty
    >,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TIsPage extends boolean = false,
    TOptions extends CustomOption = CustomOption,
  > = {
    setup?: SetupOption;
    properties?: TProperty;
    data?: DataOption<TData>;
    methods?: TMethod & IAnyObject;
    computed?: ComputedOption;
    watch?: ComponentWatchOptions;
    mixins?: MixinOption;
  } & Partial<VumpFactory.ComponentOtherOption> &
    Partial<
      WechatMiniprogramComponentLifetimes & WechatMiniprogram.Component.Lifetimes["lifetimes"]
    > &
    ThisType<
      ComponentInstance<TData, TProperty, TMethod, TComputed, TCustomInstanceProperty, TIsPage>
    > &
    TOptions;

  export type Plugin<
    TData extends DefaultDataOption = DefaultDataOption,
    TProperty extends DefaultPropertyOption = DefaultPropertyOption,
    TMethod extends DefaultMethodOption = DefaultMethodOption,
    TComputed extends ComponentComputedOption<TData, TProperty> = ComponentComputedOption<
      TData,
      TProperty
    >,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TOptions extends CustomOption = CustomOption,
  > = ComponentOptions<
    TData,
    TProperty,
    TMethod,
    TComputed,
    TCustomInstanceProperty,
    false,
    TOptions & { order?: number }
  >;

  export type PageOptions<
    TData extends DefaultDataOption = DefaultDataOption,
    TMethod extends DefaultMethodOption = DefaultMethodOption,
    TComputed extends ComponentComputedOption<TData> = ComponentComputedOption<TData>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
  > = {
    setup?: SetupOption;
    data?: DataOption<TData>;
    methods?: TMethod & Partial<WechatMiniprogram.Page.ILifetime>;
    computed?: ComputedOption;
    watch?: ComponentWatchOptions;
    mixins?: MixinOption;
  } & Partial<VumpFactory.PageOtherOption> &
    Partial<WechatMiniprogram.Page.ILifetime> &
    ThisType<PageInstance<TData, TMethod, TComputed, TCustomInstanceProperty>> &
    CustomOption;

  export interface Constructor {
    <
      TData extends DefaultDataOption,
      TProperty extends DefaultPropertyOption,
      TMethod extends DefaultMethodOption,
      TComputed extends Record<string, (data: TData) => any>,
      TCustomInstanceProperty extends IAnyObject = IAnyObject,
      TIsPage extends boolean = false,
    >(
      options: TIsPage extends true
        ? VumpFactory.PageOptions<TData, TMethod, TComputed, TCustomInstanceProperty>
        : VumpFactory.ComponentOptions<
            TData,
            TProperty,
            TMethod,
            TComputed,
            TCustomInstanceProperty
          >,
    ): string;
  }
}
