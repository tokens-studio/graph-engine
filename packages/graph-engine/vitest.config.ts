/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	test: {
		// ... Specify options here.
	},
	plugins: [tsconfigPaths()]
});
