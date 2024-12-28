<script>
	let { children } = $props();
</script>

<div class="navbar flex justify-between bg-base-100">
	<h2 class="text-2xl font-bold">Dashboard</h2>
</div>

{@render children()}
