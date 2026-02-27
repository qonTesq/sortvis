<script lang="ts">
	import { visualizer } from '$store';
	import { Button } from '$components/ui/button';
	import { RotateCcw, Play, Pause, Shuffle } from '@lucide/svelte';
</script>

<Button
	variant="ghost"
	class="size-11 rounded-full text-muted-foreground hover:text-foreground sm:size-10"
	onclick={() => visualizer.reset()}
	disabled={visualizer.status === 'playing'}
	aria-label="Reset array"
>
	<RotateCcw class="size-4.5 sm:size-4" />
</Button>

<Button
	class="relative size-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 sm:size-12"
	onclick={() => (visualizer.status === 'playing' ? visualizer.pause() : visualizer.play())}
	aria-label={visualizer.status === 'playing' ? 'Pause animation' : 'Play animation'}
>
	<Pause
		class="size-5.5 transition-all! sm:size-4.5 {visualizer.status === 'playing'
			? 'scale-100 opacity-100'
			: 'scale-75 opacity-0'}"
		fill="currentColor"
	/>
	<Play
		class="absolute size-5.5 transition-all! sm:size-4.5 {visualizer.status === 'playing'
			? 'scale-75 opacity-0'
			: 'scale-100 opacity-100'}"
		fill="currentColor"
	/>
</Button>

<Button
	variant="ghost"
	class="size-11 rounded-full text-muted-foreground hover:text-foreground sm:size-10"
	onclick={() => visualizer.generateArray()}
	disabled={visualizer.status === 'playing'}
	aria-label="Shuffle array"
>
	<Shuffle class="size-4.5 sm:size-4" />
</Button>
