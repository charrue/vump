import { PLUGIN_KEY } from "@vump/shared";
import { ComponentOptions } from "../options/types";

const createGlobalPluginFactory = () => {
  const plugins: ComponentOptions[] = [];
  if (wx) {
    (wx as any)[PLUGIN_KEY] = plugins;
  }

  return {
    usePlugin: (plugin: ComponentOptions) => {
      plugins.push(plugin);
    },
    getPlugins: () => {
      const Plugins = ((wx as any)[PLUGIN_KEY] as ComponentOptions[]) || plugins;
      return Plugins.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  };
};

const methods = createGlobalPluginFactory();

export const { usePlugin, getPlugins } = methods;
