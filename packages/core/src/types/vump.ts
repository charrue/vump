/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/indent */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace VumpFactory {
  export type DefaultDataOption = WechatMiniprogram.Component.DataOption;
  export type DefaultPropertyOption = WechatMiniprogram.Component.PropertyOption;
  export type DefaultMethodOption = WechatMiniprogram.Component.MethodOption;
  export type DefaultWatchOption = Record<string, Function>;
  export type DefaultComputedOption = Record<string, Function>;
  export type IAnyObject = WechatMiniprogram.IAnyObject;

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

  export interface Computed<C extends Partial<DefaultComputedOption>> {
    /** 组件的计算属性 */
    computed?: C;
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
    TComputed extends Partial<DefaultComputedOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TIsPage extends boolean = false,
  > = WechatMiniprogram.Component.InstanceProperties &
    WechatMiniprogram.Component.InstanceMethods<TData> &
    TMethod &
    TCustomInstanceProperty & {
      /** 组件数据，**包括内部数据和属性值** */
      data: TData & TComputed & WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
      /** 组件数据，**包括内部数据和属性值**（与 `data` 一致） */
      properties: TData & WechatMiniprogram.Component.PropertyOptionToData<TProperty>;
    } & (TIsPage extends true ? WechatMiniprogram.Page.ILifetime : IAnyObject);

  export type PageInstance<
    TData extends DefaultDataOption,
    TMethod extends Partial<DefaultMethodOption>,
    TComputed extends Partial<DefaultComputedOption>,
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
    TData extends DefaultDataOption,
    TProperty extends DefaultPropertyOption,
    TMethod extends DefaultMethodOption,
    TComputed extends Partial<DefaultComputedOption>,
    TWatch extends Partial<DefaultWatchOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
    TIsPage extends boolean = false,
  > = Partial<VumpFactory.Data<TData>> & // data
    Partial<VumpFactory.Property<TProperty>> & // property
    Partial<VumpFactory.Method<TMethod, TIsPage>> & // methods
    Partial<VumpFactory.Computed<TComputed>> & // computed
    Partial<VumpFactory.Computed<TWatch>> & // watch
    Partial<VumpFactory.Mixin> & // mixins
    Partial<VumpFactory.OtherOption> &
    Partial<WechatMiniprogram.Component.Lifetimes> &
    ThisType<
      ComponentInstance<TData, TProperty, TMethod, TComputed, TCustomInstanceProperty, TIsPage>
    >;

  export type PageOptions<
    TData extends DefaultDataOption,
    TMethod extends DefaultMethodOption,
    TComputed extends Partial<DefaultComputedOption>,
    TWatch extends Partial<DefaultWatchOption>,
    TCustomInstanceProperty extends IAnyObject = IAnyObject,
  > = Partial<VumpFactory.Data<TData>> & // data
    Partial<VumpFactory.Method<TMethod, true>> & // methods
    Partial<VumpFactory.Computed<TComputed>> & // computed
    Partial<VumpFactory.Computed<TWatch>> & // watch
    Partial<VumpFactory.Mixin> & // mixins
    Partial<VumpFactory.OtherOption> &
    Partial<WechatMiniprogram.Page.ILifetime> &
    ThisType<PageInstance<TData, TMethod, TComputed, TCustomInstanceProperty>>;

  export interface Constructor {
    <
      TData extends DefaultDataOption,
      TProperty extends DefaultPropertyOption,
      TMethod extends DefaultMethodOption,
      TComputed extends Partial<DefaultComputedOption>,
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
