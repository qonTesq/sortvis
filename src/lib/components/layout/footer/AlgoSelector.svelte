<script lang="ts">
	import { visualizer } from '$state';
	import { isMobile } from '$state/media.svelte';
	import * as Popover from '$components/ui/popover/index.js';
	import * as Command from '$components/ui/command/index.js';
	import * as Drawer from '$components/ui/drawer/index.js';
	import { Button } from '$components/ui/button/index.js';
	import { Check, ChevronsUpDown } from '@lucide/svelte';
	import { cn } from '$lib/utils.js';
	import { algorithmMetadata } from '$config/algorithms';

	const algorithms = algorithmMetadata.map((a) => ({
		value: a.id,
		label: a.name.replace(' Sort', '')
	}));

	let open = $state(false);

	const handleSelect = (value: string) => {
		visualizer.setAlgorithm(value);
		open = false;
	};

	const selectedLabel = $derived(
		algorithms.find((a) => a.value === visualizer.algorithmId)?.label ?? 'Select algorithm...'
	);
</script>

{#if !isMobile.current}
	<Popover.Root bind:open>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					role="combobox"
					aria-label="Select algorithm"
					aria-expanded={open}
					{...props}
					class={cn('w-full justify-between')}
				>
					{selectedLabel}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-[220px] p-0" align="center">
			<Command.Root>
				<Command.Input placeholder="Search algorithm..." class="h-9" />
				<Command.List>
					<Command.Empty>No algorithm found.</Command.Empty>
					<Command.Group>
						{#each algorithms as algo (algo.value)}
							<Command.Item value={algo.value} onSelect={() => handleSelect(algo.value)}>
								<Check
									class={cn(
										'mr-2 h-4 w-4',
										visualizer.algorithmId !== algo.value && 'text-transparent'
									)}
								/>
								{algo.label}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	</Popover.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class="w-full justify-between"
					aria-label="Select algorithm"
					{...props}
				>
					{selectedLabel}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="mt-4 border-t">
				<Command.Root class="bg-primary-background">
					<Command.Input placeholder="Search algorithm..." />
					<Command.List>
						<Command.Empty>No algorithm found.</Command.Empty>
						<Command.Group>
							{#each algorithms as algo (algo.value)}
								<Command.Item value={algo.value} onSelect={() => handleSelect(algo.value)}>
									<Check
										class={cn(
											'mr-2 h-4 w-4',
											visualizer.algorithmId !== algo.value && 'text-transparent'
										)}
									/>
									{algo.label}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
