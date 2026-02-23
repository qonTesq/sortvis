<script>
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	$effect(() => {
		goto(resolve('/', {}), { replaceState: true });
	});
</script>
