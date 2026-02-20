import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ fallback: '404.html' }),
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
