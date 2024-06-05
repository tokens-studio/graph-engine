module.exports = {
	root: true,
	// This tells ESLint to load the config from the package `@tokens-studio/eslint-custom-config`
	extends: ['@tokens-studio/eslint-custom-config'],
	settings: {
		next: {
			rootDir: ['packages/*/']
		}
	}
};
