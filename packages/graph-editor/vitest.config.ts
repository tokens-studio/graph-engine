/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Note that this needs to be present here as well as it doesn't get picked up from the root vite.config.ts
  plugins: [tsconfigPaths()],
  test: {
    include: ['tests/**/*.test.[jt]s?(x)', 'src/**/*.test.[jt]s?(x)'],
    environment: 'happy-dom',
    globals: true,
    server: {
      deps: {
        // to ensure importing CSS files is working
        inline: ['@tokens-studio/ui'],
      },
    },
  },
});
