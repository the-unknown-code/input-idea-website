<template>
  <section class="layout-focus-item">
    <div class="content title">
      <h1 class="h3">
        <storyblok-richtext :content="blok.title[0].text"
          cleanup />
      </h1>
      <p class="--yellow">{{ blok.description }}</p>
    </div>

    <div ref="$list"
      class="list"
      :class="{ 'is-desktop': isDesktop }">
      <div v-for="entry in visibleItems"
        :key="entry.slot"
        class="focus-slot"
        :class="{ 'is-active': entry.slot === 'current' || (!isDesktop && activeIndex === entry.index), 'is-neighbor': isDesktop && entry.slot !== 'current' }">
        <Transition :name="isDesktop ? (scrollDirection > 0 ? 'wheel-forward' : 'wheel-backward') : undefined">
          <div :key="entry.index"
            class="layout-grid">
            <div>
              <h2 class="display --yellow">
                <storyblok-richtext :content="entry.item.label[0].text"
                  cleanup />
              </h2>
            </div>
            <div class="content">
              <p><b>{{ entry.item.title }}</b></p>
              <p v-html="entry.item.description" />
            </div>
            <div v-show="isDesktop">
              <div class="display number --grey-600">0<b>{{ entry.index + 1 }}</b></div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ScrollTrigger } from 'gsap/all'
import { DATA_FOCUS_LIST } from '~/libs/data'

const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_FOCUS_LIST

  }
})

const { isDesktop } = useBreakpoints()
const $list = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const scrollDirection = ref(1)
const items = computed(() => props.blok?.list ?? [])
const visibleItems = computed(() => {
  const length = items.value.length
  if (!length) return []

  if (!isDesktop.value) {
    return items.value.map((item: any, index: number) => ({ item, index, slot: `mobile-${index}` }))
  }

  return ([-1, 0, 1] as const).map((offset) => {
    const index = (activeIndex.value + offset + length) % length
    return { item: items.value[index], index, slot: offset === 0 ? 'current' : offset < 0 ? 'previous' : 'next' }
  })
})

let scrollTrigger: ScrollTrigger | undefined
let previousProgress = 0

const updateActive = (progress: number, count: number) => {
  const nextIndex = Math.min(count - 1, Math.floor(progress * count))
  if (nextIndex !== activeIndex.value) {
    scrollDirection.value = progress >= previousProgress ? 1 : -1
    activeIndex.value = nextIndex
  }
  previousProgress = progress
}

const initialize = async () => {
  scrollTrigger?.kill()
  scrollTrigger = undefined
  await nextTick()
  if (!$list.value || !items.value.length) return

  activeIndex.value = 0
  previousProgress = 0
  const count = items.value.length
  scrollTrigger = isDesktop.value
    ? ScrollTrigger.create({
      trigger: $list.value,
      pin: true,
      pinSpacing: true,
      start: 'center center',
      end: () => `+=${Math.max(1, count) * window.innerHeight * 0.65}`,
      anticipatePin: 1,
      onUpdate: self => updateActive(self.progress, count)
    })
    : ScrollTrigger.create({
      trigger: $list.value,
      start: 'top 80%',
      end: 'bottom 20%',
      onUpdate: self => updateActive(self.progress, count)
    })
}

onMounted(() => {
  watch([isDesktop, () => items.value.length], initialize, { immediate: true })
})

onBeforeUnmount(() => scrollTrigger?.kill())
</script>


<style lang="scss" scoped>
.layout-focus-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    text-align: center;
    max-width: 960px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.title {
      justify-content: center;
      align-items: center;
    }
  }

  .list {
    width: 100%;
    max-width: 960px;
    display: flex;
    flex-direction: column;
    margin-top: 32px;
    gap: 32px;

    @include desktop {
      margin-top: 96px;
      max-width: none;
      width: calc(100% - 96px);
      height: min(600px, calc(100svh - 48px));
      display: grid;
      grid-template-rows: repeat(3, minmax(0, 1fr));
      gap: 0;
    }

    .focus-slot {
      position: relative;
      width: 100%;

      @include mobile {
        padding: 12px;
      }

      @include desktop {
        min-height: 0;
        perspective: 900px;
        transition: opacity 300ms var(--ease-out-circ);
      }

      .layout-grid {
        position: relative;
        align-items: center;

        @include desktop {
          height: 100%;
          padding: 12px 0;
        }

        >div {
          grid-column: -1 / 1;
          text-wrap: balance;

          &:nth-child(1) {
            @include desktop {
              padding-right: 24px;
              text-align: right;
              grid-column: span 4;
            }
          }

          &:nth-child(2) {
            @include desktop {
              grid-column: span 6;
            }
          }

          &:nth-child(3) {
            @include desktop {
              grid-column: span 2;
              text-align: right;
            }
          }
        }
      }

      &.is-neighbor {
        opacity: .12;
      }

      &::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% + 24px);
        height: calc(100% + 36px);
        border-radius: 32px;
        z-index: -1;
        transition: background-color 300ms var(--ease-out-circ);
        filter: drop-shadow(0px 0px 0px #00000055);

        @include desktop {
          width: calc(100% + 96px);
          height: calc(100% + 48px);
        }

      }

      .display {
        transition: all 300ms var(--ease-out-circ);
      }

      &.is-active {
        &::before {
          background-color: var(--yellow);
          filter: drop-shadow(0px 0px 20px #00000055);
        }

        .display:not(.number) {
          color: var(--darkgrey);
        }

        p {
          color: var(--darkgrey);
        }

        .display.number {
          opacity: .15;
        }
      }

    }

    @include desktop {

      .wheel-forward-enter-active,
      .wheel-forward-leave-active,
      .wheel-backward-enter-active,
      .wheel-backward-leave-active {
        transition: transform 480ms var(--ease-out-circ), opacity 480ms ease;
        backface-visibility: hidden;
      }

      .focus-slot .layout-grid.wheel-forward-leave-active,
      .focus-slot .layout-grid.wheel-backward-leave-active {
        position: absolute;
        inset: 0;
        width: 100%;
      }

      .wheel-forward-enter-from,
      .wheel-backward-leave-to {
        opacity: 0;
        transform: translateY(35%) rotateX(-18deg);
      }

      .wheel-forward-leave-to,
      .wheel-backward-enter-from {
        opacity: 0;
        transform: translateY(-35%) rotateX(18deg);
      }
    }
  }
}
</style>
