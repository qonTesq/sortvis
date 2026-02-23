<script lang="ts">
	import { visualizer } from '$state';
	import { Button } from '$components/ui/button';
	import { RotateCcw, Play, Pause, Shuffle } from '@lucide/svelte';
</script>

<Button
	variant="outline"
	size="icon"
	class="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
	onclick={() => visualizer.reset()}
	disabled={visualizer.status === 'playing'}
	aria-label="Reset array"
>
	<RotateCcw class="h-4 w-4" />
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
</Button>
