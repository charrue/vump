import { VumpFactory } from "../types/vump";
import { PLUGIN_KEY } from "@vump/shared";

const createGlobalPluginFactory = () => {
  const plugins: VumpFactory.Plugin[] = [];
  if (wx) {
    (wx as any)[PLUGIN_KEY] = plugins;
  }

  return {
    usePlugin: (plugin: VumpFactory.Plugin) => {
      plugins.push(plugin);
    },
    getPlugins: () => {
      const Plugins = ((wx as any)[PLUGIN_KEY] as VumpFactory.Plugin[]) || plugins;
      return Plugins.sort((a, b) => (a.order || 0) - (b.order || 0));
    },
  };
};

const methods = createGlobalPluginFactory();

export const { usePlugin } = methods;

export const { getPlugins } = methods;
