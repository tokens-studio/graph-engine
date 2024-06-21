module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {
      plugins: [],
    },
  },
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via AutoDocs.
    reactDocgen: "react-docgen",
    checkOptions: {},
    check: false,
  },
};
