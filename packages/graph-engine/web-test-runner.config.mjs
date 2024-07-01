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
      createPage :async  ({ context }) =>{
        const page = await  context.newPage();
        // Needed to handle the process.env.NODE_ENV call inside of mobx and other libraries as they would normally be transformed by webpack or some other bundler
        page.addInitScript(()=>{
          window.process={
            env:{}
          }
        })
        return page

      },
      product: 'chromium',
    }),
  ],
  plugins: [esbuildPlugin({ ts: true, target: 'auto' })],
};
