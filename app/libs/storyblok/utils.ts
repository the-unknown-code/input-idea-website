import useAppStore from '~/store/useAppStore';
import _get from 'lodash/get';
import { generateHead } from '../common/utils';

export const useUnwrapBlok = (blokIn: any) => {
	return Array.isArray(blokIn) ? blokIn[0] : blokIn;
};

export const useStoryblokHead = (story: any = {}) => {
	const { settings } = useAppStore();
	const pageSEO = _get(unref(story), 'content.seo[0]');
	const settingsSEO = settings.value?.seo?.[0] || {};

	const seoTitle = pageSEO.title || settingsSEO.title || '';
	const seoDescription = pageSEO.description || settingsSEO.description || '';
	const seoImage = pageSEO.image || settingsSEO.image || '';

	useHead(generateHead(seoTitle, seoDescription, seoImage));
};
