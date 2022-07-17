import { usePlugin } from "@charrue/vump";
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";

usePlugin({
  behaviors: [storeBindingsBehavior],
});

App<IAppOption>({
  globalData: {},
});
