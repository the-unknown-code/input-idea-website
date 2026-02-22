export const toKebabCase = (str: string) => {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/\s+/g, '-')
		.toLowerCase();
};

export const generateHead = (
	title: string,
	description: string,
	image: string,
	keywords: string = '',
	robotFollow: boolean = true
) => {
	const metaTags: any = [
		{
			hid: 'description',
			name: 'description',
			content: description,
		},
		{
			hid: 'og:description',
			property: 'og:description',
			content: description,
		},
		{
			hid: 'og:image',
			property: 'og:image',
			content: image,
		},
		{
			hid: 'og:title',
			property: 'og:title',
			content: title,
		},
		{
			hid: 'og:type',
			property: 'og:type',
			content: 'website',
		},
		{
			hid: 'twitter:description',
			name: 'twitter:description',
			content: description,
		},
		{
			hid: 'twitter:title',
			name: 'twitter:title',
			content: title,
		},
		{
			hid: 'twitter:image',
			name: 'twitter:image',
			content: title,
		},
		{
			hid: 'twitter:card',
			name: 'twitter:card',
			content: 'summary_large_image',
		},
	];

	if (!robotFollow) {
		metaTags.push({
			hid: 'robots',
			name: 'robots',
			content: 'noindex, nofollow',
		});
	}

	if (keywords) {
		metaTags.push({
			hid: 'keywords',
			name: 'keywords',
			content: keywords,
		});
	}

	return {
		title,
		meta: metaTags,
	};
};
