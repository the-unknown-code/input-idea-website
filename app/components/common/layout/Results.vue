<!--
  Results <layout-results />
  Desktop: left = rotating stat card + text card, right = main photo + square thumbnail selector.
  Mobile: everything stacks (stat, text, photo, thumbnails).

  Storyblok component: "Results"
   • title: AdvancedText (.h3; bold = heavy) e.g. "I **Risultati**"
   • description: AdvancedText
   • values: SimpleTextBlock { title: "+30%", description: AdvancedText (label under the number) }
   • carousel: SimpleImage { image }
-->
<template>
  <section class="layout-results">
    <div class="layout-results__col">
      <!-- stat card -->
      <div v-if="stats.length"
        class="stat-card">
        <Transition name="fade"
          mode="out-in">
          <h2 :key="activeStat"
            class="stat-card__value h2"
            aria-live="polite">
            {{ stats[activeStat]?.prefix }}<b>{{ stats[activeStat]?.value }}</b>{{ stats[activeStat]?.suffix }}
          </h2>
        </Transition>
        <div class="stat-card__footer">
          <Transition name="fade"
            mode="out-in">
            <div :key="activeStat"
              class="stat-card__label p --grey">
              <storyblok-richtext v-if="stats[activeStat]?.label"
                :content="stats[activeStat]?.label" />
            </div>
          </Transition>
          <div v-if="stats.length > 1"
            class="dots">
            <button v-for="(stat, i) in stats"
              :key="i"
              type="button"
              :class="{ active: i === activeStat }"
              :aria-label="`Mostra risultato ${i + 1}`"
              @click="selectStat(i)" />
          </div>
        </div>
      </div>

      <!-- text card -->
      <div class="text-card">
        <h3 class="text-card__title h3">
          <storyblok-richtext v-if="hasText(richOf(blok.title))"
            :content="richOf(blok.title)" />
          <template v-else>I <strong>Risultati</strong></template>
        </h3>
        <div v-if="description"
          class="text-card__description p">
          <storyblok-richtext v-if="isRich(description)"
            :content="richOf(description)"
            :allowed-tags="['p', 'b', 'strong', 'br', 'i', 'a']" />
          <template v-else>{{ description }}</template>
        </div>
      </div>
    </div>

    <div v-if="media.length"
      class="layout-results__col">
      <!-- main photo -->
      <div class="photo">
        <Transition name="fade">
          <common-media v-if="media.length && media[activeMedia]"
            :key="media[activeMedia]?.src"
            :src="storyblokFormat(media[activeMedia]?.src ?? '', 1280)"
            cover />
        </Transition>
        <span class="photo__counter p-small">{{ activeMedia + 1 }} / {{ media.length }}</span>
      </div>

      <!-- thumbnails (square) -->
      <div v-if="media.length > 1"
        class="thumbs">
        <button type="button"
          class="thumbs__nav thumbs__nav--prev"
          aria-label="Foto precedente"
          @click="selectMedia(activeMedia - 1)">
          <svg viewBox="0 0 16 28"
            aria-hidden="true">
            <path d="M14 2 2 14l12 12" />
          </svg>
        </button>
        <div ref="$track"
          class="thumbs__track">
          <button v-for="(item, i) in media"
            :key="item.src"
            type="button"
            :class="['thumbs__item', { active: i === activeMedia }]"
            :aria-label="`Foto ${i + 1}`"
            @click="selectMedia(i)">
            <common-media :src="storyblokFormat(item.src, 240, 1)"
              :size="240"
              cover />
          </button>
        </div>
        <button type="button"
          class="thumbs__nav thumbs__nav--next"
          aria-label="Foto successiva"
          @click="selectMedia(activeMedia + 1)">
          <svg viewBox="0 0 16 28"
            aria-hidden="true">
            <path d="m2 2 12 12L2 26" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getMedia, storyblokFormat } from '~/libs/storyblok';

type Stat = { prefix: string; value: string; suffix: string; label: any };

const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: () => ({
      values: [
        { title: '+30%', description: 'Lorem ipsum dolor' },
        { title: '+55%', description: 'Lorem ipsum dolor' },
      ],
      carousel: [],
    }),
  },
});

// AdvancedText fields arrive as [{ text: <richtext doc> }]
const richOf = (field: any) => (Array.isArray(field) ? field[0]?.text : field);
const isRich = (field: any) => !!field && typeof field === 'object';
// true when a richtext doc (or string) has any actual text
const hasText = (node: any): boolean =>
  typeof node === 'string' ? node.trim().length > 0 : !!node && (!!node.text?.trim() || (node.content ?? []).some(hasText));

const description = computed(() => (hasText(richOf(props.blok.description)) ? props.blok.description : null));

// "+30%" -> prefix "+", value "30", suffix "%"
const splitValue = (raw: string = '') => {
  const m = String(raw).trim().match(/^([^\d]*)([\d.,]+)(.*)$/);
  return m ? { prefix: m[1], value: m[2], suffix: m[3] } : { prefix: '', value: String(raw), suffix: '' };
};

