import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const [restaurantsResult, tagsResult] = await Promise.all([
		locals.supabase
			.from('restaurants')
			.select(
				`
				id, name, address, lat, lng, price_level, created_at,
				restaurant_tags ( tag_id, food_tags ( id, name ) )
			`
			)
			.order('created_at', { ascending: false }),
		locals.supabase.from('food_tags').select('id, name').order('name')
	]);

	const restaurants = (restaurantsResult.data ?? []).map((r: any) => ({
		...r,
		tags: r.restaurant_tags?.map((rt: any) => rt.food_tags).filter(Boolean) ?? []
	}));

	return {
		restaurants,
		tags: tagsResult.data ?? []
	};
};
