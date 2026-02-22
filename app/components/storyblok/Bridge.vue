<template>
	<storyblok-page-wrapper />
	<!-- Bridge only, no rendering -->
</template>

<script setup lang="ts">
import { useStoryblokBridge, type ISbStoryData } from '@storyblok/js';

const props = defineProps<{
	storyId: number;
}>();

// v-model:story
const story = defineModel<ISbStoryData<any> | null>('story', {
	required: false,
});
// v-model:refreshKey
const refreshKey = defineModel<string | null>('refreshKey', {
	required: false,
});

const emit = defineEmits<{
	(
		e: 'story-updated',
		payload: { story: ISbStoryData<any>; refreshKey: string }
	): void;
}>();

// Initialize Storyblok bridge

useStoryblokBridge(props.storyId, (updatedStory: ISbStoryData<any>) => {
	console.log('Story updated via bridge:', updatedStory);

	story.value = updatedStory;
	refreshKey.value = `story-${props.storyId}-${Math.random()
		.toString(36)
		.substring(2, 7)}`;

	emit('story-updated', { story: updatedStory, refreshKey: refreshKey.value });
});
</script>
