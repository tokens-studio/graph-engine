import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['src/**/*.test.[jt]s?(x)'],
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        // to ensure importing CSS files is working
        inline: ['@tokens-studio/ui'],
      },
    },
  },
  plugins: [tsconfigPaths()],
});
