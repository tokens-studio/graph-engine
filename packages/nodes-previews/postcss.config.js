import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';

export default {
	plugins: [
		postcssImport,
		postcssNested,
		postcssPresetEnv({
			stage: 3,
			features: {
				'nesting-rules': true,
				'custom-properties': true,
				'custom-media-queries': true,
				'media-query-ranges': true,
				'custom-selectors': true
			}
		})
	]
};
