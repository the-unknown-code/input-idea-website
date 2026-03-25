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


type link = {
	linktype: string;
	url: string;
	email?: string;
	story?: {
		url?: string;
	};
	cached_url?: string;
	anchor?: string;
}

export const resolveLink = (link: string | link | null | undefined): string | undefined => {
	if (link == null) return undefined;
	if (typeof link === 'string') return link;

	const l = link as link;
	let finalLink: string | undefined;

	if (l.linktype === 'url' || l.linktype === 'asset') {
		finalLink = l.url;
	} else if (l.linktype === 'email') {
		finalLink = l.email ? `mailto:${l.email}` : undefined;
	} else if (l.linktype === 'story') {
		const storyURL = l.story?.url?.length ? l.story.url : l.cached_url || '';
		finalLink = `${storyURL.charAt(0) === '/' ? '' : '/'}${storyURL}`;
	}

	if (finalLink != null && l.anchor) {
		finalLink += `#${l.anchor}`;
	}

	return finalLink;
};
