/* eslint-disable */

let _globalThis: any;
const getGlobalThis = (): any => (
  _globalThis
    || (_globalThis = typeof globalThis !== "undefined"
      ? globalThis
      : typeof self !== "undefined"
        ? self
        : typeof window !== "undefined"
          ? window
          : typeof global !== "undefined"
            ? global
            : {})
);

export const globalVariable = getGlobalThis();
