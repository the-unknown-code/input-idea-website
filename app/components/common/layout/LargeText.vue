<template>
  <section class="layout-large-text">
    <div v-text-reveal
      class="display">
      <storyblok-richtext :content="blok.text[0].text"
        cleanup />
    </div>
  </section>
</template>

<script setup lang="ts">
import { DATA_LARGE_TEXT } from '~/libs/data';


defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_LARGE_TEXT

  }
})
</script>

<style lang="scss" scoped>
.layout-large-text {
  position: relative;
  width: 100%;
  text-align: center;

  >div {
    color: var(--grey-20);

    @include mobile {
      font-size: 48px;
    }
  }
}
</style>
