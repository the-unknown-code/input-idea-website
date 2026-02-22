import { defineNuxtPlugin, useRuntimeConfig, useRoute } from '#app';

export default defineNuxtPlugin(() => {
	const dev = import.meta.dev;
	const route = useRoute();
	const config = useRuntimeConfig();

	const preview =
		dev || config.public.app.storyblok.forceDraft
			? true
			: route.query?._storyblok || false;

	return { provide: { preview } };
});
