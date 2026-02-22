import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ALink from './ALink.vue';

const meta: Meta<typeof ALink> = {
	title: 'UI/Link',
	component: ALink,
	argTypes: {
		href: {
			control: 'text',
			description: 'Destination URL or path',
		},
		ariaLabel: {
			control: 'text',
			description: 'ARIA label for accessibility',
		},
		noNewTab: {
			control: 'boolean',
			description: 'Force external links to open in the same tab',
		},
		replaceState: {
			control: 'boolean',
			description: 'Replace history state (Nuxt internal links only)',
		},
	},
	args: {
		href: '/',
		ariaLabel: 'Example link',
		noNewTab: false,
		replaceState: false,
	},
};

export default meta;
type Story = StoryObj<typeof ALink>;
type ALinkProps = InstanceType<typeof ALink>['$props'];

export const Internal: Story = {
	args: {
		href: '/',
	},
	render: (args: ALinkProps) => ({
		components: { ALink },
		setup: () => ({ args }),
		template: '<ALink v-bind="args">Internal link</ALink>',
	}),
};

export const External: Story = {
	args: {
		href: 'https://example.com',
	},
	render: (args: ALinkProps) => ({
		components: { ALink },
		setup: () => ({ args }),
		template: '<ALink v-bind="args">External link (new tab)</ALink>',
	}),
};

export const ExternalSameTab: Story = {
	args: {
		href: 'https://example.com',
		noNewTab: true,
	},
	render: (args: ALinkProps) => ({
		components: { ALink },
		setup: () => ({ args }),
		template: '<ALink v-bind="args">External link (same tab)</ALink>',
	}),
};

export const Anchor: Story = {
	args: {
		href: '#section-1',
	},
	render: (args: ALinkProps) => ({
		components: { ALink },
		setup: () => ({ args }),
		template: '<ALink v-bind="args">Anchor link</ALink>',
	}),
};

export const ReplaceState: Story = {
	args: {
		href: '/about',
		replaceState: true,
	},
	render: (args: ALinkProps) => ({
		components: { ALink },
		setup: () => ({ args }),
		template: '<ALink v-bind="args">Replace history state</ALink>',
	}),
};
