<script lang="ts">
	import { supabase } from '$lib/supabase';
	import type { Comment } from '$lib/types';

	interface Props {
		restaurantId: string;
		onAdded?: (comment: Comment) => void;
	}

	let { restaurantId, onAdded }: Props = $props();

	let text = $state('');
	let sentiment = $state<'like' | 'dislike'>('like');
	let submitting = $state(false);
	let error = $state('');

	async function submit() {
		if (!text.trim()) return;
		submitting = true;
		error = '';

		const {
			data: { session }
		} = await supabase.auth.getSession();

		if (!session) {
			error = 'Vous devez être connecté pour commenter.';
			submitting = false;
			return;
		}

		const { data, error: err } = await supabase
			.from('comments')
			.insert({
				restaurant_id: restaurantId,
				user_id: session.user.id,
				text: text.trim(),
				sentiment
			})
			.select('*, profiles(username)')
			.single();

		if (err) {
			error = err.message;
		} else {
			onAdded?.(data as Comment);
			text = '';
		}
		submitting = false;
	}
</script>

<div class="mb-5 p-4 bg-white border border-gray-200 rounded-xl">
	<h4 class="text-sm font-semibold text-gray-700 mb-3">Laisser un avis</h4>

	<textarea
		bind:value={text}
		rows="3"
		placeholder="Partagez votre expérience..."
		class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
			focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
			transition-shadow mb-3"
	></textarea>

	<div class="flex items-center gap-3 flex-wrap">
		<div class="flex gap-2">
			<label
				class="flex items-center gap-1.5 cursor-pointer text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors
					{sentiment === 'like'
					? 'bg-green-50 border-green-300 text-green-700'
					: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}"
			>
				<input type="radio" bind:group={sentiment} value="like" class="sr-only" />
				👍 J'aime
			</label>
			<label
				class="flex items-center gap-1.5 cursor-pointer text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors
					{sentiment === 'dislike'
					? 'bg-red-50 border-red-300 text-red-700'
					: 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}"
			>
				<input type="radio" bind:group={sentiment} value="dislike" class="sr-only" />
				👎 Je n'aime pas
			</label>
		</div>
		<button
			onclick={submit}
			disabled={submitting || !text.trim()}
			class="ml-auto px-4 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-lg
				hover:bg-emerald-700 active:scale-95 transition-all
				disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{submitting ? '...' : 'Publier'}
		</button>
	</div>

	{#if error}
		<p class="text-red-500 text-xs mt-2">{error}</p>
	{/if}
</div>
