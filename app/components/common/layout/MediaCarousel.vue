<template>
  <section class="layout-media-carousel">
    <div class="layout-media-carousel__inner">
      <transition name="fade"
        mode="out-in">
        <common-media :key="activeIndex"
          :src="images[activeIndex] ?? ''"
          cover />
      </transition>
    </div>
    <div class="layout-media-carousel__controls">
      <div v-for="index in images.length"
        :key="index"
        :class="['layout-media-carousel__control', '--darkgrey p-tiny', { active: index - 1 === activeIndex }]"
        @click="activeIndex = index - 1">
        {{ String(index).padStart(2, '0') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

const activeIndex = ref(0);
const images = [
  'https://picsum.photos/800/800?random=1',
  'https://picsum.photos/800/800?random=2',
  'https://picsum.photos/800/800?random=3',
  'https://picsum.photos/800/800?random=4',
  'https://picsum.photos/800/800?random=5',
];

</script>


<style lang="scss" scoped>
.layout-media-carousel {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: var(--spacer-16);
  overflow: hidden;


  @include desktop {
    aspect-ratio: 1250 / 430;
  }

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__controls {
    position: absolute;
    width: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--spacer-8);
    background-color: var(--yellow);
    padding: 8px;
    border-radius: var(--spacer-8);

    @include desktop {
      left: var(--spacer-32);
      top: 50%;
      transform: translateY(-50%);
    }

    @include mobile {
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      flex-direction: row;
    }
  }

  &__control {
    position: relative;
    cursor: pointer;

    &.active {
      font-weight: 900;
      pointer-events: none;
      cursor: default;
    }

  }
}
</style>
