/* eslint-disable no-param-reassign */
import { mergeDataOptions, mergeLifecycleOptions, mergeMethodOptions } from "./merge-options";
import { PAGE_LIFETIMES, COMPONENT_LIFETIMES, APP_LIFETIMES } from "../helper/lifecycle";
import { VumpFactory } from "../types/vump";

const allLifetimes = Array.from(
  new Set(([] as string[]).concat(PAGE_LIFETIMES, COMPONENT_LIFETIMES, APP_LIFETIMES)),
);

export const useMixins = (
  options: VumpFactory.IAnyObject,
  mixins: VumpFactory.IAnyObject[] = [],
) => {
  if (Array.isArray(mixins) && mixins.length > 0) {
    mixins.forEach((mixin) => {
      // if (Array.isArray(mixin.mixins) && mixin.mixins.length > 0) {
      //   useMixins(options, mixin.mixins);
      // }
      const { methods, behaviors, ...others } = mixin;
      if (behaviors && Array.isArray(behaviors)) {
        options.behaviors = [...(options.behaviors || []), ...(behaviors || [])];
      }
      if (methods) {
        options.methods = mergeMethodOptions(options.methods || {}, mixin.methods);
      }

      Object.keys(others)
        .filter((k) => {
          return !allLifetimes.includes(k);
        })
        .forEach((optionName) => {
          options[optionName] = mergeDataOptions(options[optionName] || {}, others[optionName]);
        });

      const lifecycleCallbacks = mergeLifecycleOptions(options, mixin);
      Object.assign(options, lifecycleCallbacks);
    });
  }
};
