import { defineConfig } from 'cypress';

export default defineConfig({
  experimentalStudio: true,
  env: {
    'cypress-react-selector': {
      root: '#root',
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3001',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
