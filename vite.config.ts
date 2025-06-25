import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
	plugins: [
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.ico', 'pwa-icon-192.png', 'pwa-icon-512.png'],
			manifest: {
				name: 'SusManga',
				short_name: 'Manga',
				start_url: '/?utm_source=pwa&utm_medium=pwa&utm_campaign=install',
				display: 'standalone',
				background_color: '#000000',
				theme_color: '#000000',
				icons: [
					{
						src: '/pwa-icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/pwa-icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	server: {
		host: true,
		allowedHosts: ['susmanga.com', 's.susmanga.com']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})
