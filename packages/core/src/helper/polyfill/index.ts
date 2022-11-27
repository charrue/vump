import { getGlobalThis } from "./globalThis";
import { supportNativeProxy } from "./support";

if (!supportNativeProxy) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ProxyPolyfill = require("./proxy-polyfill")();
  getGlobalThis().Proxy = ProxyPolyfill;
  getGlobalThis().Proxy.revocable = ProxyPolyfill.revocable;
}
