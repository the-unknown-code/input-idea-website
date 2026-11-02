<template>
  <section class="layout-project-focus">
    <div class="layout-project-focus__content layout-grid">
      <div class="title">
        <div class="h2">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </div>
        <div class="p --yellow">{{ blok.label }}</div>
        <div class="p-tiny --grey">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </div>
      </div>
      <div class="list">
        <div v-for="(item, i) in blok.list"
          :key="i">
          <div class="p --yellow">
            {{ item.title }}
          </div>
          <div v-if="item.description && item.description.length > 0"
            class="p-tiny --grey">
            <storyblok-richtext :content="item.description[0].text"
              cleanup />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PROJECT_FOCUS } from '~/libs/data';

defineProps({
  blok: {
    type: Object,
    required: false,
    default: PROJECT_FOCUS
  }
})
</script>


<style lang="scss" scoped>
.layout-project-focus {
  position: relative;
  text-transform: none;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;

  &__content {
    >div {
      grid-column: -1 / 1;

      @include desktop {
        grid-column: span 6;
      }
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 16px;

    @include mobile {
      margin-top: 32px;
    }

    >* {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-bottom: 16px;
      gap: 8px;

      &:not(:last-child) {
        border-bottom: 1px solid var(--grey-20);
      }
    }
  }

  .title {
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .p-tiny {
      margin-top: 32px;
    }
  }
}
</style>
