<template>
  <section class="layout-claim-hero">
    <div>
      <div>
        <div class="media">
          <common-media :src="storyblokFormat(blok.media[0].image.filename, 420)"
            cover />
        </div>
      </div>
      <div>
        <h1 class="display header">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </h1>
        <p class="highlight --yellow">{{ blok.highlight }}</p>
      </div>
    </div>

    <p class="p-small --grey-600">{{ blok.description }}</p>
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
.layout-claim-hero {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacer-16);
  max-width: 960px;
  margin: 0 auto;
  text-align: center;

  >div {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 24px;

    @include desktop {
      flex-direction: row;
    }

    >div {
      &:nth-child(1) {
        position: relative;
        border-radius: 12px;
        overflow: hidden;
        width: 100%;
        aspect-ratio: 4;

        @include desktop {
          width: 240px;
          height: auto;
        }

        .media {
          @include fill(absolute);
        }
      }
    }
  }

  h1 {
    text-align: left;
    text-wrap: balance;
    align-self: self-start;
  }

  p {

    &:not(.highlight) {
      margin-top: 32px;
      text-align: left;

      @include desktop {
        margin-top: 64px;
      }
    }

    &.highlight {
      text-align: left;
    }

  }
}
</style>
