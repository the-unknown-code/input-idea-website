/*
░██████╗████████╗██╗░░░██╗██████╗░██╗░█████╗░  ███████╗██████╗░███████╗██╗░██████╗░██╗░░██╗████████╗
██╔════╝╚══██╔══╝██║░░░██║██╔══██╗██║██╔══██╗  ██╔════╝██╔══██╗██╔════╝██║██╔════╝░██║░░██║╚══██╔══╝
╚█████╗░░░░██║░░░██║░░░██║██║░░██║██║██║░░██║  █████╗░░██████╔╝█████╗░░██║██║░░██╗░███████║░░░██║░░░
░╚═══██╗░░░██║░░░██║░░░██║██║░░██║██║██║░░██║  ██╔══╝░░██╔══██╗██╔══╝░░██║██║░░╚██╗██╔══██║░░░██║░░░
██████╔╝░░░██║░░░╚██████╔╝██████╔╝██║╚█████╔╝  ██║░░░░░██║░░██║███████╗██║╚██████╔╝██║░░██║░░░██║░░░
╚═════╝░░░░╚═╝░░░░╚═════╝░╚═════╝░╚═╝░╚════╝░  ╚═╝░░░░░╚═╝░░╚═╝╚══════╝╚═╝░╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░

Nuxt 4 Boilerplate
@author: Studio Freight
*/

import { generateShades } from './shared/sass-utils/utils';

interface AppConfig {
	title: string;
	ssr: boolean;
	storyblok: {
		enabled: boolean;
		settings?: string | boolean;
		forceDraft?: boolean;
		apiOptions: {
			region?: string;
		};
	};
	marker?: {
		projectId: string;
		script: string;
	};
	three: {
		enabled: boolean;
		options: {
			alpha: boolean;
			antialias: boolean;
			stencil: boolean;
			depth: boolean;
			powerPreference: string;
			preserveDrawingBuffer: boolean;
		};
	};
	fonts: {
		assets?: {
			prefix: string;
		};
		defaults: {
			weights: number[];
		};
		families: {
			name: string;
			provider: string;
			weights?: number[];
		}[];
	};
	link: {
		prefetch: string;
	};
}

// Define base colors and generate their shades
const colors: any = generateShades({
	black: '#080808',
	'grey-600': '#606060',
	grey: '#909090',
	darkgrey: '#2F2C2C',
	white: '#fffef4',
	yellow: '#fff615',
});

// Define light and dark themes using generated colors
const themes: any = {
	light: {
		bg: colors['white'],
		fg: colors['darkgrey'],
		contrast: colors['yellow'],
	},
	dark: {
		bg: colors['darkgrey'],
		fg: colors['white'],
		contrast: colors['yellow'],
	},
};

// Define responsive design breakpoints for layouts
const breakpoints: any = {
	mobile: 960,
	wide: 1720,
};

const typography: any = {
	minVW: 960,
	baseVW: 1440,
	maxVW: 1920,
};

// Define grid system with columns, gap, and margin settings
const grid: any = {
	columns: [4, 12],
	gap: [8, 8],
	margin: [16, 48],
};

// Define global spacers
const spacers: any = [4, 8, 16, 32, 64, 96, 128];


// Application-level configuration (SSR, prefetching, etc.)
export const app: AppConfig = {
	title: 'Input Idea',
	ssr: false,
	storyblok: {
		enabled: false,
		forceDraft: process.env.STORYBLOK_FORCE_DRAFT === 'true',
		settings: false, // true if global settings must be loaded before the app is mounted
		apiOptions: {
			region: 'eu',
		},
	},
	three: {
		enabled: false,
		options: {
			alpha: false,
			antialias: false,
			stencil: false,
			depth: false,
			powerPreference: 'high-performance',
			preserveDrawingBuffer: false,
		},
	},
	fonts: {
		defaults: {
			weights: [300, 400, 500, 600, 700, 800, 900],
		},
		families: [
			{
				name: 'Zalando Sans',
				provider: 'google',
			}
		],
	},
	link: {
		prefetch: 'visibility', // nuxt default
	},
};

// Export the configuration object for use throughout SCSS
export default {
	colors,
	themes,
	breakpoints,
	typography,
	spacers,
	grid,
};
