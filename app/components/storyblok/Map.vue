<template>
	<component
		:is="mapComponents(blok.component)"
		v-for="(blok, index) in bloks"
		:key="`${refreshKey}-${blok._uid}`"
		v-bind="{ ...childProps, ...getBlokAttributes(blok) }"
		:blok="blok"
		:index="index"
	/>
</template>

<script setup>
import { storyblokEditable } from '@storyblok/js';
import BlogAllArticles from '~/components/blog/AllArticles.vue';

const props = defineProps({
	bloks: {
		type: Array,
		default: () => [],
	},
	refreshKey: {
		type: String,
		default: '',
	},
});

const childProps = computed(() => {
	const { bloks, refreshKey, ...other } = toRaw(props);
	return other;
});

const getBlokAttributes = blok => {
	const attributes = storyblokEditable(blok);
	return attributes;
};

const COMPONENT_MAP = {
	all_articles: BlogAllArticles,
};

const mapComponents = componentName => {
	return COMPONENT_MAP[componentName] || 'div';
};
</script>
