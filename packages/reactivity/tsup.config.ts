import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  // dts: true,
  dts: {
    resolve: true,
  },
  format: ["esm", "cjs"],
});
