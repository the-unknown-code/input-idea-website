<template>
  <section class="layout-services">
    <div class="layout-services__inner layout-grid">
      <div>
        <h3 v-if="blok.title"
          v-text-reveal
          class="h1">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </h3>
        <p v-if="blok.description"
          v-text-reveal
          class="--grey">

        </p>
      </div>
      <div>
        <ul>
          <li v-for="item in blok.list"
            ref="$items"
            :key="item.label">
            <a-link :href="resolveLink(item.link)">
              <p class="p-big"> {{ item.label }}</p>
              <ui-arrow />
            </a-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap/all';
import { resolveLink } from '~/libs/storyblok/utils';
import { GSAPEase } from '~/libs/constants/gsap';
import { DATA_CONTENT_LIST } from '~/libs/data';

const { blok } = defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_CONTENT_LIST
  }
})



const $items = ref<HTMLLIElement[]>([]);
const initialize = () => {
  $items.value.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      ease: GSAPEase.SLOW_IN_OUT,
      scrollTrigger: {
        trigger: item,
        start: 'top 95%',
        end: 'bottom 85%',
        scrub: 3,
      }
    });
  });
}

tryOnMounted(() => {
  initialize();
});

tryOnBeforeUnmount(() => {
  $items.value.forEach((item) => {
    gsap.killTweensOf(item);
  });
});
</script>


<style lang="scss" scoped>
.layout-services {
  &__inner {
    >div {
      grid-column: -1 / 1;

      &:nth-child(1) {
        p {
          margin-top: var(--spacer-16);
        }
      }

      @include desktop {
        &:nth-child(1) {
          grid-column: 2 / span 4;
        }

        &:nth-child(2) {
          grid-column: 7 / span 5;
        }
      }
    }
  }

  ul {
    display: flex;
    flex-direction: column;

    li {
      position: relative;
      width: 100%;
      padding: var(--spacer-8) 0;
      border-bottom: 1px solid var(--grey-20);
      opacity: 0;

      @include desktop {
        transform: translateY(80px);
      }

      &:deep(.a-div) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacer-16);
      }
    }
  }

}
</style>
