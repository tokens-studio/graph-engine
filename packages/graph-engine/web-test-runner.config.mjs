import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  nodeResolve: true,
  files: ['tests/**/*.test.ts'],
  coverageConfig: {
    report: true,
    reportDir: 'coverage',
    threshold: {
      statements: 30,
      branches: 30,
      functions: 30,
      lines: 30,
    },
  },
  browsers: [
    playwrightLauncher({
      product: 'chromium',
    }),
  ],
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};
