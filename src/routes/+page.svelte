<script lang="ts">
	import { onMount } from 'svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import RestaurantPanel from '$lib/components/RestaurantPanel.svelte';
	import type { Restaurant, FoodTag, FilterState } from '$lib/types';

	let { data }: { data: { restaurants: Restaurant[]; tags: FoodTag[] } } = $props();

	let selectedRestaurant = $state<Restaurant | null>(null);
	let userLocation = $state<[number, number] | null>(null);
	let showFilters = $state(false);

	let filters = $state<FilterState>({
		search: '',
		tags: [],
		minPrice: 1,
		maxPrice: 4
	});

	let filtered = $derived(
		data.restaurants.filter((r) => {
			const matchesSearch =
				!filters.search || r.name.toLowerCase().includes(filters.search.toLowerCase());
			const matchesTags =
				filters.tags.length === 0 ||
				filters.tags.every((tid) => r.tags?.some((t) => t.id === tid));
			const matchesPrice =
				r.price_level >= filters.minPrice && r.price_level <= filters.maxPrice;
			return matchesSearch && matchesTags && matchesPrice;
		})
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let MapComponent = $state<any>(null);

	onMount(async () => {
		const mod = await import('$lib/components/Map.svelte');
		MapComponent = mod.default;
	});
</script>

<div class="h-full flex overflow-hidden relative">
	<!-- Mobile filter toggle -->
	<button
		class="md:hidden absolute top-3 left-3 z-[1000] bg-white rounded-lg shadow-md px-3 py-2 text-sm font-medium flex items-center gap-2 border border-gray-200"
		onclick={() => (showFilters = !showFilters)}
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 4h18M7 8h10M11 12h2"
			/>
		</svg>
		Filtres {#if filters.tags.length || filters.search}<span
				class="ml-1 w-4 h-4 text-xs bg-emerald-600 text-white rounded-full flex items-center justify-center"
				>{filters.tags.length + (filters.search ? 1 : 0)}</span
			>{/if}
	</button>

	<!-- Mobile filter backdrop -->
	{#if showFilters}
		<div
			class="md:hidden fixed inset-0 bg-black/30 z-[998]"
			onclick={() => (showFilters = false)}
			role="button"
			tabindex="-1"
			onkeydown={(e) => e.key === 'Escape' && (showFilters = false)}
		></div>
	{/if}

	<!-- Filter sidebar -->
	<aside
		class="
			absolute md:static top-0 left-0 h-full z-[999]
			w-72 bg-white border-r p-4 overflow-y-auto flex-shrink-0
			transform transition-transform duration-200 ease-in-out
			{showFilters ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
		"
	>
		<div class="flex items-center justify-between mb-4 md:hidden">
			<h2 class="font-semibold text-gray-800">Filtres</h2>
			<button
				onclick={() => (showFilters = false)}
				class="text-gray-400 hover:text-gray-600 text-xl leading-none"
			>
				✕
			</button>
		</div>
		<FilterBar bind:filters allTags={data.tags} />
	</aside>

	<!-- Map area -->
	<div class="flex-1 relative">
		{#if MapComponent}
			{@const MC = MapComponent}
			<MC
				restaurants={filtered}
				{userLocation}
				onSelectRestaurant={(r: Restaurant) => {
					selectedRestaurant = r;
					showFilters = false;
				}}
				onUserLocationChange={(loc: [number, number]) => (userLocation = loc)}
			/>
		{:else}
			<div class="flex items-center justify-center h-full bg-gray-100">
				<div class="text-center text-gray-400">
					<div class="text-5xl mb-3">🗺️</div>
					<p class="text-sm">Chargement de la carte...</p>
				</div>
			</div>
		{/if}
	</div>

	<!-- Restaurant detail panel -->
	{#if selectedRestaurant}
		<aside
			class="
				fixed md:static bottom-0 left-0 right-0 md:right-auto
				h-[65vh] md:h-full md:w-96
				border-t md:border-t-0 md:border-l
				bg-white overflow-y-auto flex-shrink-0
				z-[997] shadow-2xl md:shadow-none
				rounded-t-2xl md:rounded-none
			"
		>
			<RestaurantPanel
				restaurant={selectedRestaurant}
				{userLocation}
				onClose={() => (selectedRestaurant = null)}
			/>
		</aside>
	{/if}
</div>
