<template>
  <div :class="['common-media', { 'common-media--cover': cover }]">
    <video v-if="type === MEDIA_TYPES.VIDEO"
      ref="$video"
      :src="src"
      :autoplay="loading === 'eager'"
      :preload="loading === 'eager' ? 'auto' : 'none'"
      muted
      loop
      playsinline />
    <nuxt-img v-else-if="type === MEDIA_TYPES.IMAGE"
      :src="src"
      :loading="loading"
      draggable="false"
      alt="Media Mask"
      :width="size"
      :sizes="sizes || undefined"
      :quality="quality" />

  </div>
</template>

<script setup lang="ts">
import { MEDIA_TYPES } from '~/libs/constants/const';

const props = defineProps({
  type: {
    type: String,
    required: false,
    validator: (value: (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES] | undefined) => value ? Object.values(MEDIA_TYPES).includes(value) : true,
    default: MEDIA_TYPES.IMAGE,
  },
  src: {
    type: String,
    required: true,
  },
  cover: {
    type: Boolean,
    required: false,
    default: false,
  },
  loading: {
    type: String,
    required: false,
    default: 'lazy',
  },
  size: {
    type: Number,
    required: false,
    default: 1280,
  },
  quality: {
    type: Number,
    required: false,
    default: 80,
  },
  sizes: {
    type: String,
    required: false,
    default: '',
  },
});

// lazy videos only download/play while on screen
const $video = ref<HTMLVideoElement | null>(null);
useIntersectionObserver($video, ([entry]) => {
  const video = $video.value;
  if (!video || props.loading === 'eager') return;
  if (entry?.isIntersecting) video.play().catch(() => {});
  else video.pause();
}, { rootMargin: '200px' });
</script>


<style lang="scss" scoped>
.common-media {
  position: relative;
  width: 100%;
  height: auto;

  &--cover {
    height: 100%;


    img,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  &:not(&--cover) {

    img,
    video {
      position: relative;
      display: block;
      width: 100%;
      height: auto;
    }
  }


}
</style>
