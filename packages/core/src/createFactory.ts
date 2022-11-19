/* eslint-disable @typescript-eslint/indent */
import { useMixins } from "./mixin/useMixins";
import { VumpFactory } from "./types/vump";
import { PAGE_LIFETIMES } from "./lifecycle/index";
import { getPlugins } from "./plugin/index";
import { createVueStyleBehavior } from "./componentOptions";

const defaultOptions: {
  data: VumpFactory.DefaultDataOption;
  methods: VumpFactory.DefaultMethodOption;
} = {
  methods: {},
  data: {},
};

const createFactory = <T extends "component" | "page">(type: T) => {
  return <
    TData extends VumpFactory.DefaultDataOption = VumpFactory.DefaultDataOption,
    TProperty extends VumpFactory.DefaultPropertyOption = VumpFactory.DefaultPropertyOption,
    TMethod extends VumpFactory.DefaultMethodOption = VumpFactory.DefaultMethodOption,
    TComputed extends VumpFactory.ComponentComputedOption<
      TData,
      TProperty
    > = VumpFactory.ComponentComputedOption<TData, TProperty>,
    TCustomInstanceProperty extends VumpFactory.IAnyObject = VumpFactory.IAnyObject,
  >(
    opt: T extends "page"
      ? VumpFactory.PageOptions<
          TData,
          TMethod,
          VumpFactory.PageComputedOption<TData>,
          TCustomInstanceProperty
        >
      : VumpFactory.ComponentOptions<TData, TProperty, TMethod, TComputed, TCustomInstanceProperty>,
  ) => {
    const options = {
      ...defaultOptions,
      ...opt,
    };

    let optionBehaviors = [createVueStyleBehavior(type === "page")];
    if (options.behaviors) {
      optionBehaviors = optionBehaviors.concat(options.behaviors);
    }
    options.behaviors = optionBehaviors;
    if (!options.options) {
      options.options = {};
    }

    const plugins = getPlugins();

    useMixins(options as any, plugins);

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
            VumpFactory.PageComputedOption<TData>,
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
              VumpFactory.PageComputedOption<TData>,
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
