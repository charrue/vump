export type PlainObject<V = any, K extends string = string> = Record<K, V>

export type Fn<R = any> = (...args: any[]) => R

export type MiniprogramLifetimeHasReturn =
 | WechatMiniprogram.Page.ICustomTimelineContent
 | WechatMiniprogram.Page.ICustomShareContent
 | WechatMiniprogram.Page.IAddToFavoritesContent

export type LifecycleFn =
  | ((query?: Record<string, string | undefined>) => void)
  | Promise<void>
  | MiniprogramLifetimeHasReturn

export type ConstructorOptions = WechatMiniprogram.Page.Options<PlainObject, PlainObject>

export type Keyof<T> = keyof T
