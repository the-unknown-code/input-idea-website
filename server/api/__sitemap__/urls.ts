import type { SitemapUrlInput } from '#sitemap/types';

type StoryblokStory = {
	full_slug: string;
	published_at?: string;
	created_at?: string;
	is_startpage?: boolean;
};

type StoryblokResponse = {
	stories: StoryblokStory[];
};

// plain handler (defineSitemapEventHandler is only a typing helper and is
// unavailable when the sitemap module is disabled for the static export)
export default defineEventHandler(
	async (): Promise<SitemapUrlInput[]> => {
		const config = useRuntimeConfig();

		const isPreview = import.meta.dev || config.public.app.storyblok.forceDraft;

		const token = isPreview
			? config.storyblokPreviewKey
			: config.storyblokApiKey;

		const version = isPreview ? 'draft' : 'published';

		const urls: SitemapUrlInput[] = [];

		const response = await $fetch<{ data: StoryblokResponse }>(
			'https://api.storyblok.com/v2/cdn/stories',
			{
				params: {
					token,
					version,
					excluding_fields: 'body',
					per_page: 100,
				},
			}
		);

		response.data.stories.forEach((story: any) => {
			// Skip pages where robots_follow is explicitly false
			const robotsFollow = story.content?.seo?.[0]?.robots_follow !== false;
			if (!robotsFollow) {
				return;
			}

			if (story.is_startpage) {
				urls.push({
					loc: '/',
					lastmod: story.published_at ?? story.created_at,
				});
				return;
			}

			urls.push({
				loc: `/${story.full_slug}`,
				lastmod: story.published_at ?? story.created_at,
			});
		});

		return urls;
	}
);
