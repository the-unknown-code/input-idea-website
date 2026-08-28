<template>
  <section class="layout-project-details">
    <div class="layout-project-details__content layout-grid">
      <div class="h2">
        <storyblok-richtext :content="blok.title[0].text"
          cleanup />
      </div>
      <div>
        <div class="media">
          <common-media :src="storyblokFormat(blok.media[0].image.filename, 420)" />
        </div>
      </div>
      <div></div>
    </div>
    <div class="layout-project-details__grid">
      <div v-for="(item, i) in blok.list"
        :key="i">
        <div class="counter h2 --grey">0<b>{{ Number(i) + 1 }}</b></div>
        <p class="p --yellow">{{ item.title }}</p>
        <p class="p-tiny --grey">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PROJECT_DETAILS } from '~/libs/data';
import { storyblokFormat } from '~/libs/storyblok';

defineProps({
  blok: {
    type: Object,
    required: false,
    default: PROJECT_DETAILS
  }
})

</script>


<style lang="scss" scoped>
.layout-project-details {
  position: relative;


  &__grid {
    position: relative;
    display: flex;
    flex-direction: column;

    gap: 12px;
    margin-top: 16px;


    @include desktop {
      flex-direction: row;
      flex-wrap: nowrap;
    }

    .counter {
      position: absolute;
      right: 16px;
      font-size: 48px !important;
      opacity: .3;
    }

    >div {
      position: relative;
      width: 100%;
      border: 1px solid var(--grey-40);
      border-radius: 16px;
      padding: 16px;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 64px;
    }
  }

  &__content {
    >div {
      grid-column: -1 / 1;

      &:nth-child(1) {
        @include desktop {
          grid-column: span 6;
        }
      }

      &:nth-child(2) {
        grid-column: span 2;
        background-color: var(--grey-20);
        border-radius: 16px;
        padding: 32px;

        display: flex;
        justify-content: center;
        align-items: center;

        @include desktop {
          grid-column: span 4;
        }
      }

      &:nth-child(3) {
        grid-column: span 2;
        background-color: var(--yellow);
        border-radius: 16px;

        @include desktop {
          grid-column: span 2;

        }
      }
    }
  }

  .media {


    &:deep(img) {
      width: 100%;
      height: 100%;
      object-fit: contain;
      max-width: 210px;
      margin: 0 auto;
    }

  }
}
</style>
