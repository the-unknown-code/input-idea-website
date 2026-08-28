<template>

  <section class="layout-text-hero">
    <div v-if="blok.media && blok.media[0]"
      class="media">
      <common-media :src="storyblokFormat(blok.media[0].image.filename, 420)"
        cover />
    </div>
    <h1 class="display header">
      <storyblok-richtext :content="blok.title[0].text"
        cleanup />
    </h1>
    <h2 class="p --yellow">{{ blok.description }}</h2>
  </section>

</template>

<script setup lang="ts">
import { SECTION_TITLE } from '~/libs/data';
import { storyblokFormat } from '~/libs/storyblok';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: SECTION_TITLE
  }
})

</script>

<style lang="scss" scoped>
.layout-text-hero {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-16);
  max-width: 960px;
  margin: 0 auto;
  text-align: center;

  .media {
    position: relative;
    width: 320px;
    aspect-ratio: 288 / 77;
    border-radius: var(--spacer-16);
    overflow: hidden;
  }

  h2 {
    margin-top: -8px;
  }
}
</style>
