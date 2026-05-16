import type { Handle } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabaseServer';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event.cookies);

	const {
		data: { session }
	} = await event.locals.supabase.auth.getSession();

	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	const { pathname } = event.url;
	const isAuthenticated = !!session;
	const isPublic = pathname === '/login' || pathname.startsWith('/auth/confirm');

	if (!isAuthenticated && !isPublic) {
		return new Response(null, {
			status: 303,
			headers: { location: '/login' }
		});
	}

	if (isAuthenticated && pathname === '/login') {
		return new Response(null, {
			status: 303,
			headers: { location: '/' }
		});
	}

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};
