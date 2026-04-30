<template>
  <section class="layout-text-list">
    <div class="layout-text-list__inner layout-grid">
      <div>
        <div v-text-reveal
          class="display">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </div>
        <div v-text-reveal
          class="p --grey">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </div>
      </div>
      <div ref="$content">
        <div v-for="(item, index) in blok.list"
          :key="item._uid"
          class="item">
          <div class="display --yellow">0<b>{{ Number(index) + 1 }}</b></div>
          <p class="p-tiny --grey">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import gsap from 'gsap/all';
import { DATA_POINT_LIST } from '~/libs/data';

defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_POINT_LIST

  }
})

const $content = ref<HTMLElement | null>(null);

const initialize = () => {
  if ($content.value) {
    const $items = $content.value.querySelectorAll('.item');

    $items.forEach((item) => {
      gsap.to(item, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
        },
      });
    });

  }
}

tryOnMounted(() => {
  initialize()
});
</script>

<style lang="scss" scoped>
.layout-text-list {
  position: relative;
  width: 100%;

  &__inner {
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(2, 1fr);
    }

    >div {
      display: flex;
      flex-direction: column;
      gap: var(--spacer-16);

      &:nth-child(2) {
        gap: var(--spacer-32);

        @include mobile {
          margin-top: var(--spacer-32);
        }

        @include desktop {
          align-items: flex-end;
          padding-left: var(--spacer-64);
        }
      }


    }
  }

  .item {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacer-16);
    max-width: 480px;
    opacity: 0;
    transform: translateY(80px);

    &:not(:last-child) {
      padding-bottom: var(--spacer-32);
      border-bottom: 1px solid var(--grey-20);
    }

    p {
      text-align: left;
    }
  }
}
</style>
