<template>
  <section class="layout-logo-marquee">
    <common-marquee>
      <span v-for="item in blok.list"
        :key="item._uid">
        <img :src="getMedia(item).image.src"
          :alt="getMedia(item).image.alt" />
      </span>
    </common-marquee>
  </section>
</template>

<script setup lang="ts">
import { DATA_LOGO_MARQUEE } from '~/libs/data';
import { getMedia } from '~/libs/storyblok';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_LOGO_MARQUEE
  }
})

</script>

<style lang="scss" scoped>
.layout-logo-marquee {
  position: relative;
  width: 100%;

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
    height: 72px;
    aspect-ratio: 16 / 9;
    margin: 0 var(--spacer-16);
    padding: 0 var(--spacer-16);
  }

  img {
    position: relative;
    object-fit: contain;
    object-position: center;
  }
}
</style>
