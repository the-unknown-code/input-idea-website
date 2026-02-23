<!--

  A-Link Component <a-link />
  ----------------
  A flexible link wrapper that intelligently decides whether to render:
   - An external `<a>` tag for absolute links (http(s), mailto, tel),
   - An anchor `<a>` tag for in-page navigation (`#anchor`),
   - Or a `<nuxt-link>` for internal Nuxt routes.

  Props:
   • href (String, required) → The destination URL or path.
   • ariaLabel (String) → Accessibility label for screen readers.
   • replaceState (Boolean) → If true, replaces history state instead of pushing a new one (applies to `<nuxt-link>`).
   • noNewTab (Boolean) → If true, external links will open in the same tab.

  This ensures consistent handling of links across the app with proper accessibility,
  SEO-friendly markup, and safe external linking (`noopener noreferrer`).

-->

<template>
	<a v-if="isAbsoluteLink"
		:class="['a-div', 'has-link', { disabled }]"
		:href="href"
		:aria-label="ariaLabel"
		:target="noNewTab ? '_self' : '_blank'"
		:rel="noNewTab ? '' : 'noopener noreferrer'">
		<slot :is-absolute-link="true"
			:is-anchor-link="false" />
	</a>
	<a v-else-if="isAnchorLink"
		key="anchor"
		:class="['a-div', { disabled }]"
		:href="href"
		:aria-label="ariaLabel">
		<slot :is-absolute-link="false"
			:is-anchor-link="true" />
	</a>
	<nuxt-link v-else
		:class="['a-div', { disabled }]"
		:to="href"
		:aria-label="ariaLabel"
		:replace="replaceState"
		:prefetch-on="{
			visibility: app.link.prefetch === 'visibility',
			interaction: app.link.prefetch === 'interaction',
		}">
		<slot />
	</nuxt-link>
</template>

<script setup lang="ts">
const props = defineProps({
	href: {
		type: String,
		required: true,
	},
	ariaLabel: {
		type: String,
		default: '',
	},
	replaceState: {
		type: Boolean,
		default: false,
	},
	noNewTab: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const {
	public: { app },
} = useRuntimeConfig();

const isAbsoluteLink = computed(() => {
	const isProtocolLink =
		/^mailto:/.test(props.href) ||
		/^tel:/.test(props.href) ||
		props.href.startsWith('http');

	// Treat root-relative asset files (e.g., /privacy-policy.pdf) as external anchors
	const isAssetFile =
		props.href.startsWith('/') && /\.[a-z0-9]{2,8}(?:$|\?)/i.test(props.href);

	return isProtocolLink || isAssetFile;
});

const isAnchorLink = computed(() => {
	return props.href.startsWith('#');
});
</script>

<style lang="scss" scoped>
.a-div {
	width: max-content;

	&.disabled {
		cursor: not-allowed !important;
	}
}
</style>
