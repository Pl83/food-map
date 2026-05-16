<script lang="ts">
	import type { FoodTag } from '$lib/types';

	interface Props {
		allTags: FoodTag[];
		selectedIds: number[];
	}

	let { allTags, selectedIds = $bindable([]) }: Props = $props();

	function toggle(id: number) {
		selectedIds = selectedIds.includes(id)
			? selectedIds.filter((t) => t !== id)
			: [...selectedIds, id];
	}
</script>

<div class="flex flex-wrap gap-1.5">
	{#each allTags as tag (tag.id)}
		<button
			type="button"
			onclick={() => toggle(tag.id)}
			class="px-2.5 py-1 text-xs font-medium rounded-full border transition-colors
				{selectedIds.includes(tag.id)
				? 'bg-emerald-600 text-white border-emerald-600'
				: 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}"
		>
			{tag.name}
		</button>
	{/each}
</div>
