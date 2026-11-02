<template>
  <section class="layout-text-carousel">

    <div class="layout-text-carousel__content layout-grid">
      <div>
        <div class="number --lightgrey">
          <span v-for="(letter, index) in currentItem.eyebrow.split('')"
            :key="`${letter}-${index}`"
            :class="['h2', {
              heavy:
                Number(index) > 0
            }]">{{ letter === ' ' ? '\u00a0' : letter }}</span>
        </div>
      </div>
      <div>
        <div v-text-reveal
          class="h2-alt">
          <storyblok-richtext :content="currentItem.title[0].text"
            cleanup />
        </div>
        <div v-text-reveal
          class="p --grey">
          <storyblok-richtext :content="currentItem.description[0].text"
            cleanup />
        </div>
      </div>
    </div>

    <div class="layout-text-carousel__counter">
      <div v-for="i in blok.list.length"
        :key="i">
        <span :class="['p-tiny', { active: activeIndex === i - 1 }]"
          @click="activeIndex = i - 1">{{ String(i).padStart(2, '0') }}</span>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { TEXT_CAROUSEL } from '~/libs/data';



const { blok } = defineProps({
  blok: {
    type: Object,
    required: false,
    default: TEXT_CAROUSEL
  }
})

const activeIndex = ref<number>(0)
const currentItem = computed(() => {
  return blok.list[activeIndex.value]
})
</script>


<style lang="scss" scoped>
.layout-text-carousel {
  position: relative;
  max-width: 1144px;
  margin: 0 auto;


  &__counter {
    position: relative;
    width: max-content;
    padding: 10px 16px;
    border-radius: 8px;
    background-color: var(--grey-20);
    display: flex;
    align-items: center;
    margin: 0 auto;
    margin-top: 24px;
    gap: 16px;

    @include desktop {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      flex-direction: column;
      justify-content: center;
      margin-top: 0;
      gap: 6px;
      padding: 16px 12px;
    }

    .p-tiny {
      position: relative;
      cursor: pointer;
    }

    .active {
      font-weight: bold;
      color: var(--yellow);
      font-size: 14px;
      pointer-events: none;
      cursor: default;
    }
  }

  &__content {
    >div {
      display: flex;
      grid-column: -1 / 1;

      &:nth-child(1) {
        @include desktop {
          grid-column: span 3;
          justify-content: flex-end;

          .number {
            padding-right: 32px;
          }
        }
      }

      &:nth-child(2) {
        flex-direction: column;
        gap: 16px;

        @include desktop {
          grid-column: span 9;
          align-items: flex-start;
        }
      }
    }
  }
}
</style>
