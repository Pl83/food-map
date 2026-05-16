<script lang="ts">
	import type { FoodTag, FilterState, PriceLevel } from '$lib/types';
	import { PRICE_LABELS } from '$lib/types';
	import TagSelector from './TagSelector.svelte';

	interface Props {
		filters: FilterState;
		allTags: FoodTag[];
	}

	let { filters = $bindable(), allTags }: Props = $props();

	const prices: PriceLevel[] = [1, 2, 3, 4];

	function isActivePrice(p: PriceLevel) {
		return p >= filters.minPrice && p <= filters.maxPrice;
	}

	function handlePriceClick(p: PriceLevel) {
		if (filters.minPrice === filters.maxPrice && filters.minPrice === p) {
			// Reset to all prices
			filters = { ...filters, minPrice: 1, maxPrice: 4 };
		} else if (p <= filters.minPrice) {
			filters = { ...filters, minPrice: p };
		} else {
			filters = { ...filters, maxPrice: p };
		}
	}

	function clearAll() {
		filters = { search: '', tags: [], minPrice: 1, maxPrice: 4 };
	}

	let hasActiveFilters = $derived(
		!!filters.search || filters.tags.length > 0 || filters.minPrice !== 1 || filters.maxPrice !== 4
	);
</script>

<div class="space-y-5 w-full">
	<div class="flex items-center justify-between">
		<h2 class="font-semibold text-gray-800 text-sm uppercase tracking-wide hidden md:block">Filtres</h2>
		{#if hasActiveFilters}
			<button
				onclick={clearAll}
				class="text-xs text-emerald-600 hover:text-emerald-800 underline ml-auto"
			>
				Tout effacer
			</button>
		{/if}
	</div>

	<!-- Search -->
	<div>
		<label
			for="filter-search"
			class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
		>
			Recherche
		</label>
		<div class="relative">
			<svg
				class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
			<input
				id="filter-search"
				type="search"
				bind:value={filters.search}
				placeholder="Nom du restaurant..."
				class="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm
					focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
			/>
		</div>
	</div>

	<!-- Price range -->
	<div>
		<span class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
			Fourchette de prix
		</span>
		<div class="flex gap-1.5">
			{#each prices as p}
				<button
					onclick={() => handlePriceClick(p)}
					class="flex-1 py-2 text-sm font-medium rounded-lg border transition-colors
						{isActivePrice(p)
						? 'bg-emerald-600 text-white border-emerald-600'
						: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}"
				>
					{PRICE_LABELS[p]}
				</button>
			{/each}
		</div>
		{#if filters.minPrice !== 1 || filters.maxPrice !== 4}
			<p class="text-xs text-gray-400 mt-1">
				{PRICE_LABELS[filters.minPrice]} à {PRICE_LABELS[filters.maxPrice]}
			</p>
		{/if}
	</div>

	<!-- Tags -->
	<div>
		<div class="flex items-center justify-between mb-1.5">
			<span class="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
				Type de cuisine
			</span>
			{#if filters.tags.length > 0}
				<button
					onclick={() => (filters = { ...filters, tags: [] })}
					class="text-xs text-gray-400 hover:text-gray-600"
				>
					Effacer
				</button>
			{/if}
		</div>
		<TagSelector {allTags} bind:selectedIds={filters.tags} />
	</div>
</div>
