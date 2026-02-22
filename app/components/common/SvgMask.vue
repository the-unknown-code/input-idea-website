<!--
  SvgMask Component
  -----------------
  A lightweight wrapper for applying an external SVG as a CSS mask image.

  Features:
   • Dynamically applies an SVG URL as a mask over a `div`.
   • Supports optional Storyblok-specific URL transformation.
   • Ensures the masked element can be styled or extended with background/foreground content.

  Props:
   • svg (String) → The SVG source URL to use as the mask.
   • storyblok (Boolean, default: true) → If true, modifies the URL (switches `https://a` to `https://a2`) for Storyblok asset optimization.
   
-->

<template>
	<div v-if="svg && source" class="svg-mask" :style="style" />
</template>

<script setup lang="ts">
const props = defineProps({
	svg: {
		type: String,
		default: '',
	},
	storyblok: {
		type: Boolean,
		default: true,
	},
});

const source = computed(() => {
	if (props.storyblok) {
		return props.svg.replace('https://a', 'https://a2');
	}
	return props.svg;
});

const style = computed(() => ({
	maskImage: `url(${source.value})`,
}));
</script>

<style lang="scss" scoped>
.svg-mask {
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
}
</style>
