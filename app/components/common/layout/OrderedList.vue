<template>
  <section class="layout-ordered-list">
    <div class="layout-ordered-list__content">
      <h2 class="h3">
        <storyblok-richtext :content="blok.title[0].text"
          cleanup />
      </h2>
      <p v-if="blok.description.length"
        class="--yellow">{{ blok.description }}
      </p>

      <ol>
        <li v-for="item in blok.list"
          ref="$items"
          :key="item._uid">
          <p v-text-reveal
            class="h2 --grey">
            <storyblok-richtext :content="item.text"
              cleanup />
          </p>
        </li>
      </ol>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ScrollTrigger } from 'gsap/all';

defineProps({
  blok: {
    type: Object,
    required: true,
  }
})

const $items = ref<HTMLElement[]>([]);
const scrollTriggers: ScrollTrigger[] = [];

const initialize = () => {
  $items.value.forEach((item) => {
    scrollTriggers.push(
      ScrollTrigger.create({
        trigger: item,
        start: 'top bottom',
        end: 'top 60%',
        onEnter: () => item.classList.add('is-highlighted'),
        onLeave: () => item.classList.remove('is-highlighted'),
        onEnterBack: () => item.classList.add('is-highlighted'),
        onLeaveBack: () => item.classList.remove('is-highlighted'),
      })
    );
  });
};

tryOnMounted(async () => {
  await nextTick();
  initialize();
});

tryOnBeforeUnmount(() => {
  scrollTriggers.forEach((trigger) => trigger.kill());
});
</script>

<style lang="scss" scoped>
.layout-ordered-list {
  position: relative;
  width: 100%;
  margin: 0 auto;


  &__content {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;

  }

  ol {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 16px;

    li {
      position: relative;
      width: 100%;
      text-align: center;
      padding: 8px 0;
      text-wrap: balance;

      @include mobile {
        padding: 3px 0;
      }

      &:deep(.h2) {
        transition: color 200ms ease;

        @include mobile {
          font-size: 32px !important;
        }
      }

      &.is-highlighted {
        &:deep(.h2) {
          color: var(--yellow);
        }
      }
    }
  }
}
</style>
