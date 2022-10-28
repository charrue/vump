/* eslint-disable @typescript-eslint/indent */

import { T, O } from "ts-toolbelt";
export const isArray = (obj: unknown): boolean => Array.isArray(obj);

export const error = (msg: string): void => {
  return console.error(msg);
};
export const warn = (msg: string, ...args: any[]): void => {
  return console.warn(msg, ...args);
};

const hasOwn = (obj: Record<string, any>, key: string): boolean => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * @description 创建一个从 object 中选中一些的属性的对象。
 * @param { Array } data 来源对象
 * @param { Array } attrs 选出的属性
 * @returns { Object } 属性筛选后的对象
 */
export const pick = <T extends Record<string, any>, K extends string>(
  names: readonly K[],
  obj: T,
) => {
  const result: Record<string, any> = {};
  let idx = 0;
  while (idx < names.length) {
    const k = names[idx];
    if (k in obj) {
      result[names[idx]] = obj[k];
    }
    idx += 1;
  }
  return result;
};

/**
 * @description 创建一个从 object 中排除一些的属性的对象。
 * @param { Array } data 来源对象
 * @param { Array } attrs 排除的属性
 */
export const omit = <T, K extends string>(names: readonly K[], obj: T) => {
  const result: Record<string, any> = {} as any;
  const index: Record<K, 1> = {} as Record<K, 1>;
  let idx = 0;
  const len = names.length;

  while (idx < len) {
    index[names[idx]] = 1;
    idx += 1;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    if (!hasOwn(index, prop)) {
      result[prop] = obj[prop];
    }
  }
  return result as Omit<T, K>;
};

type Merge<O1 extends object, O2 extends object, Depth extends "flat" | "deep"> = O.MergeUp<
  T.ObjectOf<O1>,
  T.ObjectOf<O2>,
  Depth,
  1
>;
export const mergeLeft = <M extends Record<string, any>, N extends Record<string, any>>(
  obj1: M,
  obj2: N,
) => {
  return { ...obj2, ...obj1 } as Merge<M, N, "flat">;
};

export const getType = (obj: any): string => Object.prototype.toString.call(obj);

const isType =
  <T>(type: string | string[]) =>
  (obj: unknown): obj is T =>
    obj != null &&
    (Array.isArray(type) ? type : [type]).some((t) => getType(obj) === `[object ${t}]`);

export const isWindow = isType<Window>("Window");
export const isHTMLElement = (obj: any): obj is HTMLElement => obj?.nodeName || obj?.tagName;

export const isFn = isType<(...args: any[]) => any>([
  "Function",
  "AsyncFunction",
  "GeneratorFunction",
]);

export const isArr = Array.isArray;

export const isPlainObj = isType<Record<string, unknown>>("Object");

export const isStr = isType<string>("String");

export const isBool = isType<boolean>("Boolean");

export const isNum = isType<number>("Number");

export const isObj = (val: unknown): val is Record<string, unknown> => typeof val === "object";

export const isRegExp = isType<RegExp>("RegExp");

export const isMap = isType<Map<any, any>>("Map");

export const isWeakMap = isType<WeakMap<any, any>>("WeakMap");

export const isSet = isType<Set<any>>("Set");

export const isWeakSet = isType<WeakSet<any>>("WeakSet");

export const isSymbol = isType<symbol>("Symbol");

export const isNull = (val: any): boolean => val === null;

export const isUndefined = (val: any): boolean => val === undefined;

export const isDef = (val: any): boolean => !isNull(val) && !isUndefined(val);

export const isUnDef = (val: any): boolean => isNull(val) || isUndefined(val);

export const isPromise = (obj: any): obj is Promise<any> => !!obj && typeof obj.then === "function";

export const NOOP = () => {
  //
};
