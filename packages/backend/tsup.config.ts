import { defineConfig } from "tsup";

export default defineConfig({
  external: ["@prisma/client"],
  noExternal: ["**"],
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  format: "esm",
  skipNodeModulesBundle: true,
  clean: false,
  splitting: false,
  minify: false,
  bundle: false,
  target: "esnext",
});
