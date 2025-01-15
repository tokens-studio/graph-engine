/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.[jt]s?(x)', 'src/**/*.test.[jt]s?(x)'],
		globals: true,
		server: {
			deps: {
				// to ensure importing CSS files is working
				inline: ['@tokens-studio/ui']
			}
		}
	}
});
