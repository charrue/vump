import { globalVariable } from "./globalThis";
import { supportNativeProxy } from "./support";

if (!supportNativeProxy) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ProxyPolyfill = require("./proxy-polyfill")();
  globalVariable.Proxy = ProxyPolyfill;
  globalVariable.Proxy.revocable = ProxyPolyfill.revocable;
}
