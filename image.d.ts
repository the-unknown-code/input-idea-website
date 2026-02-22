import '@nuxt/image/dist/runtime/types';

declare module '@nuxt/schema' {
	interface NuxtConfig {
		image?: import('@nuxt/image').ModuleOptions;
	}
	interface NuxtOptions {
		image?: import('@nuxt/image').ModuleOptions;
	}
}

export {};
