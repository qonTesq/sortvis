<script lang="ts">
	import { visualizer } from '$store';
	import { Button } from '$components/ui/button';
	import { Slider } from '$components/ui/slider';
	import { Sun, Moon } from '@lucide/svelte';
	import AlgoSelector from './AlgoSelector.svelte';
	import MobileStats from '$components/layout/stats/MobileStats.svelte';
	import PlaybackControls from './PlaybackControls.svelte';
	import { toggleMode } from 'mode-watcher';
	import { speedLevels } from '$config/speeds';

	const currentSpeedIndex = $derived(speedLevels.indexOf(visualizer.speed));
</script>

<div class="flex h-auto w-full flex-col gap-4 p-4">
	<div
		class="flex w-full flex-col items-center gap-4 text-xs font-bold tracking-widest text-muted-foreground uppercase"
	>
		<div class="flex w-full flex-1 items-center gap-2">
			<span class="w-10 text-right">Size</span>
			<Slider
				type="single"
				value={visualizer.size}
				min={10}
				max={512}
				step={1}
				onValueChange={(v: number) => visualizer.setSize(v)}
				class="flex-1"
				aria-label="Array Size"
			/>
			<span class="w-10 text-left text-foreground">{visualizer.size}</span>
		</div>
		<div class="flex w-full flex-1 items-center gap-2">
			<span class="w-10 text-right">Speed</span>
			<Slider
				type="single"
				value={currentSpeedIndex}
				min={0}
				max={5}
				step={1}
				onValueChange={(v: number) => visualizer.setSpeed(speedLevels[v] ?? 'med')}
				class="flex-1"
				aria-label="Sorting Speed"
			/>
			<span class="w-10 text-left text-foreground uppercase">{visualizer.speed}</span>
		</div>
	</div>

	<div class="flex w-full items-center justify-between">
		<AlgoSelector />
	</div>

	<div class="flex w-full items-center justify-between gap-3">
		<MobileStats />

		<div class="flex items-center gap-3">
			<PlaybackControls />
		</div>

		<Button
			onclick={toggleMode}
			variant="outline"
			size="icon"
			class="size-11 text-muted-foreground"
			aria-label="Toggle theme"
		>
			<Sun class="size-4.5 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90!" />
			<Moon
				class="absolute size-4.5 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0!"
			/>
		</Button>
	</div>
</div>
