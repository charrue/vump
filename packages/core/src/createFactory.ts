/* eslint-disable @typescript-eslint/indent */
import { useMixins } from "./mixin/useMixins";
import { PAGE_LIFETIMES } from "./lifecycle/index";
import { getPlugins } from "./plugin/index";
import { createVueStyleBehavior } from "./options/index";
import type { ComponentOptions, PageOptions } from "./options/types";
import type { PropertyOption } from "./options/props";
import type { EmitsOption } from "./options/emits";
import type { MethodOption } from "./options/methods";
import type { ComputedOption } from "./options/computed";
import type { DataOption } from "./options/data";

const defaultOptions: {
  data: WechatMiniprogram.IAnyObject;
  methods: WechatMiniprogram.IAnyObject;
} = {
  methods: {},
  data: {},
};

const createFactory = <T extends "component" | "page">(type: T) => {
  return <
    TData extends DataOption = DataOption,
    TProperty extends PropertyOption = PropertyOption,
    TComputed extends ComputedOption = ComputedOption,
    TMethod extends MethodOption = MethodOption,
    TEmit extends EmitsOption = EmitsOption,
  >(
    opt: T extends "page"
      ? PageOptions<TData, TMethod, TComputed>
      : ComponentOptions<TData, TProperty, TMethod, TComputed, TEmit>,
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
        const callback = (options as PageOptions<TData, TMethod>)[lifetimeKey];
        /**
         * 在使用`createPage`时，生命周期函数可以在data同级处声明
         * 但是在传递给Component时，需要将生命周期函数放置到`methods`中
         * @see https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/component.html
         */
        if (typeof callback === "function") {
          (options.methods as MethodOption)[lifetimeKey] = callback;
          delete (options as PageOptions<TData, TMethod>)[lifetimeKey];
        }
      });
    }
  };
};

export const createPage = createFactory<"page">("page");
export const createComponent = createFactory<"component">("component");
