export const HOOKS_HAS_RETURN = [
  "onAddToFavorites",
  "onShareAppMessage",
  "onShareTimeline",
] as const;

export type PageLifetime = keyof WechatMiniprogram.Page.ILifetime;

export const PAGE_LIFETIMES: PageLifetime[] = [
  "onLoad",
  "onShow",
  "onReady",
  "onHide",
  "onUnload",
  "onPullDownRefresh",
  "onReachBottom",
  "onShareAppMessage",
  "onShareTimeline",
  "onPageScroll",
  "onTabItemTap",
  "onResize",
  "onAddToFavorites",
];
export type ComponentLifetime =
  | keyof WechatMiniprogram.Component.Lifetimes["lifetimes"]
  | keyof WechatMiniprogram.Component.PageLifetimes;

export const COMPONENT_LIFETIMES: ComponentLifetime[] = [
  "created",
  "attached",
  "ready",
  "moved",
  "detached",
  "error",
  "show",
  "hide",
  "resize",
];

export const APP_LIFETIMES = [
  "onLaunch",
  "onShow",
  "onHide",
  "onError",
  "onShareAppMessage",
  "onUnhandledRejection",
] as const;

export const enum LifecycleHooks {
  COMPONENT_CREATED = "c_c",
  COMPONENT_ATTACHED = "c_a",
  COMPONENT_READY = "c_r",
  COMPONENT_MOVED = "c_m",
  COMPONENT_DETACHED = "c_d",
  COMPONENT_ERROR = "c_e",
  SHOW = "p_s",
  LOADED = "p_l",
  PAGE_READY = "p_r",
  HIDE = "p_h",
  UNLOADED = "p_ul",
  PULL_DOWN_REFRESH = "p_pdr",
  REACH_BOTTOM = "p_rb",
  SHARE_APP_MESSAGE = "p_sam",
  SHARE_TIMELINE = "p_st",
  ADD_TO_FAVORITES = "p_atf",
  TAB_ITEM_TAP = "p_tit",
  PAGE_SCROLL = "p_s",
  PAGE_RESIZE = "p_re",
  SAVE_EXIT_STATE = "p_ses",
}

export enum SharedLifecycleHooks {
  READY = "s_r",
  MOUNTED = "s_m",
  UNMOUNTED = "s_um",
}

export const SharedLifecycleAlias: Record<SharedLifecycleHooks, [LifecycleHooks, LifecycleHooks]> =
  {
    [SharedLifecycleHooks.READY]: [LifecycleHooks.PAGE_READY, LifecycleHooks.COMPONENT_READY],
    [SharedLifecycleHooks.MOUNTED]: [LifecycleHooks.LOADED, LifecycleHooks.COMPONENT_ATTACHED],
    [SharedLifecycleHooks.UNMOUNTED]: [LifecycleHooks.COMPONENT_DETACHED, LifecycleHooks.UNLOADED],
  };

// TODO pagelifetime show
// TODO pagelifetime hide

export const LifecycleHooksDescription = {
  [LifecycleHooks.COMPONENT_CREATED]: "created",
  [LifecycleHooks.COMPONENT_ATTACHED]: "attached",
  [LifecycleHooks.COMPONENT_READY]: "ready",
  [LifecycleHooks.COMPONENT_MOVED]: "moved",
  [LifecycleHooks.COMPONENT_DETACHED]: "detached",
  [LifecycleHooks.COMPONENT_ERROR]: "error",
  [LifecycleHooks.SHOW]: "onShow",
  [LifecycleHooks.LOADED]: "onLoad",
  [LifecycleHooks.PAGE_READY]: "onReady",
  [LifecycleHooks.HIDE]: "onHide",
  [LifecycleHooks.UNLOADED]: "onUnload",
  [LifecycleHooks.PULL_DOWN_REFRESH]: "onPullDownRefresh",
  [LifecycleHooks.REACH_BOTTOM]: "onReachBottom",
  [LifecycleHooks.SHARE_APP_MESSAGE]: "onShareAppMessage",
  [LifecycleHooks.SHARE_TIMELINE]: "onShareTimeline",
  [LifecycleHooks.ADD_TO_FAVORITES]: "onAddToFavorites",
  [LifecycleHooks.TAB_ITEM_TAP]: "onTabItemTap",
  [LifecycleHooks.PAGE_SCROLL]: "onPageScroll",
  [LifecycleHooks.PAGE_RESIZE]: "onPageResize",
  [LifecycleHooks.SAVE_EXIT_STATE]: "OnSaveExitState",
};
