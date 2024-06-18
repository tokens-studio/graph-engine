module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {
      plugins: [],
    },
  },
  typescript: {
    // Overrides the default Typescript configuration to allow multi-package components to be documented via AutoDocs.
    reactDocgen: 'react-docgen-typescript',
    checkOptions: {},
    check: false,
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        //We use the declarations so that docgen does not annotate object literals 
        return prop.parent ? !/node_modules/.test(prop.parent.fileName) : !!prop.declarations
      }
      ,
    },
  },
};
