<script lang="ts">
	// import Mobile from "$lib/components/svg/Mobile.svelte";

	// function showModal(id: string) {
	//   (document.getElementById(id) as HTMLDialogElement).showModal();
	// }
</script>

<section class="px-4">
	<div>
		<p class="text-sm opacity-50">
			TOTAL: {0}
			{"DEVICES"}
		</p>
	</div>
	<div class="divider mt-0"></div>
</section>
<section class="grid grid-cols-3 gap-4 px-4 xl:grid-cols-5">
	<!-- {#await data.devices} -->
	<!--   <dialog id="my_modal_1" class="modal modal-open"> -->
	<!--     <span class="loading loading-spinner text-primary w-28"></span> -->
	<!--   </dialog> -->
	<!-- {:then} -->
	<!--   {#each $devices as device, i (device.udid)} -->
	<!--     <button -->
	<!--       class="btn h-auto shadow-md rounded-md flex flex-row justify-between flex-nowrap font-normal pl-4 pr-0 py-4 text-left" -->
	<!--       onclick={() => showModal(`my_modal_${i}`)}> -->
	<!--       <div> -->
	<!--         <h2 class="text-lg font-bold">{device?.model || "Vivo"}</h2> -->
	<!--         <p class="text-sm">{device.os} 12, 6.3&quot;</p> -->
	<!--         <div class="badge badge-success badge-outline mt-4">Active</div> -->
	<!--       </div> -->
	<!--       <Mobile width="6rem" height="6rem" /> -->
	<!--     </button> -->
	<!--   {/each} -->
	<!-- {:catch error} -->
	<!--   {error.message} -->
	<!-- {/await} -->
</section>

<!-- Open the modal using ID.showModal() method -->
<dialog id="my_modal_0" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Hello!</h3>
		<p class="py-4">Press ESC key or click outside to close</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
