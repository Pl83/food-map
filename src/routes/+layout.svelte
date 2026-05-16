<script lang="ts">
	import '../app.css';
	import { supabase } from '$lib/supabase';
	import { goto } from '$app/navigation';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: any; children: Snippet } = $props();

	async function logout() {
		await supabase.auth.signOut();
		goto('/login');
	}
</script>

<div class="h-screen flex flex-col">
	{#if data.session}
		<nav class="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
			<a href="/" class="font-bold text-emerald-600 text-lg">FoodMap</a>
			<div class="flex items-center gap-3">
				<a
					href="/add"
					class="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg transition-colors"
				>
					<span class="hidden sm:inline">+ Ajouter un restaurant</span>
					<span class="sm:hidden text-base font-bold">+</span>
				</a>
				<span class="hidden md:block text-sm text-gray-400 truncate max-w-[180px]"
					>{data.user?.email}</span
				>
				<button
					onclick={logout}
					class="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors whitespace-nowrap"
				>
					Déconnexion
				</button>
			</div>
		</nav>
	{/if}
	<main class="flex-1 overflow-auto">
		{@render children()}
	</main>
</div>
