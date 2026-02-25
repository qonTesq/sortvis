<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		}
	});
</script>

<svelte:head>
	<title>Sortvis - Sorting Algorithm Visualizer</title>

	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="canonical" href="https://sortvis.pages.dev/" />

	<meta name="author" content="qonTesq" />
	<meta
		name="description"
		content="Visualize how various sorting algorithms manipulate data structures."
	/>
	<meta
		name="keywords"
		content="sorting algorithms, algorithm visualizer, bubble sort, quick sort, merge sort, heap sort, computer science, education, data structures"
	/>

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sortvis.pages.dev/" />
	<meta property="og:title" content="Sortvis - Sorting Algorithm Visualizer" />
	<meta
		property="og:description"
		content="Visualize how various sorting algorithms manipulate data structures."
	/>
	<meta property="og:image" content="https://sortvis.pages.dev/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://sortvis.pages.dev/" />
	<meta property="twitter:title" content="Sortvis - Sorting Algorithm Visualizer" />
	<meta
		property="twitter:description"
		content="Visualize how various sorting algorithms manipulate data structures."
	/>
	<meta property="twitter:image" content="https://sortvis.pages.dev/og-image.png" />
</svelte:head>

<ModeWatcher themeColors={{ light: 'oklch(1 0 0)', dark: 'oklch(0.145 0 0)' }} />
<div class="flex min-h-dvh flex-col bg-background">
	{@render children()}
</div>
