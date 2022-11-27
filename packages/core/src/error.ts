import { warn, isFn, isPromise, isArr } from "./helper/index";
import { ComponentInternalInstance } from "./instance";

export function callWithErrorHandling(
  fn: Function,
  instance: ComponentInternalInstance | null,
  type: string,
  args?: unknown[],
) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    logError(err, instance, type);
  }
  return res;
}

export function callWithAsyncErrorHandling(
  fn: Function | Function[],
  instance: ComponentInternalInstance | null,
  type: string,
  args?: unknown[],
): any[] {
  if (isFn(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        logError(err, instance, type);
      });
    }
    return res;
  }

  const values = [];
  if (isArr(fn)) {
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
  }
  return values;
}

function logError(err: any, vm: any, info: string) {
  warn(`Error in ${info}: "${err.toString()}"`, vm);
  console.error(err);
}
