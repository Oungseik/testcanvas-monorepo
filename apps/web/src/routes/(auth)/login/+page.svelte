<script lang="ts">
	import { superForm } from "sveltekit-superforms";

	let { data } = $props();
	const { form, errors, message, enhance } = superForm(data.form);
</script>

{#if $message}
	<div class="message">{$message}</div>
{/if}

<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md space-y-3 rounded-lg bg-base-200 p-8 shadow-md">
		<h1 class="text-center text-2xl font-bold">Login</h1>
		<form use:enhance class="space-y-6" method="POST">
			<div class="form-control">
				<label class="label" for="email">
					<span class="label-text">Email</span>
				</label>
				<input
					type="email"
					id="email"
					name="email"
					aria-invalid={$errors.email ? "true" : undefined}
					bind:value={$form.email}
					placeholder="Enter your email"
					class="input input-bordered w-full"
					required
				/>
				{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
			</div>
			<div class="form-control">
				<label class="label" for="password">
					<span class="label-text">Password</span>
				</label>
				<input
					type="password"
					id="password"
					name="password"
					aria-invalid={$errors.password ? "true" : undefined}
					bind:value={$form.password}
					placeholder="Enter your password"
					class="input input-bordered w-full"
					required
				/>
				{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
			</div>
			<div class="form-control">
				<button type="submit" class="btn btn-primary w-full">Login</button>
			</div>
		</form>
	</div>
</div>
