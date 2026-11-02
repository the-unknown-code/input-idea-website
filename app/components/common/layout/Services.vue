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
          <storyblok-richtext :content="blok.description[0].text" />
        </p>
      </div>
      <div>
        <ul class="layout-services__mobile-list">
          <li v-for="item in list"
            ref="$items"
            :key="item._uid ?? item.label">
            <a-link :href="resolveLink(item.link)">
              <p class="h2-alt"> {{ item.label }}</p>
              <ui-arrow />
            </a-link>
          </li>
        </ul>
        <ul ref="$desktopList"
          class="layout-services__desktop-list"
          :style="{ '--mask-start': `${maskStart}px`, '--mask-end': `${maskEnd}px` }">
          <li v-for="({ item, copy }, index) in loopedDesktopItems"
            :key="`${item._uid ?? item.label}-${copy}-${index}`"
            :class="{ 'is-active': isCentered(index) }">
            <a-link :href="resolveLink(item.link)">
              <p :class="['h2-alt', { '--yellow': isCentered(index) }]"> {{ item.label }}</p>
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
            <ui-arrow-button reverse />
          </button>
          <div class="counter p">
            {{ activeIndex + 1 }} / {{ list.length }}
          </div>
          <button type="button"
            class="p-small --yellow"
            aria-label="Next services"
            @click="next">
            <ui-arrow-button />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap';
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

console.log(">>", blok)

const list = computed(() => Array.isArray(blok.list) ? blok.list : []);
const loopedDesktopItems = computed(() =>
  [0, 1, 2].flatMap((copy) => list.value.map((item) => ({ item, copy })))
);
const $desktopList = ref<HTMLUListElement | null>(null);
const activeIndex = ref(0);
let resetTimer: ReturnType<typeof setTimeout> | undefined;
let isScrolling = false;

const isCentered = (index: number) => index === list.value.length + activeIndex.value + 2;

// mask band that reveals only the centered/active row (row = top row + 2)
const maskStart = ref(0);
const maskEnd = ref(400);
let topIndex = 0;

const updateMask = (index: number = topIndex) => {
  topIndex = index;
  const viewport = $desktopList.value;
  const top = viewport?.children.item(index) as HTMLElement | null;
  const centered = viewport?.children.item(index + 2) as HTMLElement | null;
  const first = viewport?.firstElementChild as HTMLElement | null;
  if (!viewport || !top || !centered || !first) return;
  // final scroll position for this top row (clamped like the browser does)
  const scroll = Math.min(top.offsetTop - first.offsetTop, viewport.scrollHeight - viewport.clientHeight);
  maskStart.value = centered.offsetTop - scroll;
  maskEnd.value = maskStart.value + centered.offsetHeight;
};

const getItemOffset = (index: number) => {
  const viewport = $desktopList.value;
  const first = viewport?.firstElementChild as HTMLElement | null;
  const item = viewport?.children.item(index) as HTMLElement | null;
  return viewport && first && item ? item.offsetTop - first.offsetTop : null;
};

const centerDesktopList = () => {
  const offset = getItemOffset(list.value.length);
  if (offset !== null) $desktopList.value?.scrollTo({ top: offset, behavior: 'auto' });
  updateMask(list.value.length);
};

const scrollToIndex = (index: number, resetIndex?: number) => {
  const viewport = $desktopList.value;
  const offset = getItemOffset(index);
  if (!viewport || offset === null) return;

  updateMask(index);
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
  // row heights change once fonts load / on resize
  document.fonts?.ready.then(() => updateMask());
});

useResizeObserver($desktopList, () => updateMask());

tryOnBeforeUnmount(() => {
  clearTimeout(resetTimer);
  $items.value.forEach((item) => {
    gsap.killTweensOf(item);
  });
});
</script>


<style lang="scss" scoped>
// registered so the mask band can animate between rows of different height
@property --mask-start {
  syntax: '<length>';
  inherits: false;
  initial-value: 0px;
}

@property --mask-end {
  syntax: '<length>';
  inherits: false;
  initial-value: 400px;
}

.layout-services {
  &__inner {
    >div {
      grid-column: -1 / 1;

      &:nth-child(1) {
        @include desktop {
          padding-right: 32px;
        }

        p {
          margin-top: var(--spacer-16);
        }
      }

      @include desktop {
        padding-right: 48px;

        &:nth-child(1) {

          grid-column: 2 / span 4;
        }

        &:nth-child(2) {
          grid-column: 6 / span 6;
        }
      }
    }
  }

  .counter {
    position: relative;
    width: auto;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2px;
    border-radius: 5px;
    border: 1px solid white;
    padding: 0 12px;

    font-size: 12px;
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

      &:deep(.h2) {
        transition: color 200ms ease;
      }

      @include hover {
        &:hover {
          &:deep(.h2) {
            color: var(--yellow);
          }
        }
      }
    }
  }

  ul.layout-services__mobile-list {
    @include desktop {
      display: none;
    }

    li {

      p {
        padding-right: 16px;
      }
    }
  }

  ul.layout-services__desktop-list {
    position: relative;
    height: 400px;
    box-sizing: border-box;
    padding-block: 40px;
    overflow-y: auto;
    scrollbar-width: none;
    // active (centered) row fully visible, neighbours fade out softly; band follows it on navigation
    --mask-fade: 120px;
    mask-image: linear-gradient(to bottom,
        transparent calc(var(--mask-start) - var(--mask-fade)),
        black var(--mask-start),
        black var(--mask-end),
        transparent calc(var(--mask-end) + var(--mask-fade)));
    transition: --mask-start 450ms ease, --mask-end 450ms ease;

    &::-webkit-scrollbar {
      display: none;
    }

    @include mobile {
      display: none;
    }

    li {
      flex: none;
      opacity: 0.25; // non-active rows are dimmed (on top of the mask fade)
      transform: none;
      transition: opacity 450ms ease;

      &.is-active {
        opacity: 1;
      }

      @include hover {
        &:hover {
          .h2-alt {
            color: var(--yellow);
          }
        }
      }

      p {
        padding-right: 32px;
        text-wrap: balance;
      }
    }
  }

}
</style>
