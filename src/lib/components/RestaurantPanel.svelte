<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import CommentList from './CommentList.svelte';
	import AddCommentForm from './AddCommentForm.svelte';
	import { PRICE_LABELS } from '$lib/types';
	import type { Restaurant, Comment } from '$lib/types';

	interface Props {
		restaurant: Restaurant;
		userLocation?: [number, number] | null;
		onClose?: () => void;
	}

	let { restaurant, userLocation, onClose }: Props = $props();

	let comments = $state<Comment[]>([]);
	let walkingTime = $state<string | null>(null);
	let loading = $state(true);

	onMount(async () => {
		await Promise.all([loadComments(), fetchWalkingTime()]);
		loading = false;
	});

	async function loadComments() {
		const { data } = await supabase
			.from('comments')
			.select('*, profiles(username)')
			.eq('restaurant_id', restaurant.id)
			.order('created_at', { ascending: false });
		comments = (data ?? []) as Comment[];
	}

	async function fetchWalkingTime() {
		if (!userLocation) return;
		const [uLat, uLng] = userLocation;
		const url = `https://router.project-osrm.org/route/v1/foot/${uLng},${uLat};${restaurant.lng},${restaurant.lat}?overview=false`;
		try {
			const res = await fetch(url);
			const json = await res.json();
			const seconds = json.routes?.[0]?.duration;
			if (seconds != null) {
				const mins = Math.round(seconds / 60);
				walkingTime = mins < 1 ? '< 1 min à pied' : `~${mins} min à pied`;
			}
		} catch {
			// OSRM is a public API — silently skip on failure
		}
	}

	function handleCommentAdded(comment: Comment) {
		comments = [comment, ...comments];
	}
</script>

<div class="flex flex-col h-full">
	<!-- Header -->
	<div class="flex items-start justify-between p-4 border-b bg-white sticky top-0 z-10">
		<div class="pr-4 min-w-0">
			<h2 class="text-lg font-bold text-gray-900 truncate">{restaurant.name}</h2>
			<p class="text-sm text-gray-500 mt-0.5 leading-snug">{restaurant.address}</p>
		</div>
		<button
			onclick={onClose}
			class="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none mt-0.5"
			aria-label="Fermer"
		>
			×
		</button>
	</div>

	<!-- Meta badges -->
	<div class="px-4 py-3 flex flex-wrap items-center gap-2 border-b bg-gray-50">
		<span class="font-bold text-amber-600 text-sm bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
			{PRICE_LABELS[restaurant.price_level as 1 | 2 | 3 | 4]}
		</span>
		{#if walkingTime}
			<span class="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
				<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h-2l-3 9M13 7l3 9M13 7V4m0 3h2m-5 9h6" />
				</svg>
				{walkingTime}
			</span>
		{:else if !userLocation}
			<span class="text-xs text-gray-400 italic">Activez la géolocalisation pour le temps de marche</span>
		{/if}
		{#each restaurant.tags ?? [] as tag (tag.id)}
			<span class="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
				{tag.name}
			</span>
		{/each}
	</div>

	<!-- Comments area -->
	<div class="flex-1 overflow-y-auto px-4 py-4">
		{#if loading}
			<div class="flex items-center justify-center py-8 text-gray-400">
				<div class="text-center">
					<div class="text-3xl mb-2 animate-pulse">💬</div>
					<p class="text-sm">Chargement...</p>
				</div>
			</div>
		{:else}
			<AddCommentForm restaurantId={restaurant.id} onAdded={handleCommentAdded} />
			<CommentList {comments} />
		{/if}
	</div>
</div>
