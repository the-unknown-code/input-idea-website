import type { StorybookConfig } from '@nuxtjs/storybook';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SCSS functions will be created in viteFinal
let scssFunctions: any = null;

const storybookConfig: StorybookConfig = {
	stories: ['../app/components/**/*.stories.@(js|ts|tsx|jsx|mdx)'],
	addons: [
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-onboarding',
	],
	framework: {
		name: '@storybook-vue/nuxt',
		options: {},
	},
	async viteFinal(viteConfig) {
		// Dynamically import config and toSass using file:// URLs for ESM
		try {
			const configPath = pathToFileURL(
				path.resolve(__dirname, '../app.config.ts')
			).href;
			const sassUtilsPath = pathToFileURL(
				path.resolve(__dirname, '../shared/sass-utils/index.ts')
			).href;

			const configModule = await import(configPath);
			const sassUtilsModule = await import(sassUtilsPath);

			const config = configModule.default || configModule;
			const { toSass } = sassUtilsModule;

			// Create SCSS functions
			scssFunctions = {
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
		} catch (error) {
			console.warn('Could not load SCSS functions, continuing without them:', error);
			// Continue without custom functions - basic SCSS will still work
			scssFunctions = {};
		}

		// Merge with Nuxt's Vite config to get SCSS preprocessing
		return mergeConfig(viteConfig, {
			resolve: {
				alias: {
					'@': path.resolve(__dirname, '../app'),
				},
			},
			css: {
				preprocessorOptions: {
					scss: {
						additionalData:
							'@use "@/assets/utils/functions.scss" as *; @use "@/assets/utils/typography.scss" as *;',
						functions: scssFunctions,
					},
				},
			},
		});
	},
};

export default storybookConfig;
