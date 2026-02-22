<template>
	<main class="page-index">
		<h1>Input Idea</h1>
	</main>>
</template>

<script setup lang="ts">
import { useSeo } from '~/composables/useSeo';
import { useAsyncStory } from '~/libs/storyblok';

const { story } = await useAsyncStory('home');

useSeo(story);
</script>

<style lang="scss" scoped>
.page-index {
	position: relative;
}
</style>
