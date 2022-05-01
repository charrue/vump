/* eslint-disable no-param-reassign */
import { VumpFactory } from "../types/vump";
import { mergeDataOptions, mergeLifecycleOptions, mergeMethodOptions } from "./merge-options";

export const useMixins = (
  options: VumpFactory.IAnyObject,
  mixins: VumpFactory.IAnyObject[] = [],
) => {
  if (Array.isArray(mixins) && mixins.length > 0) {
    mixins.forEach((mixin) => {
      // if (Array.isArray(mixin.mixins) && mixin.mixins.length > 0) {
      //   useMixins(options, mixin.mixins);
      // }

      if (mixin.data) {
        options.data = mergeDataOptions(options.data || {}, mixin.data);
      }

      if (mixin.methods) {
        options.methods = mergeMethodOptions(options.methods || {}, mixin.methods);
      }

      // TODO computed
      // TODO watch

      const lifecycleCallbacks = mergeLifecycleOptions(options, mixin);
      Object.assign(options, lifecycleCallbacks);
    });
  }
};
