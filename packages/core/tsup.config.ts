import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  clean: true,
  dts: true,
  format: ["cjs", "esm"],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  minify: true,
});
