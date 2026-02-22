<template>
	<div>
		<slot :story="story" :refresh-key="refreshKey" />

		<client-only>
			<storyblok-bridge
				:story-id="story?.id"
				@story-updated="handleStoryUpdate"
			/>
		</client-only>
	</div>
</template>

<script setup lang="ts">
import { useAsyncStory } from '~/libs/storyblok';
import type { ISbStoryData } from '@storyblok/js';

const props = defineProps<{
	url: string;
	apiOptions?: any;
}>();

const { story, refreshKey } = await useAsyncStory(props.url, props.apiOptions);

const handleStoryUpdate = ({
	story: updatedStory,
	refreshKey: updatedRefreshKey,
}: {
	story: ISbStoryData<any>;
	refreshKey: string;
}) => {
	story.value = updatedStory;
	refreshKey.value = updatedRefreshKey;
};
</script>

<style scoped></style>
