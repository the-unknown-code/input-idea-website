<template>
    <span v-bind="$attrs"
        v-html="html" />
</template>

<script setup lang="ts">
import { renderHTML } from '~/libs/storyblok/text';

const props = withDefaults(
    defineProps<{
        content: any,
        allowedTags?: string[]
    }>(),
    {
        allowedTags: () => ['b', 'strong']
    }
);

const html = computed(() => {
    return renderHTML(props.content, props.allowedTags)
});
</script>
