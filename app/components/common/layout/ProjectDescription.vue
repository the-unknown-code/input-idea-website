<template>
  <section :class="['layout-project-description', { background: blok.background }]">
    <div class="layout-project-description__content layout-grid">
      <div v-if="blok.title?.length">
        <div :class="['--yellow', blok.background ? 'h2 ' : 'h2']">
          {{ blok.title }}
        </div>
      </div>
      <div :class="{ full: blok.title.length === 0 }">
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
  max-width: 1280px;
  margin: 0 auto;

  &.background {
    padding: 16px;
    background-color: var(--lightgrey-30);
    border-radius: 16px;

    @include desktop {
      padding: 32px;
    }

    .h2 {
      text-transform: none;
    }
  }

  &__content {
    >div {
      grid-column: -1 / 1;

      &:not(.full) {
        @include desktop {
          grid-column: span 6;
        }
      }


    }
  }
}
</style>
