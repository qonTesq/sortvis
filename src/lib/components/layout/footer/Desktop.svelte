<script lang="ts">
	import { visualizer } from '$state';
	import type { SpeedLevel } from '$types';
	import { Button } from '$components/ui/button';
	import { Slider } from '$components/ui/slider';
	import { Separator } from '$components/ui/separator';
	import AlgoSelector from './AlgoSelector.svelte';
	import { RotateCcw, Play, Pause, Shuffle } from '@lucide/svelte';

	const speedLevels: SpeedLevel[] = ['snail', 'slow', 'med', 'fast', 'rapid', 'flash'];
	const currentSpeedIndex = $derived(speedLevels.indexOf(visualizer.speed));
</script>

<div class="flex h-20 w-full flex-row items-center justify-between gap-6 px-4">
	<!-- Left: Playback Controls -->
	<div class="flex items-center justify-start gap-3">
		<Button
			variant="outline"
			size="icon"
			class="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
			onclick={() => visualizer.reset()}
			disabled={visualizer.status === 'playing'}
			aria-label="Reset array"
		>
			<RotateCcw class="h-4 w-4" />
			<span class="sr-only">Reset array</span>
		</Button>

		<Button
			size="icon"
			class="relative h-12 w-12 rounded-xl bg-foreground text-background hover:bg-foreground/90"
			onclick={() => (visualizer.status === 'playing' ? visualizer.pause() : visualizer.play())}
			aria-label={visualizer.status === 'playing' ? 'Pause animation' : 'Play animation'}
		>
			<Pause
				class="h-5 w-5 transition-all! {visualizer.status === 'playing'
					? 'scale-100 opacity-100'
					: 'scale-75 opacity-0'}"
				fill="currentColor"
			/>
			<Play
				class="absolute h-5 w-5 transition-all! {visualizer.status === 'playing'
					? 'scale-75 opacity-0'
					: 'scale-100 opacity-100'}"
				fill="currentColor"
			/>
			<span class="sr-only"
				>{visualizer.status === 'playing' ? 'Pause animation' : 'Play animation'}</span
			>
		</Button>

		<Button
			variant="outline"
			size="icon"
			class="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
			onclick={() => visualizer.generateArray()}
			disabled={visualizer.status === 'playing'}
			aria-label="Shuffle array"
		>
			<Shuffle class="h-4 w-4" />
			<span class="sr-only">Shuffle array</span>
		</Button>
	</div>

	<!-- Center: Algorithm Selector -->
	<div class="flex items-center justify-center">
		<AlgoSelector />
	</div>

	<!-- Right: Sliders -->
	<div
		class="flex flex-1 flex-row items-center gap-6 text-xs font-bold tracking-widest text-muted-foreground uppercase"
	>
		<div class="flex flex-1 items-center gap-3">
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

			<span class="text-left text-foreground">{visualizer.size}</span>
		</div>

		<Separator orientation="vertical" class="h-6" />

		<div class="flex flex-1 items-center gap-3">
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

			<span class="text-left text-foreground uppercase">{visualizer.speed}</span>
		</div>
	</div>
</div>
