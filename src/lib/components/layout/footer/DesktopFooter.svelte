<script lang="ts">
	import { visualizer } from '$store';
	import { Slider } from '$components/ui/slider';
	import { Separator } from '$components/ui/separator';
	import AlgoSelector from './AlgoSelector.svelte';
	import PlaybackControls from './PlaybackControls.svelte';
	import { speedLevels } from '$config/speeds';

	const currentSpeedIndex = $derived(speedLevels.indexOf(visualizer.speed));
</script>

<div class="flex w-full justify-center px-6 py-3 lg:h-20 lg:items-center lg:py-0">
	<div
		class="grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] grid-rows-2 lg:flex lg:max-w-5xl lg:flex-row lg:items-center"
	>
		<div
			class="col-1 row-1 flex min-w-0 items-center gap-3 text-xs font-bold tracking-widest text-muted-foreground uppercase lg:order-5 lg:col-[unset] lg:row-[unset] lg:min-w-0 lg:flex-1"
		>
			<span class="shrink-0">Size</span>
			<Slider
				type="single"
				value={visualizer.size}
				min={10}
				max={512}
				step={1}
				onValueChange={(v: number) => visualizer.setSize(v)}
				class="min-w-0 flex-1"
				aria-label="Array Size"
			/>
			<span class="shrink-0 text-foreground tabular-nums">{visualizer.size}</span>
		</div>

		<div class="col-2 row-[1/3] flex items-center justify-center lg:hidden">
			<div class="mx-6 h-10 w-px shrink-0 bg-border"></div>
		</div>

		<div
			class="col-3 row-1 flex min-w-0 items-center gap-3 text-xs font-bold tracking-widest text-muted-foreground uppercase lg:order-7 lg:col-[unset] lg:row-[unset] lg:min-w-0 lg:flex-1"
		>
			<span class="shrink-0">Speed</span>
			<Slider
				type="single"
				value={currentSpeedIndex}
				min={0}
				max={5}
				step={1}
				onValueChange={(v: number) => visualizer.setSpeed(speedLevels[v] ?? 'med')}
				class="min-w-0 flex-1"
				aria-label="Sorting Speed"
			/>
			<span class="shrink-0 text-foreground uppercase">{visualizer.speed}</span>
		</div>

		<div
			class="col-1 row-2 flex items-center justify-end gap-3 lg:order-1 lg:col-[unset] lg:row-[unset] lg:shrink-0"
		>
			<PlaybackControls />
		</div>

		<Separator orientation="vertical" class="mx-6 hidden h-6 shrink-0 lg:order-2 lg:block" />

		<div
			class="col-3 row-2 flex w-55 items-center lg:order-3 lg:col-[unset] lg:row-[unset] lg:shrink-0"
		>
			<AlgoSelector />
		</div>

		<Separator orientation="vertical" class="mx-6 hidden h-6 shrink-0 lg:order-4 lg:block" />

		<Separator orientation="vertical" class="mx-6 hidden h-6 shrink-0 lg:order-6 lg:block" />
	</div>
</div>
