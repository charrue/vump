import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  define: {
    "process.env.NODE_ENV": "production",
  },
  dts: true,
  format: ["esm", "cjs"],
});
