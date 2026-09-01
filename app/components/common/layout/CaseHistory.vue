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
        :key="tag"
        class="p-small"
        :class="{ active: selectedTag === tag }"
        type="button"
        @click="selectedTag = tag">{{ tag }}</button>
    </div>
    <div class="list">
      <nuxt-link v-for="item in filteredItems"
        :key="item.id"
        :to="item.href"
        :aria-label="`Apri il progetto ${item.title}`"
        class="layout-grid">
        <div>
          <div v-if="item.media"
            class="media">
            <common-media :src="storyblokFormat(item.media, 420)"
              cover />
          </div>
        </div>
        <div>
          <p class="h2 --yellow">{{ item.title }}</p>
          <div v-if="item.description"
            class="p-small --grey">
            <storyblok-richtext :content="item.description as StoryblokRichTextInput"
              cleanup />
          </div>
          <div class="tags">
            <p v-for="tag in item.tags"
              :key="tag"
              class="p-tiny --yellow">{{ tag }}</p>
          </div>
        </div>
        <div>
          <ui-arrow />
        </div>
      </nuxt-link>
    </div>
  </section>

</template>

<script setup lang="ts">
import type { StoryblokRichTextInput } from '@storyblok/richtext';
import { PORTFOLIO } from '~/libs/data';
import { storyblokFormat } from '~/libs/storyblok';

type ProjectContent = {
  _uid?: string
  title?: string
  tags?: string[]
  media?: Array<{ image?: { filename?: string } }>
  description?: Array<{ text?: unknown }>
}

type ResolvedProject = ProjectContent & {
  id?: number
  uuid?: string
  name?: string
  full_slug?: string
  content?: ProjectContent
}

type ProjectCard = {
  id: string
  href: string
  title: string
  tags: string[]
  media: string
  description?: unknown
}


const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: PORTFOLIO
  }
})

const selectedTag = ref<string | null>(null)

const projects = computed<ProjectCard[]>(() => {
  const list = (props.blok?.list ?? []) as ResolvedProject[]

  return list.map((project) => {
    const content = project.content ?? project

    return {
      id: project.uuid ?? content._uid ?? String(project.id),
      href: project.full_slug ? `/${project.full_slug}` : '#',
      title: content.title ?? project.name ?? '',
      tags: content.tags ?? [],
      media: content.media?.[0]?.image?.filename ?? '',
      description: content.description?.[0]?.text,
    }
  })
})

const availableTags = computed(() => {
  const tags = projects.value.flatMap(item => item.tags)
  return [...new Set(tags)].sort((first, second) => first.localeCompare(second))
})

const filteredItems = computed(() => {
  return selectedTag.value === null
    ? projects.value
    : projects.value.filter(item => item.tags.includes(selectedTag.value as string))
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
    width: 100%;
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
