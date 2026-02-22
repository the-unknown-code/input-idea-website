import { generateHead } from '~/libs/common/utils';
import useAppStore from '~/store/useAppStore';
import _get from 'lodash/get';

export const useSeo = (story: any = {}) => {
	const { settings } = useAppStore();
	const storyValue = unref(story);
	const pageSEO = _get(storyValue, 'content.seo[0]');
	const settingsSEO = settings.value?.seo?.[0] || {};

	if (!pageSEO || !pageSEO.title) {
		console.warn(`seo data not found for page ${storyValue.name || 'unknown'}`);
	}

	const seoTitle = pageSEO?.title || settingsSEO.title || '';
	const seoDescription = pageSEO?.description || settingsSEO.description || '';
	const seoImage =
		pageSEO?.og_image?.filename || settingsSEO.og_image?.filename || '';
	const seoKeywords = pageSEO?.keywords || settingsSEO.keywords || '';
	const robotsFollow = pageSEO?.robots_follow !== false; // Defaults to true if not specified

	useHead(
		generateHead(seoTitle, seoDescription, seoImage, seoKeywords, robotsFollow)
	);
};
