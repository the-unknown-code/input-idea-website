import config, { app } from './app.config';
import { toSass } from './shared/sass-utils';
import { toKebabCase } from './app/libs/common/utils';

const modules = [
	'@nuxt/eslint',
	'@pinia/nuxt',
	'@vueuse/nuxt',
	'@nuxtjs/robots',
	'@nuxtjs/sitemap',
	'@nuxt/image',
];

if (app.storyblok.enabled) {
	// @ts-expect-error - Storyblok module is not typed
	modules.push([
		'@storyblok/nuxt',
		{
			accessToken: process.env.STORYBLOK_KEY,
			apiOptions: app.storyblok.apiOptions,
		},
	]);
}

const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Pathway+Extreme:ital,opsz,wdth,wght@0,8..144,75..100,100..900;1,8..144,75..100,100..900&family=Zalando+Sans:wght@300..700&display=swap';

// STATIC_EXPORT=true (set by scripts/export-static.mjs): plain static site for FTP hosting
const STATIC_EXPORT = process.env.STATIC_EXPORT === 'true';

// Fetch every published Storyblok story so dynamic routes (progetti/*, servizi/*) get prerendered
const getStoryblokRoutes = async (): Promise<string[]> => {
	const token = process.env.STORYBLOK_KEY;
	if (!token) return [];
	const routes: string[] = [];
	for (let page = 1; ; page++) {
		const res = await fetch(
			`https://api.storyblok.com/v2/cdn/stories?token=${token}&version=published&per_page=100&page=${page}&excluding_fields=body`
		);
		if (!res.ok) throw new Error(`Storyblok fetch failed: ${res.status}`);
		const { stories } = (await res.json()) as { stories: { full_slug: string; is_folder?: boolean }[] };
		stories
			.filter(s => /^(progetti|servizi)\/[^/]+$/.test(s.full_slug))
			.forEach(s => routes.push(`/${s.full_slug}`));
		if (stories.length < 100) break;
	}
	return routes;
};

export const scssFunctions = {
	'get($keys)': (keys: any) => {
		keys = keys.toString().replace(/['"]+/g, '').split('.');
		let result: any = config;
		for (let i = 0; i < keys.length; i++) {
			result = result[keys[i]];
		}
		return toSass(result);
	},
	'getColors()': () => toSass(config.colors),
	'getThemes()': () => toSass(config.themes),
};


export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',

	modules,

	site: {
		url: process.env.SITE_URL || 'https://www.inputidea.it',
	},

	// static export writes its own sitemap.xml (scripts/export-static.mjs)
	sitemap: {
		enabled: !STATIC_EXPORT,
	},

	css: ['@/assets/main.scss'],

	image: {
		storyblok: {
			baseURL: 'https://a.storyblok.com',
		},
		domains: ['a.storyblok.com'],
	},

	$development: {
		devtools: { enabled: true },
		app: {
			rootId: `${toKebabCase(app.title)}-development`,
			head: {
				meta: [
					{
						name: 'theme-color',
						content: '#2F2C2C',
					},
				],
				link: [
					{
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
					{
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: '',
					},
					{
						// non render-blocking: swapped to media="all" once loaded
						rel: 'stylesheet',
						href: FONTS_URL,
						media: 'print',
						onload: "this.media='all'",
					},
				],
				noscript: [{ innerHTML: `<link rel="stylesheet" href="${FONTS_URL}">` }],
			},
		},
		sitemap: {
			xsl: false,
			sources: ['/api/__sitemap__/urls'],
		},
	},

	$production: {
		app: {
			rootId: `${toKebabCase(app.title)}`,
			head: {
				meta: [
					{
						name: 'theme-color',
						content: '#2F2C2C',
					},
				],
				link: [
					{
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
					{
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: '',
					},
					{
						// non render-blocking: swapped to media="all" once loaded
						rel: 'stylesheet',
						href: FONTS_URL,
						media: 'print',
						onload: "this.media='all'",
					},
				],
				noscript: [{ innerHTML: `<link rel="stylesheet" href="${FONTS_URL}">` }],
			},
		},
		sitemap: {
			xsl: false,
			sources: ['/api/__sitemap__/urls'],
		},
	},

	runtimeConfig: {
		// server-only secrets (never shipped to the client)
		storyblokApiKey: process.env.STORYBLOK_KEY,
		storyblokPreviewKey: process.env.STORYBLOK_PREVIEW_KEY,
		sitePassword: process.env.SITE_PASSWORD,
		public: {
			breakpoints: config.breakpoints,
			app: app as any,
			googleMapsId: process.env.GOOGLE_MAPS_ID,
			googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
			showDebug: process.env.SHOW_DEBUG === 'true',

			// gtm
			gtm: {
				id: process.env.NUXT_PUBLIC_GTM_ID,
				enabled: true,
				debug: process.env.SHOW_DEBUG === 'true',
				defer: true,
			},
			// build git info (buildNumber/buildDate set by scripts/build.js on Vercel)
			build: {
				env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
				branch: process.env.VERCEL_GIT_COMMIT_REF,
				commit: process.env.VERCEL_GIT_COMMIT_SHA,
				version:
					process.env.APP_VERSION ??
					process.env.npm_package_version ??
					'Unknown',
				buildNumber: process.env.NUXT_PUBLIC_BUILD_NUMBER,
				buildDate: process.env.NUXT_PUBLIC_BUILD_DATE,
			},
		},
	},

	vite: {
		build: {
			cssMinify: true,
			terserOptions: {
				format: {
					comments: false,
				},
			},
		},
		esbuild: {
			legalComments: 'none',
			// static export: strip console.* calls and debugger statements from the bundle
			drop: STATIC_EXPORT ? ['console', 'debugger'] : [],
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData:
						'@use "@/assets/utils/functions.scss" as *; @use "/assets/utils/typography.scss" as *;',
					functions: scssFunctions,
				},
			},
		},
	},

	eslint: {
		checker: true,
	},

	hooks: {
		async 'nitro:config'(nitroConfig) {
			if (!STATIC_EXPORT) return;
			const routes = await getStoryblokRoutes();
			nitroConfig.prerender ??= {};
			nitroConfig.prerender.routes = [
				...(nitroConfig.prerender.routes ?? []),
				'/',
				...routes,
			];
			console.info(`[static-export] prerendering ${routes.length} Storyblok routes + crawled links`);
		},
	},

	nitro: {
		// crawling/prerendering only for the static export; Vercel builds stay SSR
		prerender: STATIC_EXPORT
			? {
				crawlLinks: true,
				// keep going on broken links; scripts/export-static.mjs prints the missing list
				failOnError: false,
			}
			: {},
		// .br/.gz siblings are useless on plain FTP hosting
		compressPublicAssets: STATIC_EXPORT
			? false
			: {
				brotli: true,
				gzip: true,
			},

	},


});
