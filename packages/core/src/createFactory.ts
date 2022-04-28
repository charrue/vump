/* eslint-disable @typescript-eslint/indent */
import { useMixins } from "./mixin/useMixin";
import { VumpFactory } from "./types/vump";

const defaultOptions = {
  methods: {},
  data: {},
};

export const createFactory = <T extends "component" | "page">(type: T) => {
  return <
    TData extends VumpFactory.DefaultDataOption,
    TProperty extends VumpFactory.DefaultPropertyOption,
    TMethod extends VumpFactory.DefaultMethodOption,
    TComputed extends Partial<VumpFactory.DefaultComputedOption>,
    TWatch extends Partial<VumpFactory.DefaultWatchOption>,
    TCustomInstanceProperty extends VumpFactory.IAnyObject = VumpFactory.IAnyObject,
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
    if (opt.mixins) {
      useMixins(options as any, opt.mixins);
    }

    if (type === "page") {
      //
    }

    return Component(options as any);
  };
};

export const createPage = createFactory<"page">("page");
export const createComponent = createFactory<"component">("component");
