<script lang="ts">
	import { visualizer } from '$store';
	import { render } from './renderer.svelte';
</script>

<div class="relative h-full min-h-0 w-full flex-1 overflow-hidden">
	<canvas
		{@attach render}
		class="block h-full w-full"
		aria-label="{visualizer.algorithmId} sorting visualization"
	></canvas>
</div>
