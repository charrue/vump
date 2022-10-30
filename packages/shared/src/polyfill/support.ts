import { globalVariable } from "./globalThis";

export const NativeProxy = globalVariable.Proxy;
export const supportNativeProxy = NativeProxy && /native code/.test(NativeProxy.toString());
