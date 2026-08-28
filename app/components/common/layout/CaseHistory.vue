<template>
  <section class="layout-case-history">
    <h1 class="display">
      <storyblok-richtext :content="blok.title[0].text"
        cleanup />
    </h1>
    <div class="filters"
      aria-label="Filtra i progetti per tag">
      <button class="p-small"
        :class="{ active: selectedTag === null }"
        type="button"
        @click="selectedTag = null">Tutti</button>
      <button v-for="tag in availableTags"
        :key="tag as any"
        class="p-small"
        :class="{ active: selectedTag === tag }"
        type="button"
        @click="selectedTag = tag as any">{{ tag }}</button>
    </div>
    <div class="list">
      <div v-for="item in filteredItems"
        :key="item._uid"
        class="layout-grid">
        <div>
          <div class="media">
            <common-media :src="storyblokFormat(item.media[0].image.filename, 420)"
              cover />
          </div>
        </div>
        <div>
          <p class="h2 --yellow">{{ item.title }}</p>
          <p class="p-small --grey">
            <storyblok-richtext :content="item.description[0].text"
              cleanup />
          </p>
          <div class="tags">
            <p v-for="tag in item.tags"
              :key="tag"
              class="p-tiny --yellow">{{ tag }}</p>
          </div>
        </div>
        <div>
          <ui-arrow />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PORTFOLIO } from '~/libs/data';
import { storyblokFormat } from '~/libs/storyblok';


const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: PORTFOLIO
  }
})

const selectedTag = ref<string | null>(null)

const availableTags = computed(() => {
  const tags = props.blok?.list?.flatMap((item: { tags?: string[] }) => item.tags ?? []) ?? []
  return [...new Set(tags)].sort((first, second) => (first as string).localeCompare(second as string))
})

const filteredItems = computed(() => {
  const items = props.blok?.list ?? []
  return selectedTag.value === null
    ? items
    : items.filter((item: { tags?: string[] }) => item.tags?.includes(selectedTag.value as string))
})

</script>

<style lang="scss" scoped>
.layout-case-history {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;


  h1 {
    text-align: center;
    max-width: 1280px;
  }

  .tags {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
  }

  .filters {
    position: relative;
    background-color: var(--lightgrey);
    border-radius: 16px;
    padding: 16px;
    display: flex;
    flex-direction: row;
    gap: 8px;
    color: var(--grey);
    flex-wrap: wrap;

    button {
      color: inherit;
      cursor: pointer;
      transition: color .2s ease;

      &.active {
        color: var(--yellow);
      }
    }
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .layout-grid {
    position: relative;
    padding: 16px 16px;
    border-bottom: 1px solid var(--grey-600);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;

    @include mobile {
      gap: 16px;
    }

    @include hover {
      &:hover {
        background-color: var(--yellow);

        .display,
        p {
          color: var(--darkgrey);
        }

        &:deep(.ui-arrow) {
          path {
            fill: var(--darkgrey);
          }
        }
      }
    }

    >div {
      grid-column: -1 / 1;
      align-items: center;


      &:deep(.ui-arrow) {
        width: 36px;

        svg {
          width: 100%;
          height: auto;
        }
      }

      &:nth-child(1) {
        @include desktop {
          grid-column: span 2;
        }
      }

      &:nth-child(2) {
        @include desktop {
          padding: 16px;
          grid-column: span 8;
        }
      }

      &:nth-child(3) {
        display: none;

        @include desktop {
          display: flex;
          justify-content: flex-end;
          grid-column: span 2;
        }
      }

      .media {
        position: relative;
        width: 100%;
        aspect-ratio: 4;
        border-radius: 16px;
        overflow: hidden;

        @include desktop {
          width: 100%;
          height: 100%;
          aspect-ratio: unset;
        }

      }
    }
  }
}
</style>
