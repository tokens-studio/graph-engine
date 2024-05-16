import { defineConfig } from "cypress";

export default defineConfig({
  experimentalStudio:true,
  env: {
    'cypress-react-selector': {
      root: '#root',
    },
  },
  e2e: {
    baseUrl: "http://localhost:3001",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
