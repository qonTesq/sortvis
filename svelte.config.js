import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		serviceWorker: {
			register: false
		},
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
			$types: 'src/lib/types',
			$store: 'src/lib/store',
			$algorithms: 'src/lib/algorithms',
			$config: 'src/lib/config'
		}
	}
};

export default config;
