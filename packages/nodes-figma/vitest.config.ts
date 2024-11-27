import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.[jt]s?(x)"],
    globals: true,
  },
});
