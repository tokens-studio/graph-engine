import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3123,
  },
  build: {
    target: "es2015",
    manifest: true,
  },
  mode: "development",
  root: ".tsgraph",
  plugins: [react({ tsDecorators: true }), tsconfigPaths()],
});
