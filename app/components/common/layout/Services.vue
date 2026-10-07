<template>
  <section class="layout-services">
    <div class="layout-services__inner layout-grid">
      <div>
        <h3 v-if="blok.title"
          v-text-reveal>
          <storyblok-richtext :content="blok.title[0].text" />
        </h3>
        <p v-if="blok.description"
          v-text-reveal
          class="--grey">
          <storyblok-richtext :content="blok.description[0].text"
            :allowed-tags="['b', 'strong', 'br']" />
        </p>
      </div>
      <div>
        <ul class="layout-services__mobile-list">
          <li v-for="item in list"
            ref="$items"
            :key="item._uid ?? item.label">
            <a-link :href="resolveLink(item.link)">
              <p class="h2"> {{ item.label }}</p>
              <ui-arrow />
            </a-link>
          </li>
        </ul>
        <ul ref="$desktopList"
          class="layout-services__desktop-list">
          <li v-for="({ item, copy }, index) in loopedDesktopItems"
            :key="`${item._uid ?? item.label}-${copy}-${index}`">
            <a-link :href="resolveLink(item.link)">
              <p class="h2"> {{ item.label }}</p>
              <ui-arrow />
            </a-link>
          </li>
        </ul>
        <div v-if="list.length > 1"
          class="layout-services__controls">
          <button type="button"
            class="p-small --yellow"
            aria-label="Previous services"
            @click="previous">
            Previous
          </button>
          <button type="button"
            class="p-small --yellow"
            aria-label="Next services"
            @click="next">
            Next
          </button>
        </div>
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


const list = computed(() => Array.isArray(blok.list) ? blok.list : []);
const loopedDesktopItems = computed(() =>
  [0, 1, 2].flatMap((copy) => list.value.map((item) => ({ item, copy })))
);
const $desktopList = ref<HTMLUListElement | null>(null);
const activeIndex = ref(0);
let resetTimer: ReturnType<typeof setTimeout> | undefined;
let isScrolling = false;

const getItemOffset = (index: number) => {
  const viewport = $desktopList.value;
  const first = viewport?.firstElementChild as HTMLElement | null;
  const item = viewport?.children.item(index) as HTMLElement | null;
  return viewport && first && item ? item.offsetTop - first.offsetTop : null;
};

const centerDesktopList = () => {
  const offset = getItemOffset(list.value.length);
  if (offset !== null) $desktopList.value?.scrollTo({ top: offset, behavior: 'auto' });
};

const scrollToIndex = (index: number, resetIndex?: number) => {
  const viewport = $desktopList.value;
  const offset = getItemOffset(index);
  if (!viewport || offset === null) return;

  viewport.scrollTo({
    top: offset,
    behavior: 'smooth',
  });

  if (resetIndex === undefined) return;

  isScrolling = true;
  clearTimeout(resetTimer);
  resetTimer = setTimeout(() => {
    const resetOffset = getItemOffset(resetIndex);
    if (resetOffset !== null) viewport.scrollTo({ top: resetOffset, behavior: 'auto' });
    isScrolling = false;
  }, 450);
};

const previous = () => {
  const itemCount = list.value.length;
  if (!itemCount || isScrolling) return;
  const wrapped = activeIndex.value === 0;
  activeIndex.value = (activeIndex.value - 1 + list.value.length) % list.value.length;
  scrollToIndex(
    itemCount + activeIndex.value - (wrapped ? itemCount : 0),
    wrapped ? itemCount + activeIndex.value : undefined,
  );
};

const next = () => {
  const itemCount = list.value.length;
  if (!itemCount || isScrolling) return;
  const wrapped = activeIndex.value === itemCount - 1;
  activeIndex.value = (activeIndex.value + 1) % list.value.length;
  scrollToIndex(
    itemCount + activeIndex.value + (wrapped ? itemCount : 0),
    wrapped ? itemCount + activeIndex.value : undefined,
  );
};

watch(list, async () => {
  activeIndex.value = 0;
  await nextTick();
  centerDesktopList();
});

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
  nextTick(centerDesktopList);
});

tryOnBeforeUnmount(() => {
  clearTimeout(resetTimer);
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
          grid-column: 6 / span 6;
        }
      }
    }
  }

  &__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;

    button {
      cursor: pointer;
      text-transform: uppercase;
    }

    @include mobile {
      display: none;
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

  ul.layout-services__mobile-list {
    @include desktop {
      display: none;
    }
  }

  ul.layout-services__desktop-list {
    position: relative;
    height: 400px;
    box-sizing: border-box;
    padding-block: 40px;
    overflow-y: auto;
    scrollbar-width: none;
    mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%);

    &::-webkit-scrollbar {
      display: none;
    }

    @include mobile {
      display: none;
    }

    li {
      flex: none;
      opacity: 1;
      transform: none;
    }
  }

}
</style>
