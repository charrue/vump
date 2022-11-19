const { existsSync, readFileSync, writeFileSync, unlinkSync } = require("fs");
const { resolve } = require("path");

const DIST = resolve(__dirname, "../dist");
const OUTPUT = resolve(DIST, "./index.mjs");

if (existsSync(OUTPUT)) {
  console.log("start rename index.mjs to index.js...");
  writeFileSync(resolve(DIST, "./index.js"), readFileSync(OUTPUT));
  unlinkSync(OUTPUT);
} else {
  console.log("no dist/index.mjs found, please run `npm run build` first.");
}
