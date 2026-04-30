<template>
    <span :class="richtextClass"
        v-bind="$attrs"
        v-html="html" />
</template>

<script setup lang="ts">
import { renderStoryblokRichtext } from '~/libs/storyblok';
import type { StoryblokRichtextDocument, StoryblokRichtextOptions } from '~/libs/storyblok';
import { cleanupHtml } from '~/libs/storyblok/richtext';

const props = withDefaults(
    defineProps<{
        content: StoryblokRichtextDocument | null | undefined;
        richtextClass?: string;
        options?: StoryblokRichtextOptions;
        cleanup?: boolean;
    }>(),
    { richtextClass: undefined, options: undefined },

);



const html = computed(() => {
    const rendered = renderStoryblokRichtext(props.content, props.options);
    return props.cleanup ? cleanupHtml(rendered) : rendered;
});
</script>
