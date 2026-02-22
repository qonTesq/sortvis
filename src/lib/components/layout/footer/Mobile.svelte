<script lang="ts">
	import { visualizer } from '$state';
	import type { SpeedLevel } from '$types';
	import { Button } from '$components/ui/button';
	import { Slider } from '$components/ui/slider';
	import { RotateCcw, Play, Pause, Shuffle, Sun, Moon } from '@lucide/svelte';
	import AlgoSelector from './AlgoSelector.svelte';
	import { Stats } from '$components/layout';
	import { toggleMode } from 'mode-watcher';

	const speedLevels: SpeedLevel[] = ['snail', 'slow', 'med', 'fast', 'rapid', 'flash'];
	const currentSpeedIndex = $derived(speedLevels.indexOf(visualizer.speed));
</script>

<div
	class="flex h-auto w-full flex-col gap-4 p-6 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
>
	<!-- Top: Sliders -->
	<div
		class="flex w-full flex-col items-center gap-4 text-xs font-bold tracking-widest text-muted-foreground uppercase"
	>
		<!-- Size Slider -->
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
		<!-- Speed Slider -->
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

	<!-- Middle: Algorithm Selector -->
	<div class="flex w-full items-center justify-between">
		<AlgoSelector />
	</div>

	<!-- Bottom: Controls -->
	<div class="flex w-full items-center justify-between gap-3">
		<!-- Left: Info -->
		<Stats />

		<!-- Center: Playback -->
		<div class="flex items-center gap-3">
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

		<!-- Right: Theme -->
		<Button
			onclick={toggleMode}
			variant="outline"
			size="icon"
			class="h-9 w-9 text-muted-foreground"
			aria-label="Toggle theme"
		>
			<Sun
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90!"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0!"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</div>
