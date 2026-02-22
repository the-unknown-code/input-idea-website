export default defineNuxtRouteMiddleware(() => {
	// Only run on client side
	if (import.meta.server) return;

	const config = useRuntimeConfig();
	// Only enforce auth if SITE_PASSWORD is set
	const sitePassword = config.public.SITE_PASSWORD;
	if (!sitePassword) return;

	if (localStorage.getItem('site-authenticated') === 'true') return;

	const password = prompt('Password:') ?? '';
	if (password === sitePassword) {
		localStorage.setItem('site-authenticated', 'true');
		return;
	}

	return abortNavigation();
});


