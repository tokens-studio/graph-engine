module.exports = {
	root: true,
	// This tells ESLint to load the config from the package `@tokens-studio/eslint-config-custom`
	extends: ['@tokens-studio/eslint-config-custom'],
	settings: {
		next: {
			rootDir: ['packages/*/']
		}
	}
};
