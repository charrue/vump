import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  declaration: true,
  replace: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  failOnWarn: false,
});
