import config, { app } from './app.config';
import { toSass } from './shared/sass-utils';
import { toKebabCase } from './app/libs/common/utils';

const modules = [
	'@nuxt/eslint',
	'@pinia/nuxt',
	'@vueuse/nuxt',
	'@nuxt/fonts',
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

	app: {},

	css: ['@/assets/main.scss'],

	image: {
		storyblok: {
			baseURL: 'https://a.storyblok.com',
		},
		domains: ['a.storyblok.com'],
	},

	fonts: {
		...app.fonts,
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
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@1..1000&family=Zalando+Sans:wght@300..700&display=swap',
					},
				],
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
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Sofia+Sans+Extra+Condensed:wght@1..1000&family=Zalando+Sans:wght@300..700&display=swap',
					},
				],
			},
		},
		sitemap: {
			xsl: false,
			sources: ['/api/__sitemap__/urls'],
		},
	},

	runtimeConfig: {
		public: {
			breakpoints: config.breakpoints,
			app: app as any,
			storyblokPreviewKey: process.env.STORYBLOK_PREVIEW_KEY,
			storyblokApiKey: process.env.STORYBLOK_KEY,
			showDebug: process.env.SHOW_DEBUG === 'true',
			SITE_PASSWORD: process.env.SITE_PASSWORD,

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

	nitro: {
		prerender: {

		},
		compressPublicAssets: {
			brotli: true,
			gzip: true,
		},

	},


});
