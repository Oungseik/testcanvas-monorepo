<script lang="ts">
	import Grid from "$lib/components/svg/Grid.svelte";
	import List from "$lib/components/svg/List.svelte";
	import { page } from "$app/state";

	let layout: "list" | "grid" = $state("grid");
	let { children } = $props();

	const hiddenNav = $derived(page.url.pathname.includes("control"));
</script>

<div class={`navbar flex justify-between bg-base-100 px-4 ${hiddenNav ? "hidden" : ""}`}>
	<h2 class="text-2xl font-bold">Devices</h2>

	<input
		id="layout-list"
		type="radio"
		name="layout"
		value="list"
		class="hidden"
		bind:group={layout}
	/>
	<input
		id="layout-grid"
		type="radio"
		name="layout"
		value="grid"
		class=" hidden"
		bind:group={layout}
	/>
	<div class="join">
		<div>
			<label
				class={"btn join-item " + (layout === "list" ? " text-primary" : "")}
				for="layout-list"
			>
				<List class="inline-block" />
				List
			</label>
		</div>
		<div>
			<label
				class={"btn join-item " + (layout === "grid" ? " text-primary" : "")}
				for="layout-grid"
			>
				<Grid class="inline-block" />
				Grid</label
			>
		</div>
	</div>
</div>

{@render children()}
