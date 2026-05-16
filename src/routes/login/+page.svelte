<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	let { form }: { form: any } = $props();

	let activeTab = $state<'login' | 'register'>('login');

	let confirmationFailed = $derived($page.url.searchParams.get('error') === 'confirmation_failed');
</script>

<svelte:head>
	<title>FoodMap — Connexion</title>
</svelte:head>

<div class="h-full bg-gray-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-emerald-600">FoodMap</h1>
			<p class="text-gray-500 mt-1 text-sm">Découvrez et partagez les meilleurs restaurants</p>
		</div>

		<div class="bg-white rounded-2xl shadow-md p-8">
			<!-- Tab toggle -->
			<div class="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
				<button
					class="flex-1 py-2.5 text-sm font-medium transition-colors
						{activeTab === 'login'
						? 'bg-emerald-600 text-white'
						: 'bg-white text-gray-600 hover:bg-gray-50'}"
					onclick={() => (activeTab = 'login')}
				>
					Connexion
				</button>
				<button
					class="flex-1 py-2.5 text-sm font-medium transition-colors
						{activeTab === 'register'
						? 'bg-emerald-600 text-white'
						: 'bg-white text-gray-600 hover:bg-gray-50'}"
					onclick={() => (activeTab = 'register')}
				>
					Inscription
				</button>
			</div>

			{#if confirmationFailed}
				<div class="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
					Lien de confirmation invalide ou expiré. Réessayez de vous inscrire.
				</div>
			{/if}

			{#if form?.error && form?.action === activeTab}
				<div class="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
					{form.error}
				</div>
			{/if}

			{#if form?.success && form?.action === 'register'}
				<div class="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm text-emerald-700">
					<strong>Compte créé !</strong> Un email de confirmation a été envoyé à votre adresse. Cliquez sur le lien pour activer votre compte.
				</div>
			{/if}

			{#if activeTab === 'login'}
				<form method="POST" action="?/login" use:enhance class="space-y-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1" for="login-email">
							Email
						</label>
						<input
							id="login-email"
							name="email"
							type="email"
							required
							autocomplete="email"
							placeholder="prenom.nom@xoxo.com"
							pattern=".+@aubay\.com"
							title="Adresse email invalide"
							class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1" for="login-password">
							Mot de passe
						</label>
						<input
							id="login-password"
							name="password"
							type="password"
							required
							autocomplete="current-password"
							class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
						/>
					</div>
					<button
						type="submit"
						class="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all"
					>
						Se connecter
					</button>
				</form>
			{:else}
				<form method="POST" action="?/register" use:enhance class="space-y-4">
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1"
							for="register-username"
						>
							Nom d'utilisateur
						</label>
						<input
							id="register-username"
							name="username"
							type="text"
							required
							minlength="2"
							autocomplete="username"
							class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1" for="register-email">
							Email
						</label>
						<input
							id="register-email"
							name="email"
							type="email"
							required
							autocomplete="email"
							placeholder="prenom.nom@xoxo.com"
							pattern=".+@aubay\.com"
							title="Adresse email invalide"
							class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
						/>
					</div>
					<div>
						<label
							class="block text-sm font-medium text-gray-700 mb-1"
							for="register-password"
						>
							Mot de passe
						</label>
						<input
							id="register-password"
							name="password"
							type="password"
							required
							minlength="6"
							autocomplete="new-password"
							class="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
						/>
						<p class="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>
					</div>
					<button
						type="submit"
						class="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all"
					>
						Créer un compte
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>
