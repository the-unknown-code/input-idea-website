<template>
  <section class="layout-project-description">
    <div class="layout-project-description__content layout-grid">
      <div>
        <div class="h2 --yellow">
          {{ blok.title }}
        </div>
      </div>
      <div>
        <p class="--grey">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

defineProps({
  blok: {
    type: Object,
    required: true,
  }
})
</script>


<style lang="scss" scoped>
.layout-project-description {
  position: relative;

  &__content {
    >div {
      grid-column: -1 / 1;

      @include desktop {
        grid-column: span 6;
      }
    }
  }
}
</style>
