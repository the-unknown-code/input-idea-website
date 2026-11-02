<template>
  <section class="layout-media-marquee">
    <common-marquee>
      <span v-for="item in blok.list"
        :key="item._uid">
        <common-media :src="storyblokFormat(getMedia(item).image.src, 420)"
          cover />
      </span>
    </common-marquee>
  </section>
</template>

<script setup lang="ts">
import { DATA_MEDIA_MARQUEE } from '~/libs/data';
import { getMedia, storyblokFormat } from '~/libs/storyblok';


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


  &:deep(.marquee) {
    width: 100%;

    img {
      position: relative;
      object-fit: cover;
      width: 100%;
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
    height: 86px;
    aspect-ratio: 16 / 6;
    margin: 0 8px;
    overflow: hidden;


  }


}
</style>
