export {};

declare module 'nuxt/schema' {
	interface PublicRuntimeConfig {
		build: {
			env?: string;
			branch?: string;
			commit?: string;
			version?: string;
			buildNumber?: string;
			buildDate?: string;
		};
	}
}
