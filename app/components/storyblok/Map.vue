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
import ProjectHero from '../common/layout/ProjectHero.vue';
import ProjectGridBlock from '../common/layout/ProjectGridBlock.vue';
import MediaCarousel from '../common/layout/MediaCarousel.vue';
import LinkList from '../common/layout/LinkList.vue';
import TextCarousel from '../common/layout/TextCarousel.vue';
import StoryHighlight from '../common/layout/StoryHighlight.vue';
import SectionTitle from '../common/layout/SectionTitle.vue';
import AiForm from '../common/layout/AiForm.vue';
import CaseHistory from '../common/layout/CaseHistory.vue';
import ProjectDescription from '../common/layout/ProjectDescription.vue';
import ProjectDetails from '../common/layout/ProjectDetails.vue';
import ProjectFocus from '../common/layout/ProjectFocus.vue';

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
	"ProjectHero": ProjectHero,
	"ContentBlock": ProjectGridBlock,
	"Stories": Stories,
	"LogoMarquee": LogoMarquee,
	"ArticlesBlock": BlogBox,
	"ThreeColumns": ThreeColumns,
	"PointList": TextList,
	"LargeText": LargeText,
	"MediaMarquee": MediaMarquee,
	"FocusText": FocusText,
	"FocusList": FocusItem,
	"Carousel": MediaCarousel,
	"LinkList": LinkList,
	"CarouselText": TextCarousel,
	"StoryHighlight": StoryHighlight,
	"SectionTitle": SectionTitle,
	"Chatbot": AiForm,
	"Portfolio": CaseHistory,
	"ProjectDescription": ProjectDescription,
	"ProjectDetails": ProjectDetails,
	"ProjectFocus": ProjectFocus


};

const mapComponents = componentName => {
	return COMPONENT_MAP[componentName] || 'div';
};
</script>
