/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/indent */

interface WechatMiniprogramComponentLifetimes {
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例刚刚被创建时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  created(): void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例进入页面节点树时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  attached(): void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件在视图层布局完成后执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  ready(): void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例被移动到节点树另一个位置时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  moved(): void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 在组件实例被从页面节点树移除时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  detached(): void;
  /**
   * 在vump中使用时会被指定到`lifetimes`中
   *
   * 每当组件方法抛出错误时执行
   *
   * 最低基础库版本：[`2.4.1`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  error(err: Error): void;
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
  export interface VumpInnerMethods {
    diffUpdate(data: Record<string, any>): void;
  }

  export interface Data<D extends DefaultDataOption> {
    /** 组件的内部数据，和 `properties` 一同用于组件的模板渲染 */
    data?: D;
  }
  export interface Property<P extends DefaultPropertyOption> {
    /** 组件的对外属性，是属性名到属性设置的映射表 */
    properties: P;
  }
  export interface Method<M extends DefaultMethodOption, TIsPage extends boolean = false> {
    /** 组件的方法，包括事件响应函数和任意的自定义方法，关于事件响应函数的使用，参见 [组件间通信与事件](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/events.html) */
    methods: M & (TIsPage extends true ? Partial<WechatMiniprogram.Page.ILifetime> : IAnyObject);
  }

  export interface Computed<C> {
    /** 组件的计算属性 */
    computed?: C;
  }
  export type PageComputedOption<TData> = Record<string, (data: TData) => any>
  export type ComponentComputedOption<TData, TProperty = Record<string, any>> = Record<string, (data: TData & { [K in keyof TProperty]: any }) => any>

  export type ComputedInstance<
    D extends WechatMiniprogram.Component.DataOption,
    P extends WechatMiniprogram.Component.PropertyOption,
    M extends WechatMiniprogram.Component.MethodOption,
    C extends Record<string, (data: D & { [K in keyof P]: any }) => any>,
    TCustomProperty extends WechatMiniprogram.IAnyObject = Record<string, never>,
  > = WechatMiniprogram.Component.Instance<D, P, M, TCustomProperty> & {
    data: { [K in keyof C]: ReturnType<C[K]> } & { [K in keyof P]: any };
  }

  export interface Watch<D extends Partial<DefaultWatchOption>> {
    /** 组件的监听属性，会在属性值发生变化时进行调用 */
    watch?: D;
  }

  export type Mixin = {
    /** 组件的复用功能，现版本不支持mixins的嵌套  */
    mixins?: (Data<DefaultDataOption> &
      Partial<Property<DefaultPropertyOption>> &
      Partial<Method<DefaultMethodOption>>)[];
  };

  export type OtherOption = Omit<WechatMiniprogram.Component.OtherOption, "pageLifetimes">;

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
      data: TData & { [K in keyof TComputed]: ReturnType<TComputed[K]> } & WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
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
    TComputed extends ComponentComputedOption<TData, TProperty> = ComponentComputedOption<TData, TProperty>,
    TWatch extends Partial<DefaultWatchOption> = Partial<DefaultWatchOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TIsPage extends boolean = false,
    TOptions extends CustomOption = CustomOption,
  > = Partial<VumpFactory.Data<TData>> & // data
    Partial<VumpFactory.Property<TProperty>> & // property
    Partial<VumpFactory.Method<TMethod, TIsPage>> & // methods
    Partial<VumpFactory.Computed<TComputed>> & // computed
    Partial<VumpFactory.Watch<TWatch>> & // watch
    Partial<VumpFactory.Mixin> & // mixins
    Partial<VumpFactory.OtherOption> &
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
    TComputed extends ComponentComputedOption<TData, TProperty> = ComponentComputedOption<TData, TProperty>,
    TWatch extends Partial<DefaultWatchOption> = Partial<DefaultWatchOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TOptions extends CustomOption = CustomOption,
  > = ComponentOptions<
    TData,
    TProperty,
    TMethod,
    TComputed,
    TWatch,
    TCustomInstanceProperty,
    false,
    TOptions & { order?: number }
  >;

  export type PageOptions<
    TData extends DefaultDataOption = DefaultDataOption,
    TMethod extends DefaultMethodOption = DefaultMethodOption,
    TComputed extends ComponentComputedOption<TData> = ComponentComputedOption<TData>,
    TWatch extends Partial<DefaultWatchOption> = Partial<DefaultWatchOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
  > = Partial<VumpFactory.Data<TData>> & // data
    Partial<VumpFactory.Method<TMethod, true>> & // methods
    Partial<VumpFactory.Computed<TComputed>> & // computed
    Partial<VumpFactory.Watch<TWatch>> & // watch
    Partial<VumpFactory.Mixin> & // mixins
    Partial<VumpFactory.OtherOption> &
    Partial<WechatMiniprogram.Page.ILifetime> &
    ThisType<PageInstance<TData, TMethod, TComputed, TCustomInstanceProperty>> &
    CustomOption;

  export interface Constructor {
    <
      TData extends DefaultDataOption,
      TProperty extends DefaultPropertyOption,
      TMethod extends DefaultMethodOption,
      TComputed extends Record<string, (data: TData) => any>,
      TWatch extends Partial<DefaultWatchOption>,
      TCustomInstanceProperty extends IAnyObject = IAnyObject,
      TIsPage extends boolean = false,
    >(
      options: TIsPage extends true
        ? VumpFactory.PageOptions<TData, TMethod, TComputed, TWatch, TCustomInstanceProperty>
        : VumpFactory.ComponentOptions<
            TData,
            TProperty,
            TMethod,
            TComputed,
            TWatch,
            TCustomInstanceProperty
          >,
    ): string;
  }
}
