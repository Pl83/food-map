export interface Profile {
	id: string;
	username: string;
	created_at: string;
}

export interface FoodTag {
	id: number;
	name: string;
}

export interface Restaurant {
	id: string;
	user_id: string;
	name: string;
	address: string;
	lat: number;
	lng: number;
	price_level: 1 | 2 | 3 | 4;
	created_at: string;
	tags?: FoodTag[];
}

export interface Comment {
	id: string;
	restaurant_id: string;
	user_id: string;
	text: string;
	sentiment: 'like' | 'dislike';
	created_at: string;
	profiles?: { username: string };
}

export type PriceLevel = 1 | 2 | 3 | 4;

export const PRICE_LABELS: Record<PriceLevel, string> = {
	1: '€',
	2: '€€',
	3: '€€€',
	4: '€€€€'
};

export interface FilterState {
	search: string;
	tags: number[];
	minPrice: PriceLevel;
	maxPrice: PriceLevel;
}
