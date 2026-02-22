import useAppStore from '~/store/useAppStore';

export const useAsyncStory = async (
	url: string,
	apiOptions: any = {},
) => {
	const nuxtApp = useNuxtApp();
	const { $preview } = nuxtApp;
	const version: string = $preview ? 'draft' : 'published';
	const refreshKey: Ref<string> = ref(url);
	const story: Ref<any> = ref({});

	const storyblokApi: any = useStoryblokApi();

	const { data } = await useAsyncData(url, async () => {
		const { data } = await storyblokApi.get(`cdn/stories/${url}`, {
			version,
			resolve_links: 'url',
			resolve_links_level: 2,
			...apiOptions,
		});

		return data?.story;
	});

	if (data.value && data.value.content) {
		story.value = data.value;
	} else {
		throw createError({
			statusCode: 404,
			statusMessage: 'Story not found',
			fatal: true,
		});
	}

	return {
		story,
		refreshKey,
	};
};

export const useAsyncStoryState = async (
	url: string,
	apiOptions: any = {},
	bridgeOptions: any = null
) => {
	const store = useAppStore();

	if (store.getStoryById(url)) {
		const story = store.getStoryById(url);

		return {
			story: story.content,
			refreshKey: story.refreshKey,
		};
	} else {
		const { story, refreshKey } = await useAsyncStory(
			url,
			apiOptions,
			bridgeOptions
		);
		store.saveStory({ id: url, refreshKey, content: story.value });
		return { story, refreshKey };
	}
};

export const useGetAllStories = async (url: string, apiOptions: any = {}) => {
	const storyblokApi = useStoryblokApi();
	const nuxtApp = useNuxtApp();
	const { $preview } = nuxtApp;
	const version: string = $preview ? 'draft' : 'published';

	const PAGE_SIZE: number = 100;

	const data = await useAsyncData(url, async () => {
		const allStories: any[] = [];
		let page = 1;

		const fetchPage = async () => {
			const { data } = await storyblokApi.get('cdn/stories/', {
				version,
				per_page: PAGE_SIZE,
				page,
				...apiOptions,
			});

			allStories.push(...data.stories);

			if (data.stories.length === PAGE_SIZE) {
				page++;
				await fetchPage();
			}
		};

		await fetchPage();

		return allStories;
	});

	return data;
};