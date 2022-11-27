/* eslint-disable no-nested-ternary */
import { mergeDataOptions, mergeLifecycleOptions, mergeMethodOptions } from "./merge-options";
import { PAGE_LIFETIMES, COMPONENT_LIFETIMES, APP_LIFETIMES } from "../lifecycle";
import { isFn } from "../helper/index";
import { MixinOption } from "../options/mixins";

const allLifetimes = Array.from(
  new Set(([] as string[]).concat(PAGE_LIFETIMES, COMPONENT_LIFETIMES, APP_LIFETIMES)),
);

export const useMixins = (options: WechatMiniprogram.IAnyObject, userMixins: MixinOption = []) => {
  if (Array.isArray(userMixins) && userMixins.length > 0) {
    userMixins.forEach((mixin) => {
      const { methods, behaviors, ...others } = mixin;

      if (behaviors && Array.isArray(behaviors)) {
        options.behaviors = [...(options.behaviors || []), ...(behaviors || [])];
      }
      if (methods) {
        options.methods = mergeMethodOptions(options.methods || {}, mixin.methods || {});
      }

      Object.keys(others)
        .filter((k) => {
          return !allLifetimes.includes(k);
        })
        .forEach((optionName) => {
          const parentData = options[optionName]
            ? isFn(options[optionName])
              ? options[optionName]()
              : options[optionName]
            : {};
          const childData = others[optionName]
            ? isFn(others[optionName])
              ? others[optionName]()
              : others[optionName]
            : {};

          options[optionName] = mergeDataOptions(parentData, childData);
        });

      const lifecycleCallbacks = mergeLifecycleOptions(options, mixin);
      Object.assign(options, lifecycleCallbacks);
    });
  }
};
