/* eslint-disable @typescript-eslint/indent */
export const getType = (obj: any): string => Object.prototype.toString.call(obj);

const isType =
  <T>(type: string | string[]) =>
  (obj: unknown): obj is T => {
    return (
      obj != null &&
      (Array.isArray(type) ? type : [type]).some((t) => getType(obj) === `[object ${t}]`)
    );
  };

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
