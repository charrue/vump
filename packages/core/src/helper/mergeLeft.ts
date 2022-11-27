import { O } from "ts-toolbelt";

export const mergeLeft = <M extends Record<string, any>, N extends Record<string, any>>(
  obj1: M,
  obj2: N,
) => {
  return { ...obj2, ...obj1 } as O.Merge<M, N, "flat">;
};
