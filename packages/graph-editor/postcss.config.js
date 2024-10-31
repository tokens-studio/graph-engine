import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssImport from 'postcss-import';
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
    postcssNested(),
    postcssPresetEnv(),
    autoprefixer(),
    cssnano(),
  ],
};
