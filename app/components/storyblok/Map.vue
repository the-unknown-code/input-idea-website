<template>
	<component :is="mapComponents(blok.component)"
		v-for="(blok, index) in bloks"
		:key="`${refreshKey}-${blok._uid}`"
		v-bind="{ ...childProps, ...getBlokAttributes(blok) }"
		:blok="blok"
		:index="index" />
</template>

<script setup>
import { storyblokEditable } from '@storyblok/js';
import Services from '../common/layout/Services.vue';
import Stories from '../common/layout/Stories.vue';
import LogoMarquee from '../common/layout/LogoMarquee.vue';
import BlogBox from '../common/layout/BlogBox.vue';

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
	"ContentList": Services,
	"Stories": Stories,
	"LogoMarquee": LogoMarquee,
	"ArticlesBlock": BlogBox
};

const mapComponents = componentName => {
	return COMPONENT_MAP[componentName] || 'div';
};
</script>
