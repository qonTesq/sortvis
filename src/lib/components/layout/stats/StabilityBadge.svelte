<script lang="ts">
	import { Badge } from '$components/ui/badge';

	let { stable }: { stable: boolean } = $props();
</script>

{#if stable}
	<Badge
		variant="secondary"
		class="mt-0.5 h-5 rounded-sm text-[10px] font-bold tracking-widest text-emerald-600 uppercase"
	>
		Stable
	</Badge>
{:else}
	<Badge
		variant="secondary"
		class="mt-0.5 h-5 rounded-sm text-[10px] font-bold tracking-widest text-destructive uppercase"
	>
		Unstable
	</Badge>
{/if}
