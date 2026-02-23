<script lang="ts">
	import { visualizer } from '$store';
	import { Button } from '$components/ui/button';
	import { Separator } from '$components/ui/separator';
	import { Sun, Moon } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<div class="flex h-full w-full items-center justify-between border-b border-border pl-4">
	<div class="flex items-center">
		<h1 class="flex -translate-y-0.5 items-center text-xl font-bold tracking-tight">sortvis</h1>
		<Separator orientation="vertical" class="mx-4 h-5" />
	</div>

	<div class="flex flex-1 items-center overflow-hidden">
		<p class="truncate text-xs text-muted-foreground">
			{visualizer.currentAlgorithmMetadata.description}
		</p>
	</div>

	<Button
		onclick={toggleMode}
		variant="outline"
		size="icon"
		class="mr-4 text-muted-foreground"
		aria-label="Toggle theme"
	>
		<Sun class="size-4 scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90!" />
		<Moon class="absolute size-4 scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0!" />
		<span class="sr-only">Toggle theme</span>
	</Button>
</div>
