<script lang="ts">
	import { visualizer } from '$state';
	import StabilityBadge from './StabilityBadge.svelte';
</script>

<div
	class="flex h-12 w-full shrink-0 items-center justify-between px-4 text-xs font-bold tracking-widest text-muted-foreground uppercase"
>
	<div class="flex items-center gap-4">
		<div class="flex flex-col tabular-nums md:flex-row md:gap-1">
			Comparisons <span class="font-mono font-normal tracking-normal text-foreground"
				>{visualizer.stats.comparisons}</span
			>
		</div>
		<div class="flex flex-col tabular-nums md:flex-row md:gap-1">
			Swaps <span class="font-mono font-normal tracking-normal text-foreground"
				>{visualizer.stats.swaps}</span
			>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<div>
			Best <span class="font-mono font-normal tracking-normal text-foreground normal-case"
				>{visualizer.currentAlgorithmMetadata.minTimeComplexity}</span
			>
		</div>

		<div>
			Worst <span class="font-mono font-normal tracking-normal text-foreground normal-case"
				>{visualizer.currentAlgorithmMetadata.maxTimeComplexity}</span
			>
		</div>
		<div>
			Space <span class="font-mono font-normal tracking-normal text-foreground normal-case"
				>{visualizer.currentAlgorithmMetadata.spaceComplexity}</span
			>
		</div>

		<StabilityBadge stable={visualizer.currentAlgorithmMetadata.stable} />
	</div>
</div>
