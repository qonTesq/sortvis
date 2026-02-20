<script lang="ts">
	import { visualizer } from '$state';

	const ALGO_LABEL: Record<string, string> = {
		quick: 'Pivot',
		merge: 'Merge'
	};

	let specialLabel = $derived(ALGO_LABEL[visualizer.algorithmId]);
</script>

<ul
	class="absolute top-1 flex w-full items-center justify-between px-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase sm:top-2 sm:px-20 lg:px-40 xl:px-60"
	aria-label="Algorithm State Legend"
>
	<li class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-(--bar-default)"></span>
		<span class="text-[9px] sm:text-[10px]">Idle</span>
	</li>
	<li class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-(--bar-comparing)"></span>
		<span class="text-[9px] sm:text-[10px]">Comparing</span>
	</li>
	<li class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-(--bar-swapping)"></span>
		<span class="text-[9px] sm:text-[10px]">Swapping</span>
	</li>
	<li class="flex items-center gap-2">
		<span class="h-2 w-2 rounded-full bg-(--bar-sorted)"></span>
		<span class="text-[9px] sm:text-[10px]">Sorted</span>
	</li>
	{#if specialLabel}
		<li class="flex items-center gap-2">
			<span class="h-2 w-2 rounded-full bg-(--bar-pivot)"></span>
			<span class="text-[9px] sm:text-[10px]">{specialLabel}</span>
		</li>
	{/if}
</ul>
