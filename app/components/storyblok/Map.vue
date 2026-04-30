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
import ThreeColumns from '../common/layout/ThreeColumns.vue';
import TextList from '../common/layout/TextList.vue';
import LargeText from '../common/layout/LargeText.vue';
import MediaMarquee from '../common/layout/MediaMarquee.vue';
import FocusText from '../common/layout/FocusText.vue';
import FocusItem from '../common/layout/FocusItem.vue';

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
	"ArticlesBlock": BlogBox,
	"ThreeColumns": ThreeColumns,
	"PointList": TextList,
	"LargeText": LargeText,
	"MediaMarquee": MediaMarquee,
	"FocusText": FocusText,
	"FocusList": FocusItem

};

const mapComponents = componentName => {
	return COMPONENT_MAP[componentName] || 'div';
};
</script>
