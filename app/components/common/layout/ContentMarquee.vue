<template>
  <section class="layout-content-marquee">
    <div class="layout-content-marquee__content layout-grid">
      <div>
        <h3 v-if="blok.title?.length">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </h3>
        <p v-if="blok.subtitle?.length"
          class="--yellow">
          <storyblok-richtext :content="blok.subtitle[0].text"
            cleanup />
        </p>
        <p v-if="blok.description?.length"
          class="description --grey">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </p>
      </div>
      <div>
        <common-marquee>
          <span v-for="item in blok.marquee_1"
            :key="item._uid">
            <img :src="getMedia(item).image.src"
              :alt="getMedia(item).image.alt" />
          </span>
        </common-marquee>
        <common-marquee reverse>
          <span v-for="item in blok.marquee_2"
            :key="item._uid">
            <img :src="getMedia(item).image.src"
              :alt="getMedia(item).image.alt" />
          </span>
        </common-marquee>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getMedia } from '~/libs/storyblok';

const { blok } = defineProps({
  blok: {
    type: Object,
    required: true,
  }
})
</script>

<style lang="scss" scoped>
.layout-content-marquee {
  position: relative;
  width: 100%;

  &__content {

    >div {
      grid-column: -1 / 1;

      &:nth-child(1) {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      --size: 64px;

      @include desktop {
        --size: 256px;
      }


      &:nth-child(2) {

        display: flex;
        flex-direction: column;
        gap: 12px;

        /* Apply a left and right edge gradient mask */
        mask-image: linear-gradient(to right,
            transparent 0px,
            black var(--size),
            black calc(100% - var(--size)),
            transparent 100%);
        -webkit-mask-image: linear-gradient(to right,
            transparent 0px,
            black var(--size),
            black calc(100% - var(--size)),
            transparent 100%);

        // row heights; images keep their own ratio (width follows height)
        &:deep(.marquee) {
          &:nth-child(1) img {
            height: 200px;
          }

          &:nth-child(2) img {
            height: 120px;
          }
        }

      }

      .description {
        margin-top: 12px;
      }

      @include desktop {
        &:nth-child(1) {
          grid-column: span 5;

        }

        &:nth-child(2) {
          grid-column: span 7;
        }
      }
    }


  }

  &:deep(.marquee) {
    span {
      position: relative;
      display: block;
      flex: none;
      margin: 0 var(--spacer-4);
      padding: 0 var(--spacer-4);
      overflow: hidden;
    }
  }


  img {
    position: relative;
    display: block;
    width: auto;
    max-width: none;
    border-radius: 12px;
  }
}
</style>
