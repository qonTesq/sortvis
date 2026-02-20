<script lang="ts">
	import Desktop from './Desktop.svelte';
	import Mobile from './Mobile.svelte';
	import { isMobile } from '$state/media.svelte';
</script>

{#if isMobile.current}
	<Mobile />
{:else}
	<Desktop />
{/if}
