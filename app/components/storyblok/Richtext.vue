<template>
    <span v-bind="$attrs"
        v-html="html" />
</template>

<script setup lang="ts">

import type { StoryblokRichTextInput } from '@storyblok/richtext';
import { renderHTML } from '~/libs/storyblok/text';

const props = withDefaults(
    defineProps<{
        content: StoryblokRichTextInput | null | undefined;
        allowedTags?: string[]
    }>(),
    {
        allowedTags: () => ['b', 'strong', 'br']
    },

);

const html = computed(() => {
    return renderHTML(props.content, props.allowedTags)
});
</script>
