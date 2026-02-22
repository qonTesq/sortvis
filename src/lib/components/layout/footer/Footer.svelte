<script lang="ts">
	import MobileFooter from './MobileFooter.svelte';
	import DesktopFooter from './DesktopFooter.svelte';
	import { isMobile } from '$state/media.svelte';
</script>

<footer class="w-full shrink-0 border-t border-border">
	{#if isMobile.current}
		<MobileFooter />
	{:else}
		<DesktopFooter />
	{/if}
</footer>
