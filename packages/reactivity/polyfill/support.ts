import { getGlobalThis } from "./globalThis";

export const NativeProxy = getGlobalThis().Proxy;
export const supportNativeProxy = NativeProxy && /native code/.test(NativeProxy.toString());
