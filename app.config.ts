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
		}[];
	};
	link: {
		prefetch: string;
	};
}

// Define base colors and generate their shades
const colors: any = generateShades({
	black: '#080808',
	grey: '#909090',
	white: '#fffef4',
	green: '#00ff6a',
});

// Define light and dark themes using generated colors
const themes: any = {
	light: {
		bg: colors['white'],
		fg: colors['black'],
		contrast: colors['green'],
	},
	dark: {
		bg: colors['black'],
		fg: colors['white'],
		contrast: colors['green'],
	},
};

// Define responsive design breakpoints for layouts
const breakpoints: any = {
	mobile: 800,
	wide: 1720,
};

const typography: any = {
	minVW: 800,
	baseVW: 1440,
	maxVW: 1920,
};

// Define grid system with columns, gap, and margin settings
const grid: any = {
	columns: [4, 16],
	gap: [8, 8],
	margin: [16, 48],
};

// Define global spacers
const spacers: any = [4, 8, 16, 32, 64];


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
			weights: [300, 400, 500, 700, 900],
		},
		families: [
			{
				name: 'WooowRegular',
				provider: 'local',
			},
			{
				name: 'WooowLight',
				provider: 'local',
			},
			{
				name: 'WooowHeavy',
				provider: 'local',
			},
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
