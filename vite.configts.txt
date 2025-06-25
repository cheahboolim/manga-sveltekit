import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		allowedHosts: ['s.susmanga.com']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
