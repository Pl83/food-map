import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const ALLOWED_DOMAIN = '@aubay.com';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.toLowerCase().trim();
		const password = data.get('password') as string;

		if (!email.endsWith(ALLOWED_DOMAIN)) {
			return fail(400, {
				error: 'Seules les adresses @aubay.com sont autorisées.',
				action: 'login'
			});
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			if (error.message.toLowerCase().includes('email not confirmed')) {
				return fail(400, {
					error: 'Veuillez confirmer votre adresse email avant de vous connecter.',
					action: 'login'
				});
			}
			return fail(400, { error: error.message, action: 'login' });
		}

		redirect(303, '/');
	},

	register: async ({ request, locals }) => {
		const data = await request.formData();
		const email = (data.get('email') as string)?.toLowerCase().trim();
		const password = data.get('password') as string;
		const username = (data.get('username') as string)?.trim();

		if (!username || username.length < 2) {
			return fail(400, {
				error: "Le nom d'utilisateur doit contenir au moins 2 caractères.",
				action: 'register'
			});
		}

		if (!email.endsWith(ALLOWED_DOMAIN)) {
			return fail(400, {
				error: 'Seules les adresses @aubay.com sont autorisées.',
				action: 'register'
			});
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: { data: { username } }
		});

		if (error) return fail(400, { error: error.message, action: 'register' });

		return { success: true, action: 'register' };
	}
};
