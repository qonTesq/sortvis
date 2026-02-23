<script>
	import { goto } from '$app/navigation';

	$effect(() => {
		goto('/', { replaceState: true });
	});
</script>
