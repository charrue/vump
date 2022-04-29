/* eslint-disable @typescript-eslint/indent */

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
