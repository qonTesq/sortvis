<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<ModeWatcher />
<div class="flex min-h-dvh flex-col bg-background">
	{@render children()}
</div>
