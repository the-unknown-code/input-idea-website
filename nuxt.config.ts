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
	// Storybook module disabled - we serve static build at /storybook instead
	// '@nuxtjs/storybook',
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

const shouldEnableGtm =
	process.env.NODE_ENV === 'production' || process.env.SHOW_DEBUG === 'true';

export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',

	modules,

	app: shouldEnableGtm
		? {
			head: {

				// @ts-expect-error - Marker is not typed
				__dangerouslyDisableSanitizers: ['script', 'noscript'],

				script: [
					{
						key: 'gtm',
						type: 'text/javascript',
						innerHTML: `
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
							j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
							f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','${process.env.NUXT_PUBLIC_GTM_ID}');
						`,
					},
				],

				noscript: [
					{
						key: 'gtm-noscript',
						innerHTML: `
							<iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NUXT_PUBLIC_GTM_ID}"
							height="0" width="0" style="display:none;visibility:hidden"></iframe>
						`,
					},
				],
			},
		}
		: {},

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
			head: {},
		},
		sitemap: {
			xsl: false,
			sources: ['/api/__sitemap__/urls'],
		},
	},

	$production: {
		app: {
			rootId: `${toKebabCase(app.title)}`,
			head: {},
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
		compressPublicAssets: {
			brotli: true,
			gzip: true,
		},
		// Note: We're using a server route instead of publicAssets
		// because publicAssets doesn't handle SPA routing (index.html fallback)
		// The server route at server/routes/storybook/[...].ts handles this
	},

	storybook: {
		// Disable proxy by not setting a route
		// The module will still work for Storybook config/types, but won't set up proxy
		// We serve Storybook statically via server/routes/storybook/[...].ts
	},
});
