import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  bundle: false,
  splitting: false,
  sourcemap: true,
  format: "esm",
  skipNodeModulesBundle: true,
  clean: false,
  minify: false,
  target: "esnext"
});
