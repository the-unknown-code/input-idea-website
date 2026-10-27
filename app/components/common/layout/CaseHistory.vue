<template>

  <section class="layout-case-history">
    <h1 class="h3">
      <storyblok-richtext :content="blok.title[0].text"
        cleanup />
    </h1>
    <div class="filters"
      aria-label="Filtra i progetti per tag">
      <button class="p-small"
        :class="{ active: selectedTags.length === 0 }"
        type="button"
        @click="selectedTags = []">Tutti</button>
      <button v-for="tag in availableTags"
        :key="tag"
        class="p-small"
        :class="{ active: selectedTags.includes(tag) }"
        type="button"
        @click="toggleTag(tag)">{{ tag }}</button>
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
            <common-media :src="storyblokFormat(item.media, 420)" />
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

            <ui-common-cta v-for="tag in item.tags"
              :key="tag"
              :label="tag"
              :href="`/servizi/${getFilterHref(tag)}`" />
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

const filters = [
  {
    id: 'Social Strategy',
    href: 'social-strategy'
  },
  {
    id: '3D Modeling',
    href: '3d-modeling'
  },
  {
    id: 'Custom Software',
    href: 'custom-software'
  },
  {
    id: 'SEO',
    href: 'seo'
  },
  {
    id: 'Website & E-Commerce',
    href: 'website-e-e-commerce'
  },
  {
    id: 'Website & Social Advertising',
    href: 'website-e-social-advertising'
  },
  {
    id: 'Strategic Marketing & Analysis',
    href: 'strategic-marketing-e-analysis'
  },
  {
    id: 'Brand Identity & Positioning',
    href: 'brand-identity-e-brand-positionin'
  },
  {
    id: 'Graphic Design',
    href: 'graphic-design'
  },
  {
    id: 'Copywriting, SEO & GEO',
    href: 'copywriting-seo-e-geo'
  },
  {
    id: 'CRM & Customer Data',
    href: 'crm'
  },
  {
    id: 'Social Media Marketing',
    href: 'social-media-marketing'
  },
  {
    id: 'Lead Generation',
    href: 'lead-generation'
  },
  {
    id: 'Data Governance',
    href: 'data-governance'
  },
  {
    id: 'Email Marketing',
    href: 'email-marketing'
  },

]


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

const selectedTags = ref<string[]>([])

const getFilterHref = (tag: string) => {
  return filters.find(filter => filter.id === tag)?.href ?? '#'
}

const toggleTag = (tag: string) => {
  selectedTags.value = selectedTags.value.includes(tag)
    ? selectedTags.value.filter(selectedTag => selectedTag !== tag)
    : [...selectedTags.value, tag]
}

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
  return selectedTags.value.length === 0
    ? projects.value
    : projects.value.filter(item => item.tags.some(tag => selectedTags.value.includes(tag)))
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
    margin-bottom: 32px;
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
      position: relative;
      color: inherit;
      cursor: pointer;
      transition: color .2s ease;
      border: 1px solid var(--grey);
      border-radius: 5px;
      padding: 4px 8px;

      font-size: 13px;

      &.active {
        border: 1px solid var(--yellow);
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



    >div {
      grid-column: -1 / 1;
      align-items: center;


      &:deep(.ui-arrow) {
        // width: 12px;

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

          .h2 {
            margin-bottom: 8px;
          }
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
        // aspect-ratio: 4;
        border-radius: 16px;
        overflow: hidden;

        display: flex;
        justify-content: center;
        align-items: center;

        >div {
          position: relative;
          width: 100%;
          height: auto;

          @include mobile {
            width: 240px;
            margin: 24px 0;
          }
        }

        @include desktop {
          width: 100%;
          height: 100%;
          aspect-ratio: unset;
          padding: 16px;
        }

      }
    }
  }
}
</style>
