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
				class="size-9 text-muted-foreground"
				aria-label="Open menu"
			>
				<Info />
			</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="left" class="w-[90vw] sm:max-w-md">
		<Sheet.Header class="text-left">
			<!-- Title & Description -->
			<Sheet.Title class="flex items-center gap-3">
				<div class="text-2xl font-bold tracking-tight">
					{visualizer.currentAlgorithmMetadata.name}
				</div>
				<StabilityBadge stable={visualizer.currentAlgorithmMetadata.stable} />
			</Sheet.Title>
			<Sheet.Description class="text-sm text-muted-foreground">
				{visualizer.currentAlgorithmMetadata.description}
			</Sheet.Description>
		</Sheet.Header>
		<div
			class="grid grid-cols-2 gap-3 px-3 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
		>
			<Card.Root class="@container/card ">
				<Card.Header>
					<Card.Description>CMPs</Card.Description>
					<Card.Title class="font-mono text-lg font-semibold tabular-nums">
						{visualizer.stats.comparisons}
					</Card.Title>
					<Card.Action>
						<GitCompare class="size-4.5 text-muted-foreground" />
					</Card.Action>
				</Card.Header>
			</Card.Root>
			<Card.Root class="@container/card ">
				<Card.Header>
					<Card.Description>SWPs</Card.Description>
					<Card.Title class="font-mono text-lg font-semibold tabular-nums">
						{visualizer.stats.swaps}
					</Card.Title>
					<Card.Action>
						<ArrowRightLeft class="size-4.5 text-muted-foreground" />
					</Card.Action>
				</Card.Header>
			</Card.Root>

			<div class="col-span-2 px-20">
				<Separator />
			</div>

			<!-- Time Complexity (Best) -->
			<Card.Root class="@container/card col-span-2">
				<Card.Header>
					<Card.Description>Time (Best)</Card.Description>
					<Card.Title class="font-mono text-lg font-semibold tabular-nums">
						{visualizer.currentAlgorithmMetadata.minTimeComplexity}
					</Card.Title>
					<Card.Action>
						<Clock class="size-4.5 text-muted-foreground" />
					</Card.Action>
				</Card.Header>
			</Card.Root>

			<!-- Time Complexity (Worst) -->
			<Card.Root class="@container/card col-span-2">
				<Card.Header>
					<Card.Description>Time (Worst)</Card.Description>
					<Card.Title class="font-mono text-lg font-semibold tabular-nums">
						{visualizer.currentAlgorithmMetadata.maxTimeComplexity}
					</Card.Title>
					<Card.Action>
						<Clock class="size-4.5 text-muted-foreground" />
					</Card.Action>
				</Card.Header>
			</Card.Root>

			<!-- Space Complexity -->
			<Card.Root class="@container/card col-span-2">
				<Card.Header>
					<Card.Description>Space</Card.Description>
					<Card.Title class="font-mono text-lg font-semibold tabular-nums">
						{visualizer.currentAlgorithmMetadata.spaceComplexity}
					</Card.Title>
					<Card.Action>
						<Database class="size-4.5 text-muted-foreground" />
					</Card.Action>
				</Card.Header>
			</Card.Root>
		</div>
		<Sheet.Footer>
			<Sheet.Close class={buttonVariants({ variant: 'outline' })}>Close</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
