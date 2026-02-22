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

<div class="flex w-full justify-center px-6 py-3 lg:h-20 lg:items-center lg:py-0">
	<div
		class="grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] grid-rows-2 lg:flex lg:max-w-5xl lg:flex-row lg:items-center"
	>
		<div
			class="[grid-column:1] [grid-row:1] flex min-w-0 items-center gap-3 text-xs font-bold tracking-widest text-muted-foreground uppercase lg:order-5 lg:[grid-column:unset] lg:[grid-row:unset] lg:min-w-0 lg:flex-1"
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

		<div class="[grid-column:2] [grid-row:1/3] flex items-center justify-center lg:hidden">
			<div class="mx-6 h-10 w-px shrink-0 bg-border"></div>
		</div>

		<div
			class="[grid-column:3] [grid-row:1] flex min-w-0 items-center gap-3 text-xs font-bold tracking-widest text-muted-foreground uppercase lg:order-7 lg:[grid-column:unset] lg:[grid-row:unset] lg:min-w-0 lg:flex-1"
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
			class="[grid-column:1] [grid-row:2] flex items-center justify-end gap-3 lg:order-1 lg:[grid-column:unset] lg:[grid-row:unset] lg:shrink-0"
		>
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

		<Separator orientation="vertical" class="mx-6 hidden h-6 shrink-0 lg:order-2 lg:block" />

		<div
			class="[grid-column:3] [grid-row:2] flex w-[220px] items-center lg:order-3 lg:[grid-column:unset] lg:[grid-row:unset] lg:shrink-0"
		>
			<AlgoSelector />
		</div>

		<Separator orientation="vertical" class="mx-6 hidden h-6 shrink-0 lg:order-4 lg:block" />

		<Separator orientation="vertical" class="mx-6 hidden h-6 shrink-0 lg:order-6 lg:block" />
	</div>
</div>
