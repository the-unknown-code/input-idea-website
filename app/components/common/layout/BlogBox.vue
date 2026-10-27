<template>
  <section class="layout-blog-box">
    <div class="layout-blog-box__inner layout-grid">
      <div class="content">
        <div class="title display">
          <storyblok-richtext :content="blok.title[0].text"
            cleanup />
        </div>
        <div class="p --grey">
          <storyblok-richtext :content="blok.description[0].text"
            cleanup />
        </div>
        <a-link :href="resolveLink(blok.global_link[0].link)">
          <ui-common-cta :label="blok.global_link[0].label"
            href="/blog" />
        </a-link>
      </div>
      <div v-if="articles.length"
        class="articles-slider">
        <div class="articles-slider__viewport">
          <div v-for="(article, index) in visibleArticles"
            :key="article._uid || index"
            class="articles-slider__item"
            :class="{ 'is-active': index === 0 }">
            <ui-blog-card-item :blok="article" />
          </div>
        </div>
        <div v-if="articles.length > 1"
          class="articles-slider__controls">
          <ui-arrow-button reverse
            :callback="previousBlog" />
          <ui-arrow-button :callback="nextBlog" />
        </div>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { DATA_ARTICLE_BLOCK } from '~/libs/data';
import { resolveLink } from '~/libs/storyblok/utils';


const props = defineProps({
  blok: {
    type: Object,
    required: false,
    default: DATA_ARTICLE_BLOCK
  }
})

const activeArticle = ref(0)
const articles = computed(() => Array.isArray(props.blok?.articles) ? props.blok.articles : [])
const visibleArticles = computed(() => {
  if (articles.value.length <= 2) return articles.value

  const current = activeArticle.value % articles.value.length
  return [
    articles.value[current],
    articles.value[(current + 1) % articles.value.length]
  ]
})

const nextBlog = () => {
  if (articles.value.length) activeArticle.value = (activeArticle.value + 1) % articles.value.length
}

const previousBlog = () => {
  if (articles.value.length) activeArticle.value = (activeArticle.value - 1 + articles.value.length) % articles.value.length
}


</script>

<style lang="scss" scoped>
.layout-blog-box {
  position: relative;
  background-color: var(--lightgrey);
  padding: var(--spacer-32);
  border-radius: var(--spacer-16);

  &__inner {
    position: relative;
    grid-template-columns: repeat(1, 1fr);

    @include desktop {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spacer-16);

    @include desktop {
      padding-right: var(--spacer-32);
    }

    .cta {
      position: relative;
      display: inline-flex;
      align-items: flex-end;
      gap: var(--spacer-8);
      width: max-content;
      max-width: 100%;
      margin-top: var(--spacer-32);

      &:deep(.ui-arrow) {
        flex: 0 0 16px;
        width: 16px;
        transform: translateY(-2px);
        transition: all 250ms var(--ease-in-out-quint);
      }

      @include hover {
        &:hover {
          span {
            color: var(--yellow);
          }

          &:deep(.ui-arrow) {
            transform: translate(2px, -2px)
          }
        }
      }
    }
  }

  .articles-slider {
    min-width: 0;
    height: auto;
    overflow: visible;

    @include desktop {
      grid-column: span 2;
    }

    &__viewport {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--spacer-32);
      height: auto;
      min-height: 0;
      align-items: start;
      overflow: visible;
      mask-image: linear-gradient(to right, #000 0%, #000 22%, rgb(0 0 0 / 0.08) 100%);

    }

    &__item {
      min-width: 0;
      height: auto;
      overflow: visible;
      transition: transform 300ms ease;
      pointer-events: none;

      &.is-active {
        position: relative;
        z-index: 1;
        transform-origin: top left;
        pointer-events: all;
      }
    }

    &__controls {
      display: flex;
      gap: 4px;
      margin-top: var(--spacer-32);
    }
  }

  @include mobile {
    .articles-slider__viewport {
      grid-template-columns: 1fr;
      mask-image: none;
      -webkit-mask-image: none;
    }

    .articles-slider__item:not(.is-active) {
      display: none;
    }
  }

}
</style>
