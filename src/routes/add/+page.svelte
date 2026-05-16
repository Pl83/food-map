<script lang="ts">
	import { enhance } from '$app/forms';
	import TagSelector from '$lib/components/TagSelector.svelte';
	import { PRICE_LABELS } from '$lib/types';
	import type { FoodTag } from '$lib/types';

	let { data, form }: { data: { tags: FoodTag[] }; form: any } = $props();

	let selectedTags = $state<number[]>([]);
	let submitting = $state(false);
</script>

<svelte:head>
	<title>FoodMap — Ajouter un restaurant</title>
</svelte:head>

<div class="max-w-lg mx-auto py-8 px-4">
	<div class="flex items-center gap-3 mb-6">
		<a href="/" class="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Retour à la carte">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 19l-7-7m0 0l7-7m-7 7h18"
				/>
			</svg>
		</a>
		<h1 class="text-2xl font-bold text-gray-900">Ajouter un restaurant</h1>
	</div>

	{#if form?.error}
		<div class="mb-5 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
			{form.error}
		</div>
	{/if}

	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
		class="space-y-5"
	>
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1" for="name">
				Nom du restaurant
			</label>
			<input
				id="name"
				name="name"
				type="text"
				required
				value={form?.name ?? ''}
				placeholder="Ex: Le Petit Bistrot"
				class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
			/>
		</div>

		<div>
			<label class="block text-sm font-medium text-gray-700 mb-1" for="address">
				Adresse
				<span class="text-xs font-normal text-gray-400 ml-1">(géocodée automatiquement)</span>
			</label>
			<input
				id="address"
				name="address"
				type="text"
				required
				value={form?.address ?? ''}
				placeholder="Ex: 15 rue de la Paix, Paris"
				class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
			/>
		</div>

		<div>
			<span class="block text-sm font-medium text-gray-700 mb-2">Niveau de prix</span>
			<div class="flex gap-2" role="radiogroup" aria-label="Niveau de prix">
				{#each [1, 2, 3, 4] as p}
					<label class="cursor-pointer flex-1">
						<input type="radio" name="price_level" value={p} required class="sr-only peer" />
						<span
							class="block text-center py-2 border rounded-lg text-sm font-medium transition-colors
								peer-checked:bg-emerald-600 peer-checked:text-white peer-checked:border-emerald-600
								hover:bg-gray-50 border-gray-200 text-gray-700 cursor-pointer"
						>
							{PRICE_LABELS[p as 1 | 2 | 3 | 4]}
						</span>
					</label>
				{/each}
			</div>
		</div>

		<div>
			<span class="block text-sm font-medium text-gray-700 mb-2">
				Type de cuisine
				<span class="text-xs font-normal text-gray-400 ml-1">(optionnel)</span>
			</span>
			<TagSelector allTags={data.tags} bind:selectedIds={selectedTags} />
			{#each selectedTags as id}
				<input type="hidden" name="tags" value={id} />
			{/each}
		</div>

		<button
			type="submit"
			disabled={submitting}
			class="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold text-sm
				hover:bg-emerald-700 active:scale-[0.98] transition-all
				disabled:opacity-60 disabled:cursor-not-allowed"
		>
			{submitting ? 'Enregistrement...' : 'Ajouter le restaurant'}
		</button>
	</form>
</div>
