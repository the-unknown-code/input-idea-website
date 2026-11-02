<template>
  <section class="layout-who-title">
    <div>
      <h2>{{ blok.label_top }}</h2>
      <div class="media">
        <common-media v-if="blok.media?.length"
          :src="storyblokFormat(blok.media[0].image.filename, 640)"
          cover />
      </div>
    </div>
    <div>
      <h2><b>{{ blok.label_bottom }}</b></h2>
      <p class="--yellow">{{ blok.description }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storyblokFormat } from '~/libs/storyblok';


defineProps({
  blok: {
    type: Object,
    required: true,
  }
})
</script>



<style lang="scss" scoped>
.layout-who-title {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  max-width: 1024px;
  gap: 8px;
  margin: 0 auto;

  >div {
    position: relative;
    width: 100%;
    display: flex;
    height: auto;
    align-items: center;
    gap: 8px;

    @include mobile {
      flex-direction: column;
    }
  }

  .media {
    position: relative;
    flex-grow: 1;
    height: auto;
    background-color: var(--yellow);
    align-self: stretch;
    border-radius: 16px;
    overflow: hidden;

    @include mobile {
      display: none;
    }
  }

}
</style>
