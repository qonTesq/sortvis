<script lang="ts">
	import Desktop from './DesktopFooter.svelte';
	import Mobile from './MobileFooter.svelte';

	import { isMobile } from '$state/media.svelte';
</script>

<header class="z-20 h-14 w-full">
	{#if isMobile.current}
		<Mobile />
	{:else}
		<Desktop />
	{/if}
</header>
