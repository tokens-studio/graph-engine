import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  dts: true,
  bundle: true,
  splitting: true,
  sourcemap: true,
  format: ["esm", "cjs"],
  skipNodeModulesBundle: true,
  clean: true,
});
