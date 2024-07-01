import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: '.storybook/main.ts',
			formats: ['es']
		},
		rollupOptions: {
			external: /^lit/
		}
	}
});
