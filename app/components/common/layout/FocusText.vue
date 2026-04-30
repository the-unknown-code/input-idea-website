<template>
  <section class="layout-focus-text">
    <div class="layout-grid">
      <div />
      <div>
        <div class="media">
          <common-media :src="storyblokFormat(getMedia(blok.image[0]).image.src, 480)"
            cover />
        </div>
      </div>
      <div>
        <h1 class="display">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </h1>
        <p class="--grey-600">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DATA_FOCUS_TEXT } from '~/libs/data';
import { getMedia, storyblokFormat } from '~/libs/storyblok';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_FOCUS_TEXT

  }
})

</script>


<style lang="scss" scoped>
.layout-focus-text {
  position: relative;

  .layout-grid {
    width: 100%;

    >div {
      position: relative;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      grid-column: -1 / 1;

      &:nth-child(1) {
        background-color: var(--yellow);

        @include mobile {
          aspect-ratio: 10;
        }

        @include desktop {
          grid-column: span 1;
        }
      }

      &:nth-child(2) {

        @include mobile {
          aspect-ratio: 3;
        }


        @include desktop {
          grid-column: span 4;
        }
      }

      &:nth-child(3) {
        padding: 16px;
        background-color: var(--lightgrey);

        @include desktop {
          padding: 32px;
          grid-column: span 7;
        }
      }

    }

    .media {
      @include fill(absolute);
    }
  }

  p {
    margin-top: 16px;

    b {
      color: var(--grey);
    }
  }

}
</style>
