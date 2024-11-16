import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
import postcssModules from 'postcss-modules';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  parser: 'postcss-scss',
  plugins: [
    postcssImport({
      filter: (url) => {
        if (url.startsWith('.')) {
          return true;
        }
        return false;
      },
    }),
    postcssModules({
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      getJSON: () => ({}),
    }),
    postcssNested(),
    postcssPresetEnv(),
    autoprefixer(),
    cssnano(),
  ],
};
