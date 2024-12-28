<script lang="ts">
	import { socket } from "$lib/stores/socket.svelte";

	$effect(() => {
		socket?.socket?.on("connect_error", console.error);
	});
</script>

<h1>Hello, Welcome from test canvas</h1>