// typed list helper: `cond ? any[] : []` is a union (any[] | never[]) and breaks .map/.filter overloads
const listOf = (field: unknown): any[] => (Array.isArray(field) ? field : []);

const stats = computed<Stat[]>(() =>
  listOf(props.blok.values).map((item): Stat => {
    const desc = richOf(item.description);
    const label = richOf(item.label);
    return {
      ...splitValue(item.title),
      // label under the number: description, else label (skip empty docs)
      label: hasText(desc) ? desc : hasText(label) ? label : null,
    };
  })
);

const media = computed<{ src: string }[]>(() =>
  listOf(props.blok.carousel)
    .map((item): string | undefined => getMedia(item)?.image?.src ?? item?.filename)
    .filter((src): src is string => !!src)
    .map(src => ({ src }))
);

// stats: auto-rotate every 4s (client only, so SSR and hydration match)
const activeStat = ref(0);
const { pause, resume } = useIntervalFn(
  () => (activeStat.value = (activeStat.value + 1) % Math.max(1, stats.value.length)),
  4000,
  { immediate: false }
);
onMounted(() => stats.value.length > 1 && resume());
const selectStat = (i: number) => {
  activeStat.value = i;
  pause();
  resume(); // restart the timer after a manual pick
};

// photos
const activeMedia = ref(0);
const $track = ref<HTMLElement | null>(null);
const selectMedia = (i: number) => {
  const count = media.value.length;
  if (!count) return;
  activeMedia.value = (i + count) % count;
  // center the active thumbnail without scrolling the page
  const track = $track.value;
  const thumb = track?.children.item(activeMedia.value) as HTMLElement | null;
  if (track && thumb) {
    track.scrollTo({ left: thumb.offsetLeft - (track.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' });
  }
};
</script>

<style lang="scss" scoped>
.layout-results {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacer-16);
  max-width: 1920px;
  margin: 0 auto;

  @include desktop {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacer-32);
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-16);
    min-width: 0;

    @include desktop {
      gap: var(--spacer-32);
    }
  }
}

/* ---------- stat card ---------- */
.stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 260px;
  padding: var(--spacer-32);
  border: 1px solid var(--yellow);
  border-radius: 24px;
  background: var(--darkgrey);

  @include desktop {
    min-height: 400px;
    padding: var(--spacer-32) 48px;
  }

  &__value {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    white-space: nowrap; // prefix, number and suffix always on one line
    color: var(--yellow);
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacer-16);
  }

  .dots {
    display: flex;
    gap: 8px;

    button {
      width: 12px;
      height: 8px;
      padding: 0;
      border-radius: 8px;
      background: var(--white);
      cursor: pointer;
      transition: width 300ms ease, background-color 300ms ease;

      &.active {
        width: 40px;
        background: var(--yellow);
      }
    }
  }
}

/* ---------- text card ---------- */
.text-card {
  padding: var(--spacer-32);
  border-radius: 24px;
  background: var(--lightgrey);

  @include desktop {
    padding: 48px;
  }

  &__title {
    margin-bottom: var(--spacer-32);
    color: var(--white);
  }

  &__description {
    color: var(--grey);

    &:deep(p) {
      margin-bottom: 1em;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &:deep(b),
    &:deep(strong) {
      color: var(--white);
    }
  }
}

/* ---------- photo ---------- */
.photo {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: 24px;
  overflow: hidden;

  @include desktop {
    flex: 1;
    aspect-ratio: auto;
    min-height: 360px;
  }

  &:deep(.common-media) {
    position: absolute;
    inset: 0;
  }

  &__counter {
    position: absolute;
    left: var(--spacer-32);
    bottom: var(--spacer-32);
    z-index: 1;
    padding: 6px 12px;
    border-radius: 8px;
    background: var(--yellow);
    color: var(--darkgrey);
  }
}

/* ---------- thumbnails ---------- */
.thumbs {
  position: relative;
  padding: var(--spacer-16);
  border: 1px solid var(--yellow);
  border-radius: 24px;

  &__track {
    display: flex;
    gap: var(--spacer-16);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    // edges fade out under the arrows
    mask-image: linear-gradient(to right, transparent 0, black 15%, black 85%, transparent 100%);

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    flex: 0 0 calc((100% - 3 * var(--spacer-16)) / 4.5);
    aspect-ratio: 1;
    padding: 0;
    border: 2px solid transparent;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    scroll-snap-align: center;
    transition: border-color 200ms ease;

    @include mobile {
      flex-basis: calc((100% - 2 * var(--spacer-16)) / 3);
    }

    &.active {
      border-color: var(--yellow);
    }

    &:deep(.common-media) {
      width: 100%;
      height: 100%;
    }
  }

  &__nav {
    position: absolute;
    top: 50%;
    z-index: 1;
    width: 32px;
    height: 48px;
    padding: 8px;
    transform: translateY(-50%);
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: var(--yellow);
      stroke-width: 3;
    }

    &--prev {
      left: var(--spacer-32);
    }

    &--next {
      right: var(--spacer-32);
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 400ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
