/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import { mergeDataOptions, mergeLifecycleOptions, mergeMethodOptions } from "./merge-options";
import { PAGE_LIFETIMES, COMPONENT_LIFETIMES, APP_LIFETIMES } from "../lifecycle";
import { VumpFactory } from "../types/vump";
import { isFn } from "@vump/shared";

const allLifetimes = Array.from(
  new Set(([] as string[]).concat(PAGE_LIFETIMES, COMPONENT_LIFETIMES, APP_LIFETIMES)),
);

export const useMixins = (
  options: VumpFactory.IAnyObject,
  mixins: VumpFactory.ComponentOptions["mixins"] = [],
) => {
  if (Array.isArray(mixins) && mixins.length > 0) {
    mixins.forEach((mixin) => {
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
