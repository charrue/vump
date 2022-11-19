export type Keyof<T> = keyof T;
export type PlainObject<V = any, K extends string = string> = Record<K, V>;
export type Fn<R = any> = (...args: any[]) => R;
