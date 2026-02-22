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
	<a
		v-if="isAbsoluteLink"
		:class="['a-div', 'has-link']"
		:href="href"
		:aria-label="ariaLabel"
		:target="noNewTab ? '_self' : '_blank'"
		:rel="noNewTab ? '' : 'noopener noreferrer'"
	>
		<slot />
	</a>
	<a
		v-else-if="isAnchorLink"
		class="a-div"
		:href="href"
		:aria-label="ariaLabel"
	>
		<slot />
	</a>
	<nuxt-link
		v-else
		:to="href"
		:aria-label="ariaLabel"
		:replace="replaceState"
		:prefetch-on="app.link.prefetch"
	>
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
});

const {
	public: { app },
} = useRuntimeConfig();

const isAbsoluteLink = computed(() => {
	return props.noNewTab || /^mailto:|^tel:/.test(props.href);
});

const isAnchorLink = computed(() => {
	return props.href.startsWith('#');
});
</script>

<style scoped></style>
