import { isArr, isObj } from "./is";

export const NOOP = () => {
  //
};

export const EMPTY_OBJ = {};

export const hasOwn = (obj: Record<string, any>, key: string): boolean => {
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

export const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArr(val) && val.length === 0) ||
  (isObj(val) && !Object.keys(val).length);
