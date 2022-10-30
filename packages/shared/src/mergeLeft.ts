/* eslint-disable @typescript-eslint/indent */
import { T, O } from "ts-toolbelt";

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
