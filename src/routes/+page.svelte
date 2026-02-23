<script lang="ts">
	import { visualizer, isMobile } from '$store';
	import { Canvas, Header, Footer, Stats, Legend } from '$components/layout';
</script>

<div class="flex h-dvh w-full flex-col overflow-hidden bg-background font-sans text-foreground">
	<Header />

	<div class="relative min-h-0 w-full flex-1 pt-5">
		<Legend />

		<div
			class="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.03] select-none dark:opacity-5"
			aria-hidden="true"
		>
			<h2
				class="absolute top-8 left-4 text-left text-[10vw] leading-[0.8] font-black tracking-tighter text-foreground uppercase sm:left-8"
			>
				<span class="block">{visualizer.algorithmId}</span>
				<span class="block">sort</span>
			</h2>
		</div>

		<div class="relative z-10 h-full w-full px-1">
			<Canvas />
		</div>
	</div>

	{#if !isMobile.current}
		<Stats />
	{/if}

	<Footer />
</div>
