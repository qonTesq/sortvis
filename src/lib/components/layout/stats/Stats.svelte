<script lang="ts">
	import Desktop from './DesktopStats.svelte';
	import Mobile from './MobileStats.svelte';
	import { isMobile } from '$state/media.svelte';
</script>

{#if isMobile.current}
	<Mobile />
{:else}
	<Desktop />
{/if}
