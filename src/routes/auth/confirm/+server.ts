import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as 'email' | 'recovery' | 'invite' | null;
	const next = url.searchParams.get('next') ?? '/';

	if (token_hash && type) {
		const { error } = await locals.supabase.auth.verifyOtp({ token_hash, type });
		if (!error) {
			redirect(303, next);
		}
	}

	redirect(303, '/login?error=confirmation_failed');
};
