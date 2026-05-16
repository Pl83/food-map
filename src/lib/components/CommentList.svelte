<script lang="ts">
	import type { Comment } from '$lib/types';

	let { comments }: { comments: Comment[] } = $props();

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}
</script>

<div class="mt-2">
	<h3 class="text-sm font-semibold text-gray-600 mb-3">
		{comments.length} commentaire{comments.length !== 1 ? 's' : ''}
	</h3>

	{#if comments.length === 0}
		<div class="text-center py-8 text-gray-400">
			<div class="text-3xl mb-2">💬</div>
			<p class="text-sm">Aucun commentaire pour l'instant.</p>
			<p class="text-xs mt-1">Soyez le premier à donner votre avis !</p>
		</div>
	{:else}
		<div class="space-y-3">
			{#each comments as c (c.id)}
				<div class="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
					<span class="text-xl flex-shrink-0 mt-0.5" aria-label={c.sentiment === 'like' ? 'J\'aime' : 'Je n\'aime pas'}>
						{c.sentiment === 'like' ? '👍' : '👎'}
					</span>
					<div class="min-w-0 flex-1">
						<div class="flex items-baseline justify-between gap-2 mb-1">
							<span class="text-sm font-medium text-gray-800 truncate">
								{c.profiles?.username ?? 'Anonyme'}
							</span>
							<span class="text-xs text-gray-400 flex-shrink-0">
								{formatDate(c.created_at)}
							</span>
						</div>
						<p class="text-sm text-gray-700 leading-relaxed">{c.text}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
