// /plugins/storyblok.client.ts

import { useAsyncStory } from '~/libs/storyblok';
import useAppStore from '~/store/useAppStore';

export default defineNuxtPlugin({
	parallel: false, // ⬅️ Forces plugin to run BEFORE app creation
	async setup() {
		const {
			public: { app },
		} = useRuntimeConfig();

		if (app.storyblok.enabled) {
			const nuxtApp = useNuxtApp();
			const config = useRuntimeConfig();

			// Handle Preview Mode - the preview token is private config; it is only
			// forwarded to the client (via payload) when preview is active.
			const previewToken = useState<string | null>('sb-preview-token', () =>
				import.meta.server && nuxtApp.$preview
					? ((config.storyblokPreviewKey as string) || null)
					: null
			);
			if (nuxtApp.$preview && previewToken.value) {
				const storyblokApi = useStoryblokApi();
				// @ts-expect-error - Storyblok API not typed
				storyblokApi.accessToken = previewToken.value;
			}

			// Load settings if enabled
			if (app.storyblok.settings && typeof app.storyblok.settings === 'string') {
				try {
					const { story: settings } = await useAsyncStory(app.storyblok.settings);
					useAppStore().saveSettings(settings);
				} catch (error) {
					console.error('Failed to load Storyblok settings:', error);
				}
			}
		}
	},
});
