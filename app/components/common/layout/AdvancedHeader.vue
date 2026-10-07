<template>
  <section :class="['layout-advanced-header', { big: blok.h1 }]">
    <div v-for="(item, i) in blok.list"
      :key="i"
      class="layout-advanced-header--item">
      <div v-if="item.label_1?.length"
        :class="[blok.h1 ? 'h1' : 'h2']">
        <storyblok-richtext :content="item.label_1[0].text"
          cleanup />
      </div>
      <div :class="['media', { fill: !item.media?.length }]">
        <common-media v-if="item.media?.length"
          :src="storyblokFormat(item.media[0].image.filename, 640)"
          cover />
      </div>
      <div v-if="item.label_2?.length"
        :class="[blok.h1 ? 'h1' : 'h2']">
        <storyblok-richtext :content="item.label_2[0].text"
          cleanup />
      </div>
    </div>
    <p v-if="blok.description?.length"
      class="p description">
      <storyblok-richtext :content="blok.description[0].text"
        cleanup />
    </p>
  </section>
</template>

<script setup lang="ts">
import { storyblokFormat } from '~/libs/storyblok';

const props = defineProps({
  blok: {
    type: Object,
    required: true,
  }
})

console.log(props.blok)
</script>


<style lang="scss" scoped>
.layout-advanced-header {
  position: relative;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 12px;

  &.big {
    max-width: 1440px;
  }

  &--item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .media {
    position: relative;
    height: auto;
    flex-grow: 1;
    align-self: stretch;
    overflow: hidden;


    border-radius: 16px;

    &.fill {
      background-color: var(--yellow);
    }
  }

  .description {
    position: relative;
    width: 100%;
    text-align: center;
    color: var(--yellow);
    margin-top: 16px;

    b {
      opacity: .2;
    }
  }

}
</style>
