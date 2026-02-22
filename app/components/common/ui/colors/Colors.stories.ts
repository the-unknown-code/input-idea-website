import type { Meta, StoryObj } from '@storybook/vue3-vite';
import config from '../../../../../app.config';

const meta: Meta = {
	title: 'Design System/Colors',
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Color palette from app.config.ts with generated opacity variants (0% to 95% in 5% increments).',
			},
		},
	},
};

export default meta;
type Story = StoryObj;

// Base color names
const baseColors = ['black', 'grey', 'white', 'green'];

// Get all opacity variants for a color
const getColorVariants = (colorName: string) => {
	const variants: Array<{ name: string; value: string; opacity: number }> = [];
	
	// Base color (100% opacity)
	if (config.colors[colorName]) {
		variants.push({
			name: colorName,
			value: config.colors[colorName],
			opacity: 100,
		});
	}
	
	// Opacity variants (0, 5, 10, ..., 95)
	for (let i = 0; i <= 19; i++) {
		const opacity = i * 5;
		const variantName = `${colorName}-${opacity}`;
		if (config.colors[variantName]) {
			variants.push({
				name: variantName,
				value: config.colors[variantName],
				opacity,
			});
		}
	}
	
	return variants;
};

export const ColorSwatches: Story = {
	render: () => ({
		setup() {
			const colorGroups = baseColors.map(colorName => ({
				name: colorName,
				variants: getColorVariants(colorName),
			}));
			
			return { colorGroups };
		},
		template: `
			<div style="padding: 2rem; background: #fffef4; min-height: 100vh;">
				<h1 style="color: #080808; margin: 0 0 2rem 0; font-size: 2rem; font-weight: bold;">
					Color Swatches
				</h1>
				<div 
					v-for="group in colorGroups" 
					:key="group.name"
					style="margin-bottom: 3rem;"
				>
					<h2 style="
						color: #080808; 
						margin: 0 0 1rem 0; 
						font-size: 1.25rem; 
						text-transform: capitalize;
						font-weight: 600;
					">
						{{ group.name }}
					</h2>
					<div style="
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
						gap: 1rem;
					">
						<div
							v-for="variant in group.variants"
							:key="variant.name"
							style="
								border-radius: 12px;
								overflow: hidden;
								border: 1px solid rgba(0, 0, 0, 0.1);
								background: rgba(0, 0, 0, 0.02);
							"
						>
							<div 
								:style="{
									background: variant.value,
									height: '80px',
									width: '100%',
								}"
							></div>
							<div style="padding: 1rem;">
								<div style="
									color: #080808;
									margin: 0 0 0.5rem 0;
									font-size: 0.875rem;
									font-weight: 600;
								">
									{{ variant.name }}
								</div>
								<div style="
									color: rgba(0, 0, 0, 0.6);
									font-family: monospace;
									font-size: 0.75rem;
									margin-bottom: 0.5rem;
									word-break: break-all;
								">
									{{ variant.value }}
								</div>
								<div style="
									color: rgba(0, 0, 0, 0.5);
									font-size: 0.7rem;
								">
									Opacity: {{ variant.opacity }}%
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`,
	}),
};

