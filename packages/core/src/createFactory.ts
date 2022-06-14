/* eslint-disable @typescript-eslint/indent */
import { useMixins } from "./mixin/useMixin";
import { VumpFactory } from "./types/vump";
import ComputedBehavior from "miniprogram-computed";
import MobxBehavior from "mobx-miniprogram-bindings";
import { diffBehavior } from "./behaviors/diff";
import { PAGE_LIFETIMES } from "./helper/lifecycle";

const defaultOptions: {
  data: VumpFactory.DefaultDataOption;
  methods: VumpFactory.DefaultMethodOption;
} = {
  methods: {},
  data: {},
};

export const createFactory = <T extends "component" | "page">(type: T) => {
  return <
    TData extends VumpFactory.DefaultDataOption,
    TProperty extends VumpFactory.DefaultPropertyOption,
    TMethod extends VumpFactory.DefaultMethodOption,
    TComputed extends Partial<VumpFactory.DefaultComputedOption<TData>>,
    TWatch extends Partial<VumpFactory.DefaultWatchOption>,
    TCustomInstanceProperty extends VumpFactory.IAnyObject = VumpFactory.VumpInnerMethods,
  >(
    opt: T extends "page"
      ? VumpFactory.PageOptions<TData, TMethod, TComputed, TWatch, TCustomInstanceProperty>
      : VumpFactory.ComponentOptions<
          TData,
          TProperty,
          TMethod,
          TComputed,
          TWatch,
          TCustomInstanceProperty
        >,
  ) => {
    const options = {
      ...defaultOptions,
      ...opt,
    };
    if (!options.behaviors) {
      options.behaviors = [];
    }
    if (!options.options) {
      options.options = {};
    }

    if (options.storeBindings) {
      options.behaviors.push(MobxBehavior.storeBindingsBehavior);
    }
    if (options.computed) {
      // computed 功能注册
      options.behaviors.push(ComputedBehavior.behavior);
    }
    options.behaviors.push(diffBehavior);

    // 合并options
    if (opt.mixins) {
      useMixins(options as any, opt.mixins);
    }

    if (type === "page") {
      // Page 级别的组件不需要样式隔离
      options.options.addGlobalClass = true;
      PAGE_LIFETIMES.forEach((lifetimeKey) => {
        const callback = (
          options as VumpFactory.PageOptions<
            TData,
            TMethod,
            TComputed,
            TWatch,
            TCustomInstanceProperty
          >
        )[lifetimeKey];
        /**
         * 在使用`createPage`时，生命周期函数可以在data同级处声明
         * 但是在传递给Component时，需要将生命周期函数放置到`methods`中
         * @see https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html
         */
        if (typeof callback === "function") {
          options.methods[lifetimeKey] = callback;
          delete (
            options as VumpFactory.PageOptions<
              TData,
              TMethod,
              TComputed,
              TWatch,
              TCustomInstanceProperty
            >
          )[lifetimeKey];
        }
      });
    }

    return Component(options as any);
  };
};

export const createPage = createFactory<"page">("page");
export const createComponent = createFactory<"component">("component");
