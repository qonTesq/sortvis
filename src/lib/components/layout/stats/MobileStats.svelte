<script lang="ts">
	import { visualizer } from '$store';
	import { Button, buttonVariants } from '$components/ui/button';
	import * as Sheet from '$components/ui/sheet';
	import * as Card from '$components/ui/card';
	import { Info, ArrowRightLeft, GitCompare, Clock, Database } from '@lucide/svelte';
	import { Separator } from '$components/ui/separator';
	import StabilityBadge from './StabilityBadge.svelte';
</script>

<Sheet.Root>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				{...props}
				class="size-11 text-muted-foreground"
				aria-label="Open menu"
			>
				<Info class="size-4.5" />
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="left" class="w-[90vw] sm:max-w-md">
		<Sheet.Header class="text-left">
			<!-- Title & Description -->
			<Sheet.Title class="flex items-center gap-4">
				<div class="text-2xl font-bold tracking-tight">
					{visualizer.currentAlgorithmMetadata.name}
				</div>
				<StabilityBadge stable={visualizer.currentAlgorithmMetadata.stable} />
			</Sheet.Title>
			<Sheet.Description class="text-sm text-muted-foreground">
				{visualizer.currentAlgorithmMetadata.description}
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid grid-cols-2 gap-4 px-4">
			<Card.Root
				class="@container/card relative isolate col-span-1 overflow-hidden bg-gradient-to-br from-foreground/2 via-foreground/1 to-transparent p-5 text-left shadow-none transition-all duration-150 dark:from-foreground/4 dark:via-foreground/2 dark:to-transparent"
			>
				<div
					class="stat-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay dark:opacity-5"
				></div>
				<div
					class="pointer-events-none absolute -inset-1/2 h-[200%] w-[200%] -translate-x-[30%] -translate-y-[10%] rotate-12 bg-linear-to-br from-transparent via-white/50 to-transparent dark:via-foreground/3"
				></div>
				<Card.Header class="relative flex flex-col gap-1.5 space-y-0 p-0 text-left">
					<div class="flex items-center gap-1.5">
						<span class="text-muted-foreground">
							<GitCompare class="size-3.5" />
						</span>
						<Card.Description class="text-[10px] tracking-wider uppercase">
							Comparisons
						</Card.Description>
					</div>
					<div class="flex items-baseline gap-1.5">
						<Card.Title class="text-lg tabular-nums">
							{visualizer.stats.comparisons}
						</Card.Title>
					</div>
				</Card.Header>
			</Card.Root>
			<Card.Root
				class="@container/card relative isolate col-span-1 overflow-hidden bg-gradient-to-br from-foreground/2 via-foreground/1 to-transparent p-5 text-left shadow-none transition-all duration-150 dark:from-foreground/4 dark:via-foreground/2 dark:to-transparent"
			>
				<div
					class="stat-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay dark:opacity-5"
				></div>
				<div
					class="pointer-events-none absolute -inset-1/2 h-[200%] w-[200%] -translate-x-[30%] -translate-y-[10%] rotate-12 bg-linear-to-br from-transparent via-white/50 to-transparent dark:via-foreground/3"
				></div>
				<Card.Header class="relative flex flex-col gap-1.5 space-y-0 p-0 text-left">
					<div class="flex items-center gap-1.5">
						<span class="text-muted-foreground">
							<ArrowRightLeft class="size-3.5" />
						</span>
						<Card.Description class="text-[10px] tracking-wider uppercase">Swaps</Card.Description>
					</div>
					<div class="flex items-baseline gap-1.5">
						<Card.Title class="text-lg tabular-nums">
							{visualizer.stats.swaps}
						</Card.Title>
					</div>
				</Card.Header>
			</Card.Root>

			<div class="col-span-2 px-20">
				<Separator />
			</div>

			<!-- Time Complexity (Best) -->
			<Card.Root
				class="@container/card relative isolate col-span-2 overflow-hidden bg-gradient-to-br from-foreground/2 via-foreground/1 to-transparent p-5 text-left shadow-none transition-all duration-150 dark:from-foreground/4 dark:via-foreground/2 dark:to-transparent"
			>
				<div
					class="stat-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay dark:opacity-5"
				></div>
				<div
					class="pointer-events-none absolute -inset-1/2 h-[200%] w-[200%] -translate-x-[30%] -translate-y-[10%] rotate-12 bg-linear-to-br from-transparent via-white/50 to-transparent dark:via-foreground/3"
				></div>
				<Card.Header class="relative flex flex-col gap-1.5 space-y-0 p-0 text-left">
					<div class="flex items-center gap-1.5">
						<span class="text-muted-foreground">
							<Clock class="size-3.5" />
						</span>
						<Card.Description class="text-[10px] tracking-wider uppercase">
							Time (Best)
						</Card.Description>
					</div>
					<div class="flex items-baseline gap-1.5">
						<Card.Title class="font-mono text-lg font-medium tracking-tight tabular-nums">
							{visualizer.currentAlgorithmMetadata.minTimeComplexity}
						</Card.Title>
					</div>
				</Card.Header>
			</Card.Root>

			<!-- Time Complexity (Worst) -->
			<Card.Root
				class="@container/card relative isolate col-span-2 overflow-hidden bg-gradient-to-br from-foreground/2 via-foreground/1 to-transparent p-5 text-left shadow-none transition-all duration-150 dark:from-foreground/4 dark:via-foreground/2 dark:to-transparent"
			>
				<div
					class="stat-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay dark:opacity-5"
				></div>
				<div
					class="pointer-events-none absolute -inset-1/2 h-[200%] w-[200%] -translate-x-[30%] -translate-y-[10%] rotate-12 bg-linear-to-br from-transparent via-white/50 to-transparent dark:via-foreground/3"
				></div>
				<Card.Header class="relative flex flex-col gap-1.5 space-y-0 p-0 text-left">
					<div class="flex items-center gap-1.5">
						<span class="text-muted-foreground">
							<Clock class="size-3.5" />
						</span>
						<Card.Description class="text-[10px] tracking-wider uppercase">
							Time (Worst)
						</Card.Description>
					</div>
					<div class="flex items-baseline gap-1.5">
						<Card.Title class="font-mono text-lg font-medium tracking-tight tabular-nums">
							{visualizer.currentAlgorithmMetadata.maxTimeComplexity}
						</Card.Title>
					</div>
				</Card.Header>
			</Card.Root>

			<!-- Space Complexity -->
			<Card.Root
				class="@container/card relative isolate col-span-2 overflow-hidden bg-gradient-to-br from-foreground/2 via-foreground/1 to-transparent p-5 text-left shadow-none transition-all duration-150 dark:from-foreground/4 dark:via-foreground/2 dark:to-transparent"
			>
				<div
					class="stat-noise pointer-events-none absolute inset-0 opacity-10 mix-blend-overlay dark:opacity-5"
				></div>
				<div
					class="pointer-events-none absolute -inset-1/2 h-[200%] w-[200%] -translate-x-[30%] -translate-y-[10%] rotate-12 bg-linear-to-br from-transparent via-white/50 to-transparent dark:via-foreground/3"
				></div>
				<Card.Header class="relative flex flex-col gap-1.5 space-y-0 p-0 text-left">
					<div class="flex items-center gap-1.5">
						<span class="text-muted-foreground">
							<Database class="size-3.5" />
						</span>
						<Card.Description class="text-[10px] tracking-wider uppercase">Space</Card.Description>
					</div>
					<div class="flex items-baseline gap-1.5">
						<Card.Title class="font-mono text-lg font-medium tracking-tight tabular-nums">
							{visualizer.currentAlgorithmMetadata.spaceComplexity}
						</Card.Title>
					</div>
				</Card.Header>
			</Card.Root>
		</div>
		<Sheet.Footer>
			<Sheet.Close class="h-11 text-[15px] {buttonVariants({ variant: 'outline' })}"
				>Close</Sheet.Close
			>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>

<style>
	.stat-noise {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	}
</style>
