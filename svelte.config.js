import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		csp: {
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'font-src': ['self'],
				'img-src': ['self', 'data:'],
				'base-uri': ['self'],
				'form-action': ['self']
			}
		},
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			$state: 'src/lib/state',
			$algorithms: 'src/lib/algorithms',
			$services: 'src/lib/services',
			$config: 'src/lib/config'
		}
	}
};

export default config;
