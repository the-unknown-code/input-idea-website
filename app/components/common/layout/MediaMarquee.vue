<template>
  <section class="layout-media-marquee">
    <common-marquee>
      <span v-for="item in blok.list"
        :key="item._uid">
        <!-- 2x the display height for sharp images; width follows each image's own ratio -->
        <common-media :src="storyblokFormatHeight(getMedia(item).image.src, 200)" />
      </span>
    </common-marquee>
  </section>
</template>

<script setup lang="ts">
import { DATA_MEDIA_MARQUEE } from '~/libs/data';
import { getMedia } from '~/libs/storyblok';
import { storyblokFormatHeight } from '~/libs/storyblok/utils';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_MEDIA_MARQUEE

  }
})

</script>

<style lang="scss" scoped>
.layout-media-marquee {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;


  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,
        var(--darkgrey) 16px,
        transparent 20%,
        transparent 80%,
        var(--darkgrey) calc(100% - 16px));
  }


  // the section height drives everything: set `height` (or --media-height) on
  // .layout-media-marquee and the marquee + images fill it, keeping each image's ratio
  // not declared here, so a value set on a parent/page (or inline) isn't overridden
  height: var(--media-height, 86px);

  &:deep(.marquee) {
    width: 100%;
    flex: 1;
    min-height: 0;
    height: 100%;

    .marquee--track,
    .inner {
      height: 100%;
    }

    .common-media {
      height: 100%;
      width: auto;
    }

    img {
      position: relative;
      display: block;
      height: 100% !important;
      width: auto !important;
      max-width: none;
      object-fit: contain;
      border-radius: 8px;
    }

    .inner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  span {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: auto;
    height: 100%;
    margin: 0 8px;
    overflow: hidden;


  }


}
</style>
