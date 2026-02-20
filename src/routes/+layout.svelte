<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const title = 'Sortvis - Sorting Algorithm Visualizer';
	const description = 'Visualize how different sorting algorithms work.';
	const url = 'https://sortvis.pages.dev/';
	const imageUrl = 'https://sortvis.pages.dev/og-image.png';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="sorting algorithms, algorithm visualizer, bubble sort, quick sort, merge sort, heap sort, computer science, education, data structures"
	/>
	<meta name="author" content="qonTesq" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={url} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	<meta property="twitter:image" content={imageUrl} />
</svelte:head>

<ModeWatcher />
<div class="flex min-h-dvh flex-col bg-background">
	{@render children()}
</div>
