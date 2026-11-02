<template>
  <section class="layout-project-hero">
    <div class="media">
      <common-media :src="storyblokFormat(getMedia(blok.media[0]).image.src, 1280)"
        cover />
      <div class="content">
        <h1 class="p-tiny">{{ blok.eyebrow }}</h1>
        <h2 class="p-big">{{ blok.claim }}</h2>
      </div>
    </div>
    <div class="description">
      <p v-text-reveal
        class="--grey">
        <storyblok-richtext :content="blok.description[0].text"
          cleanup />
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DATA_CONTENT_HEADER } from '~/libs/data';
import { getMedia, storyblokFormat } from '~/libs/storyblok';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_CONTENT_HEADER
  }
})
</script>


<style lang="scss" scoped>
.layout-project-hero {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacer-32);

  .media {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 2;
    border-radius: var(--spacer-16);
    overflow: hidden;

    @include desktop {
      aspect-ratio: 1250 / 480;
    }

    .content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: var(--spacer-16);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      gap: var(--spacer-8);
      z-index: 10;
      max-width: 860px;

      @include desktop {
        padding: var(--spacer-32);
      }

      h1 {
        position: relative;
        padding: var(--spacer-4) var(--spacer-8);
        background: var(--yellow);
        border-radius: var(--spacer-4);
        color: var(--darkgrey);
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, transparent 0%, var(--black-50) 100%);
    }
  }

  .description {
    max-width: 1280px;
  }
}
</style>
