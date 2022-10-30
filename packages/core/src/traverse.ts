import { isRef } from "@vue/reactivity";
import { isObj, isArr, isSet, isMap, isPlainObj } from "@vump/shared";

enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  IS_SHALLOW = "__v_isShallow",
  RAW = "__v_raw",
}

export function traverse(value: unknown, seen?: Set<unknown>) {
  if (!isObj(value) || (value as any)[ReactiveFlags.SKIP]) {
    return value;
  }
  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArr(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v: any) => {
      traverse(v, seen);
    });
  } else if (isPlainObj(value)) {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const key in value) {
      traverse((value as any)[key], seen);
    }
  }
  return value;
}
