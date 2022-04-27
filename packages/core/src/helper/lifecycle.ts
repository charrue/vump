export const APP_HOOKS = [
  "onLaunch",
  "onShow",
  "onHide",
  "onError",
  "onShareAppMessage",
  "onUnhandledRejection",
] as const;

export const PAGE_HOOKS = [
  "onLoad",
  "onReady",
  "onShow",
  "onHide",
  "onUnload",
  "onPullDownRefresh",
  "onReachBottom",
  "onPageScroll",
  "onTitleClick",
  "onOptionMenuClick",
  "onUpdated",
  "onBeforeCreate",
  "onAddToFavorites",
  "onShareAppMessage",
  "onShareTimeline",
] as const;

export const COMPONENT_HOOKS = [
  "created",
  "attached",
  "ready",
  "detached",
  "error",
  "show",
  "hide",
  "resize",
] as const;

export const HOOKS_HAS_RETURN = [
  "onAddToFavorites",
  "onShareAppMessage",
  "onShareTimeline",
] as const;

export const LIFECYCLE_HOOKS = [...APP_HOOKS, ...PAGE_HOOKS, ...COMPONENT_HOOKS] as const;

export type ComponentHooksUnion = typeof COMPONENT_HOOKS[number];
export type PageHooksUnion = typeof PAGE_HOOKS[number];
export type LifecycleUnion =
  | ComponentHooksUnion
  | PageHooksUnion
  | "onLaunch"
  | "onError"
  | "onUnhandledRejection";
