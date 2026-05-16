import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: tags } = await locals.supabase
		.from('food_tags')
		.select('id, name')
		.order('name');

	return { tags: tags ?? [] };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) return fail(401, { error: 'Non authentifié' });

		const form = await request.formData();
		const name = (form.get('name') as string)?.trim();
		const address = (form.get('address') as string)?.trim();
		const priceLevel = parseInt(form.get('price_level') as string);
		const tagIds = form.getAll('tags').map(Number).filter((n) => !isNaN(n) && n > 0);

		if (!name || !address) {
			return fail(400, { error: 'Le nom et l\'adresse sont requis.', name, address });
		}
		if (![1, 2, 3, 4].includes(priceLevel)) {
			return fail(400, { error: 'Veuillez sélectionner un niveau de prix.', name, address });
		}

		// Geocode via Nominatim
		let lat: number, lng: number;
		try {
			const geoRes = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
				{ headers: { 'User-Agent': 'FoodMap/1.0 (contact@foodmap.app)' } }
			);
			const geoData = await geoRes.json();
			if (!geoData.length) {
				return fail(400, { error: 'Adresse introuvable. Essayez une adresse plus précise.', name, address });
			}
			lat = parseFloat(geoData[0].lat);
			lng = parseFloat(geoData[0].lon);
		} catch {
			return fail(500, { error: 'Erreur lors de la géolocalisation. Réessayez.', name, address });
		}

		// Insert restaurant
		const { data: restaurant, error: rErr } = await locals.supabase
			.from('restaurants')
			.insert({ user_id: user.id, name, address, lat, lng, price_level: priceLevel })
			.select('id')
			.single();

		if (rErr) return fail(500, { error: rErr.message, name, address });

		// Insert junction rows for tags
		if (tagIds.length > 0) {
			await locals.supabase
				.from('restaurant_tags')
				.insert(tagIds.map((tag_id) => ({ restaurant_id: restaurant.id, tag_id })));
		}

		redirect(303, '/');
	}
};
