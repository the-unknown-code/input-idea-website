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
        <common-marquee>
          <span v-for="item in blok.marquee_3"
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

console.log(">>", blok)
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

        &:deep(.marquee) {
          &:nth-child(1) {
            img {
              width: 140px;
              flex: 0 0 140px;
            }
          }

          &:nth-child(2) {
            img {
              width: 260px;
              flex: 0 0 260px;
            }
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
      margin: 0 var(--spacer-4);
      padding: 0 var(--spacer-4);
      overflow: hidden;
    }
  }


  img {
    position: relative;
    width: 200px;
    flex: 0 0 200px;
    aspect-ratio: 202 / 100;
    object-fit: cover;
    border-radius: 12px;
  }
}
</style>
